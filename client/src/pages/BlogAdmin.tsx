import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  Layout,
  Wrench,
  BarChart3,
  MousePointerClick,
  Copy,
} from "lucide-react";
import { toast } from "sonner";

type PromptCategory = "UI" | "Feature" | "Data" | "UX";

type PromptCard = {
  category: PromptCategory;
  title: string;
  prompt: string;
};

const categoryMeta: Record<
  PromptCategory,
  { description: string; icon: typeof Layout }
> = {
  UI: {
    description: "Visual layout and design changes",
    icon: Layout,
  },
  Feature: {
    description: "Functional additions with working logic",
    icon: Wrench,
  },
  Data: {
    description: "Charts, analytics, and data display",
    icon: BarChart3,
  },
  UX: {
    description: "Interaction and usability improvements",
    icon: MousePointerClick,
  },
};

const promptCards: PromptCard[] = [
  {
    category: "UI",
    title: "Modernize Blog Dashboard Layout",
    prompt:
      "Redesign the blog admin dashboard UI with a cleaner card layout, improved spacing, and responsive behavior for mobile and desktop while keeping the current data and actions intact.",
  },
  {
    category: "Feature",
    title: "Add Rich Post Editor",
    prompt:
      "Add a rich text blog post editor to Blog Admin with toolbar controls for headings, lists, links, and image embeds, and ensure the content saves through existing create/update flows.",
  },
  {
    category: "Data",
    title: "Add Performance Analytics Panel",
    prompt:
      "Add a blog analytics panel showing monthly views, top posts, and publishing trends with simple charts using existing post data and mocked traffic metrics where needed.",
  },
  {
    category: "UX",
    title: "Improve Table Filtering Experience",
    prompt:
      "Improve the Blog Admin filtering UX with debounced search, clearer status/category filters, empty-state guidance, and sticky controls for long lists.",
  },
  {
    category: "Feature",
    title: "Add SEO Settings Drawer",
    prompt:
      "Add an SEO panel in Blog Admin where each post can manage meta title, meta description, canonical URL, and keywords, with validation and save support.",
  },
  {
    category: "Feature",
    title: "Add Publish Scheduler",
    prompt:
      "Implement post scheduling in Blog Admin so authors can choose a future publish date/time and automatically publish at that time while preserving draft and published states.",
  },
];

export default function BlogAdmin() {
  useAuth({
    redirectOnUnauthenticated: true,
    redirectPath: "/auth",
  });

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "archived">("published");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    featuredImage: "",
    tags: "",
    metaDescription: "",
    keywords: "",
    status: "published" as const,
  });

  // Queries
  const { data: posts, isLoading, refetch } = trpc.blog.list.useQuery({
    status,
    search,
    limit: 50,
  });

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

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      featuredImage: "",
      tags: "",
      metaDescription: "",
      keywords: "",
      status: "published",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.slug || !formData.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingId) {
      await updateMutation.mutateAsync({
        id: editingId,
        data: formData,
      });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const handleEdit = (post: any) => {
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || "",
      featuredImage: post.featuredImage || "",
      tags: post.tags || "",
      metaDescription: post.metaDescription || "",
      keywords: post.keywords || "",
      status: post.status,
    });
    setEditingId(post.id);
    setIsOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      deleteMutation.mutate({ id });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500";
      case "draft":
        return "bg-yellow-500";
      case "archived":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const handlePromptCardClick = async (card: PromptCard) => {
    try {
      await navigator.clipboard.writeText(card.prompt);
      toast.success("Prompt copied. Paste it in chat to build this feature.");
    } catch {
      toast.error("Couldn't copy prompt. Please copy it manually from the card.");
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Blog Management</h1>
            <p className="text-muted-foreground">Create, edit, and manage your blog posts</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  resetForm();
                  setIsOpen(true);
                }}
                className="gap-2"
              >
                <Plus size={16} />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Title *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Enter post title"
                    className="mt-1"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Slug *
                  </label>
                  <Input
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="url-friendly-slug"
                    className="mt-1"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Content *
                  </label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    placeholder="Enter post content (markdown supported)"
                    className="mt-1 min-h-[200px]"
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Excerpt
                  </label>
                  <Textarea
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                    placeholder="Short summary of the post"
                    className="mt-1 min-h-[80px]"
                  />
                </div>

                {/* Featured Image */}
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Featured Image URL
                  </label>
                  <Input
                    value={formData.featuredImage}
                    onChange={(e) =>
                      setFormData({ ...formData, featuredImage: e.target.value })
                    }
                    placeholder="https://example.com/image.jpg"
                    className="mt-1"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Tags
                  </label>
                  <Input
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    placeholder="seo, marketing, growth (comma-separated)"
                    className="mt-1"
                  />
                </div>

                {/* Meta Description */}
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Meta Description
                  </label>
                  <Input
                    value={formData.metaDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        metaDescription: e.target.value,
                      })
                    }
                    placeholder="SEO meta description (max 160 chars)"
                    maxLength={160}
                    className="mt-1"
                  />
                </div>

                {/* Keywords */}
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Keywords
                  </label>
                  <Input
                    value={formData.keywords}
                    onChange={(e) =>
                      setFormData({ ...formData, keywords: e.target.value })
                    }
                    placeholder="keyword1, keyword2, keyword3"
                    className="mt-1"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Status
                  </label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) =>
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

                {/* Submit */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
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

        {/* Filters */}
        <div className="mb-8 rounded-xl border bg-card p-5 md:p-6">
          <h2 className="text-xl font-semibold text-foreground">Ready-to-use Prompt Cards</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Here are ready-to-use prompts for every section of the blog admin panel, organized by what you want to build or customize.
            Click any prompt card below to instantly copy it and send it in chat.
          </p>

          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {(Object.keys(categoryMeta) as PromptCategory[]).map((category) => {
              const meta = categoryMeta[category];
              const Icon = meta.icon;
              return (
                <div
                  key={category}
                  className="rounded-lg border bg-background px-3 py-2"
                >
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Icon size={14} />
                    {category}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{meta.description}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {promptCards.map((card) => (
              <button
                key={card.title}
                type="button"
                onClick={() => handlePromptCardClick(card)}
                className="text-left rounded-lg border bg-background p-4 transition-colors hover:bg-accent"
              >
                <div className="flex items-center justify-between gap-3">
                  <Badge variant="outline">{card.category}</Badge>
                  <Copy size={14} className="text-muted-foreground" />
                </div>
                <h3 className="mt-3 font-medium text-foreground">{card.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{card.prompt}</p>
              </button>
            ))}
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            You can mix and combine prompts. For example, after adding the post editor, follow up with the SEO panel or scheduler.
          </p>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative max-w-xs">
            <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={status}
            onValueChange={(value: any) => setStatus(value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Posts Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading posts...
                  </TableCell>
                </TableRow>
              ) : posts && posts.length > 0 ? (
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {post.slug}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(post.status)}>
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(post)}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(post.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No blog posts found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
