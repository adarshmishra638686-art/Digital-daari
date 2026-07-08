import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditor from "@/components/RichTextEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  CalendarClock,
  ChevronRight,
  Clock3,
  Eye,
  Filter,
  ImageUp,
  LineChart,
  Pencil,
  Search,
  Sparkles,
  Target,
  Trash2,
  Plus,
  Mail,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

type PostStatus = "draft" | "published" | "archived";
type StatusFilter = "all" | PostStatus;

type BlogFormData = {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  tags: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  keywords: string;
  status: PostStatus;
  scheduleAt: string;
};

const initialForm: BlogFormData = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  featuredImage: "",
  tags: "",
  metaTitle: "",
  metaDescription: "",
  canonicalUrl: "",
  keywords: "",
  status: "published",
  scheduleAt: "",
};

const statusLabel: Record<PostStatus, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};


function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeFeaturedImageUrl(value: string) {
  const normalized = value.trim();
  if (!normalized) return "";

  // Local machine file paths cannot be rendered from a web app in browser.
  if (normalized.toLowerCase().startsWith("file://")) {
    return "";
  }

  return normalized;
}

function extractFirstImageSrcFromHtml(html: string) {
  const match = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  return match?.[1]?.trim() || "";
}

export default function BlogAdmin() {
  useAuth({
    redirectOnUnauthenticated: true,
    redirectPath: "/auth",
  });

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [formData, setFormData] = useState<BlogFormData>(initialForm);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [isFeaturedImageUploading, setIsFeaturedImageUploading] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  // Queries
  const { data: posts, isLoading, refetch } = trpc.blog.list.useQuery({
    status: statusFilter === "all" ? undefined : statusFilter,
    search: debouncedSearch,
    limit: 50,
  });

  const { data: contactLeads, isLoading: isLeadsLoading } = trpc.contact.list.useQuery({
    limit: 12,
    offset: 0,
  });

  const categories = useMemo(() => {
    const source = posts ?? [];
    return Array.from(
      new Set(
        source
          .flatMap((post) => post.tags?.split(",") ?? [])
          .map((tag) => tag.trim())
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [posts]);

  const visiblePosts = useMemo(() => {
    const source = posts ?? [];
    if (categoryFilter === "all") {
      return source;
    }

    return source.filter((post) =>
      post.tags
        ?.split(",")
        .map((tag) => tag.trim())
        .includes(categoryFilter)
    );
  }, [categoryFilter, posts]);

  const analyticsData = useMemo(() => {
    const source = posts ?? [];
    const now = new Date();
    const monthKeys: string[] = [];
    const monthViews: Record<string, number> = {};
    const monthPublishes: Record<string, number> = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthKeys.push(key);
      monthViews[key] = 0;
      monthPublishes[key] = 0;
    }

    for (const post of source) {
      const publishedDate = post.publishedAt ? new Date(post.publishedAt) : new Date(post.createdAt);
      const key = `${publishedDate.getFullYear()}-${String(publishedDate.getMonth() + 1).padStart(2, "0")}`;
      if (!monthViews[key]) continue;

      monthViews[key] += post.viewCount || 0;
      if (post.status === "published") {
        monthPublishes[key] += 1;
      }
    }

    const monthlyViews = monthKeys.map((key) => {
      const dateFromKey = new Date(`${key}-01T00:00:00`);
      return {
        month: dateFromKey.toLocaleDateString(undefined, { month: "short" }),
        views: monthViews[key],
      };
    });

    const publishingTrend = monthKeys.map((key) => {
      const dateFromKey = new Date(`${key}-01T00:00:00`);
      return {
        month: dateFromKey.toLocaleDateString(undefined, { month: "short" }),
        posts: monthPublishes[key],
      };
    });

    const topPosts = [...source]
      .map((post) => ({
        ...post,
        traffic: post.viewCount || 0,
      }))
      .sort((a, b) => b.traffic - a.traffic)
      .slice(0, 5);

    const totalViews = topPosts.reduce((sum, post) => sum + post.traffic, 0);

    return {
      monthlyViews,
      publishingTrend,
      topPosts,
      totalViews,
      publishedCount: source.filter((post) => post.status === "published").length,
    };
  }, [posts]);

  // Mutations
  const createMutation = trpc.blog.create.useMutation({
    onSuccess: () => {
      toast.success("Blog post created successfully!");
      resetForm();
      setIsOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create blog post");
    },
  });

  const updateMutation = trpc.blog.update.useMutation({
    onSuccess: () => {
      toast.success("Blog post updated successfully!");
      resetForm();
      setIsOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update blog post");
    },
  });

  const deleteMutation = trpc.blog.delete.useMutation({
    onSuccess: () => {
      toast.success("Blog post deleted successfully!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete blog post");
    },
  });

  const mediaUploadMutation = trpc.media.upload.useMutation();

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
    setSlugManuallyEdited(false);
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: slugManuallyEdited ? prev.slug : normalizeSlug(title),
    }));
  };

  const handleSlugChange = (rawSlug: string) => {
    const slug = normalizeSlug(rawSlug);
    setSlugManuallyEdited(slug.length > 0);
    setFormData((prev) => ({
      ...prev,
      slug,
    }));
  };



  const validateForm = (data: BlogFormData): string | null => {
    if (!data.title || !data.slug || !data.content) {
      return "Please fill in title, slug, and content.";
    }

    const normalizedSlug = normalizeSlug(data.slug);
    if (!normalizedSlug) {
      return "Please enter a valid slug.";
    }

    if (data.metaTitle && data.metaTitle.length > 60) {
      return "Meta title should be up to 60 characters.";
    }

    if (data.metaDescription && data.metaDescription.length > 160) {
      return "Meta description should be up to 160 characters.";
    }

    if (data.featuredImage.trim().toLowerCase().startsWith("file://")) {
      return "Featured image cannot use file:// path. Upload image or use https URL.";
    }

    if (data.canonicalUrl) {
      try {
        new URL(data.canonicalUrl);
      } catch {
        return "Canonical URL must be a valid URL.";
      }
    }

    const keywordCount = data.keywords
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean).length;
    if (keywordCount > 12) {
      return "Use up to 12 keywords for better SEO focus.";
    }

    if (data.scheduleAt) {
      const scheduledDate = new Date(data.scheduleAt);
      if (Number.isNaN(scheduledDate.getTime())) {
        return "Scheduled publish date is invalid.";
      }
    }

    return null;
  };

  const buildPayload = (data: BlogFormData) => {
    const now = new Date();
    const scheduleDate = data.scheduleAt ? new Date(data.scheduleAt) : undefined;
    const hasFutureSchedule = !!scheduleDate && scheduleDate.getTime() > now.getTime();

    const status: PostStatus = hasFutureSchedule ? "draft" : data.status;
    const publishedAt = hasFutureSchedule
      ? scheduleDate
      : status === "published"
        ? scheduleDate ?? now
        : undefined;
    const featuredImage =
      normalizeFeaturedImageUrl(data.featuredImage) ||
      extractFirstImageSrcFromHtml(data.content);

    return {
      title: data.title.trim(),
      slug: normalizeSlug(data.slug),
      content: data.content,
      excerpt: data.excerpt.trim() || undefined,
      featuredImage: featuredImage || undefined,
      tags: data.tags.trim() || undefined,
      metaTitle: data.metaTitle.trim() || undefined,
      metaDescription: data.metaDescription.trim() || undefined,
      canonicalUrl: data.canonicalUrl.trim() || undefined,
      keywords: data.keywords.trim() || undefined,
      status,
      publishedAt,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm(formData);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const payload = buildPayload(formData);

    if (editingId) {
      await updateMutation.mutateAsync({
        id: editingId,
        data: payload,
      });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };

  const handleEdit = (post: any) => {
    const isScheduled = post.status === "draft" && post.publishedAt && new Date(post.publishedAt) > new Date();
    setFormData({
      title: post.title,
      metaTitle: post.metaTitle || "",
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || "",
      featuredImage: post.featuredImage || "",
      tags: post.tags || "",
      metaDescription: post.metaDescription || "",
      canonicalUrl: post.canonicalUrl || "",
      keywords: post.keywords || "",
      status: post.status,
      scheduleAt: isScheduled
        ? new Date(post.publishedAt).toISOString().slice(0, 16)
        : "",
    });
    setSlugManuallyEdited(true);
    setEditingId(post.id);
    setIsOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleEditorImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      throw new Error("Please upload an image file only.");
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Failed to read image file"));
      reader.readAsDataURL(file);
    });

    const base64 = dataUrl.split(",")[1] || "";
    if (!base64) {
      throw new Error("Invalid image file data");
    }

    try {
      const uploaded = await mediaUploadMutation.mutateAsync({
        fileName: file.name,
        fileData: base64,
        mimeType: file.type,
        fileSize: file.size,
      });
      toast.success("Image uploaded successfully");
      return uploaded.url;
    } catch {
      toast.warning("Storage upload failed, image embedded locally instead.");
      return dataUrl;
    }
  };

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsFeaturedImageUploading(true);
      const imageUrl = await handleEditorImageUpload(file);
      setFormData((prev) => ({
        ...prev,
        featuredImage: imageUrl,
      }));
      toast.success("Featured image uploaded and applied.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload featured image");
    } finally {
      setIsFeaturedImageUploading(false);
      e.target.value = "";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "draft":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "archived":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const isBusy = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl border bg-card p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">CMS Dashboard</p>
              <h1 className="mt-2 text-3xl font-bold text-foreground">Blog Admin</h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Manage posts with rich formatting, SEO controls, scheduling, and analytics in one place.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:w-auto">
              <div className="rounded-xl border bg-background p-3 text-center">
                <p className="text-xs text-muted-foreground">Published</p>
                <p className="text-xl font-semibold">{analyticsData.publishedCount}</p>
              </div>
              <div className="rounded-xl border bg-background p-3 text-center">
                <p className="text-xs text-muted-foreground">Total Views</p>
                <p className="text-xl font-semibold">{analyticsData.totalViews.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  resetForm();
                  setIsOpen(true);
                }}
                className="mt-5 gap-2"
              >
                <Plus size={16} />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[92vh] w-[96vw] max-w-7xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Edit Blog Post" : "Create New Blog Post"}
                </DialogTitle>
                <DialogDescription>
                  {editingId
                    ? "Update your blog post details below"
                    : "Fill in the details to create a new blog post"}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-foreground">Title *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Enter post title"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">Slug *</label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      placeholder="url-friendly-slug"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Content *</label>
                  <div className="mt-2">
                    <RichTextEditor
                      value={formData.content}
                      onChange={(content) => setFormData({ ...formData, content })}
                      placeholder="Write the main blog content..."
                      onImageUpload={handleEditorImageUpload}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-foreground">Excerpt</label>
                    <Textarea
                      value={formData.excerpt}
                      onChange={(e) =>
                        setFormData({ ...formData, excerpt: e.target.value })
                      }
                      placeholder="Short summary of the post"
                      className="mt-1 min-h-[110px]"
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">Featured Image URL</label>
                      <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Input
                          value={formData.featuredImage}
                          onChange={(e) =>
                            setFormData({ ...formData, featuredImage: e.target.value })
                          }
                          placeholder="https://example.com/image.jpg"
                          className="sm:flex-1"
                        />
                        <label>
                          <Button type="button" variant="outline" className="gap-2" disabled={isFeaturedImageUploading} asChild>
                            <span>
                              <ImageUp size={14} />
                              {isFeaturedImageUploading ? "Uploading..." : "Upload from device"}
                            </span>
                          </Button>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFeaturedImageUpload}
                          />
                        </label>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Use uploaded image URL or https URL. Do not use file:// local path.
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground">Tags / Categories</label>
                      <Input
                        value={formData.tags}
                        onChange={(e) =>
                          setFormData({ ...formData, tags: e.target.value })
                        }
                        placeholder="seo, marketing, growth"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border bg-muted/20 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Target size={16} className="text-primary" />
                    <h3 className="font-semibold text-foreground">SEO Panel</h3>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-foreground">Meta Title</label>
                      <Input
                        value={formData.metaTitle}
                        onChange={(e) =>
                          setFormData({ ...formData, metaTitle: e.target.value })
                        }
                        placeholder="SEO title (recommended up to 60 chars)"
                        maxLength={60}
                        className="mt-1"
                      />
                      <p className="mt-1 text-xs text-muted-foreground">{formData.metaTitle.length}/60</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground">Canonical URL</label>
                      <Input
                        value={formData.canonicalUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, canonicalUrl: e.target.value })
                        }
                        placeholder="https://yourdomain.com/blog/post-slug"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-foreground">Meta Description</label>
                      <Textarea
                        value={formData.metaDescription}
                        onChange={(e) =>
                          setFormData({ ...formData, metaDescription: e.target.value })
                        }
                        placeholder="SEO description for search snippets"
                        maxLength={160}
                        className="mt-1 min-h-[100px]"
                      />
                      <p className="mt-1 text-xs text-muted-foreground">{formData.metaDescription.length}/160</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground">Keywords</label>
                      <Textarea
                        value={formData.keywords}
                        onChange={(e) =>
                          setFormData({ ...formData, keywords: e.target.value })
                        }
                        placeholder="digital marketing, local seo, brand growth"
                        className="mt-1 min-h-[100px]"
                      />
                      <p className="mt-1 text-xs text-muted-foreground">Comma-separated, recommended up to 12 keywords</p>
                    </div>
                  </div>


                </div>

                <div className="rounded-xl border bg-muted/20 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <CalendarClock size={16} className="text-primary" />
                    <h3 className="font-semibold text-foreground">Publishing</h3>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-foreground">Status</label>
                      <Select
                        value={formData.status}
                        onValueChange={(value: PostStatus) =>
                          setFormData({ ...formData, status: value })
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground">Schedule Publish Time</label>
                      <Input
                        type="datetime-local"
                        value={formData.scheduleAt}
                        onChange={(e) => setFormData({ ...formData, scheduleAt: e.target.value })}
                        className="mt-1"
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        Future schedule keeps post as draft and auto-publishes when time is reached.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 border-t pt-4">
                  <Button
                    type="submit"
                    disabled={isBusy}
                  >
                    {editingId ? "Update Post" : "Create Post"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="rounded-2xl border bg-card p-5 md:p-6">
            <div className="mb-4 flex items-center gap-2">
              <LineChart size={16} className="text-primary" />
              <h2 className="text-lg font-semibold">Blog Analytics</h2>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-xl border bg-background p-3">
                <p className="mb-2 text-xs font-medium text-muted-foreground">Monthly Views (real view counts only)</p>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.monthlyViews}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis hide />
                      <Tooltip />
                      <Bar dataKey="views" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Historical monthly view trends require actual view tracking data; zeros are shown until posts accumulate real views.
                </p>
              </div>

              <div className="rounded-xl border bg-background p-3">
                <p className="mb-2 text-xs font-medium text-muted-foreground">Publishing Trend</p>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsData.publishingTrend}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis hide />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="posts"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary) / 0.2)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 md:p-6">
            <div className="mb-4 flex items-center gap-2">
              <Eye size={16} className="text-primary" />
              <h2 className="text-lg font-semibold">Top Posts</h2>
            </div>
            <div className="space-y-3">
              {analyticsData.topPosts.length > 0 ? (
                analyticsData.topPosts.map((post, index) => (
                  <div key={post.id} className="rounded-xl border bg-background p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">#{index + 1}</p>
                        <p className="line-clamp-2 text-sm font-medium text-foreground">{post.title}</p>
                      </div>
                      <Badge variant="secondary">{post.traffic.toLocaleString()} views</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-xl border bg-background p-3 text-sm text-muted-foreground">
                  Top posts will appear after your posts receive real views.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Mail size={16} className="text-primary" />
            <h2 className="text-lg font-semibold">Contact Leads</h2>
          </div>
          {isLeadsLoading ? (
            <div className="rounded-xl border bg-background p-4 text-sm text-muted-foreground">Loading leads...</div>
          ) : (contactLeads || []).length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {contactLeads!.map((lead) => (
                <div key={lead.id} className="rounded-xl border bg-background p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{lead.name}</p>
                      <p className="text-sm text-muted-foreground">{lead.service}</p>
                    </div>
                    <Badge variant="secondary">{lead.status}</Badge>
                  </div>
                  <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <p><span className="font-medium text-foreground">Phone:</span> {lead.phone}</p>
                    <p><span className="font-medium text-foreground">Email:</span> {lead.email}</p>
                    <p><span className="font-medium text-foreground">Submitted:</span> {new Date(lead.createdAt).toLocaleString()}</p>
                    {lead.message && <p className="whitespace-pre-wrap"><span className="font-medium text-foreground">Message:</span> {lead.message}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border bg-background p-4 text-sm text-muted-foreground">
              No contact leads yet. Submitted consultation requests will appear here.
            </div>
          )}
        </div>

        <div className="sticky top-3 z-20 rounded-2xl border bg-card p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search posts by title or excerpt"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value: StatusFilter) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-full md:w-44">
                <Filter size={14} className="mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={categoryFilter}
              onValueChange={(value) => setCategoryFilter(value)}
            >
              <SelectTrigger className="w-full md:w-52">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <p className="mt-2 text-xs text-muted-foreground">
            Search is debounced for smoother typing. Use status and category together for precise filtering.
          </p>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="rounded-2xl border bg-card p-8 text-center text-muted-foreground">Loading posts...</div>
          ) : visiblePosts.length > 0 ? (
            visiblePosts.map((post) => {
              const isScheduled =
                post.status === "draft" && !!post.publishedAt && new Date(post.publishedAt) > new Date();

              return (
                <article
                  key={post.id}
                  className="rounded-2xl border bg-card p-4 transition-colors hover:bg-accent/20 md:p-5"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-foreground">{post.title}</h3>
                        <Badge className={getStatusColor(post.status)}>{statusLabel[post.status]}</Badge>
                        {isScheduled && (
                          <Badge variant="outline" className="gap-1">
                            <Clock3 size={12} />
                            Scheduled
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground">/{post.slug}</p>

                      {post.excerpt && (
                        <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {post.tags?.split(",").map((tag) => {
                          const normalized = tag.trim();
                          if (!normalized) return null;
                          return (
                            <Badge key={`${post.id}-${normalized}`} variant="secondary">
                              {normalized}
                            </Badge>
                          );
                        })}
                      </div>

                      <p className="text-xs text-muted-foreground">
                        Created: {new Date(post.createdAt).toLocaleDateString()} • Updated: {new Date(post.updatedAt).toLocaleDateString()}
                      </p>

                      {isScheduled && (
                        <p className="text-xs text-amber-700">
                          Scheduled for {post.publishedAt ? new Date(post.publishedAt).toLocaleString() : "-"}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(post)}>
                        <Pencil size={14} />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(post.id)}
                      >
                        <Trash2 size={14} />
                        Delete
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-2xl border bg-card p-8 text-center">
              <Sparkles className="mx-auto mb-3 text-primary" size={22} />
              <h3 className="text-lg font-semibold">No posts match these filters</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try clearing search, changing status/category, or create a new post with the button above.
              </p>
              <Button
                className="mt-4"
                variant="outline"
                onClick={() => {
                  setSearchInput("");
                  setStatusFilter("all");
                  setCategoryFilter("all");
                }}
              >
                Reset Filters
                <ChevronRight size={14} />
              </Button>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Scheduled draft posts auto-publish once their publish date/time is reached.
        </p>
      </div>
    </div>
  );
}
