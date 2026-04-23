import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import RichTextEditor from "@/components/RichTextEditor";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Clock,
  History,
  Image as ImageIcon,
  Search,
  Filter,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function CMSDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("posts");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNewPostDialog, setShowNewPostDialog] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showRevisionHistory, setShowRevisionHistory] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [editingPost, setEditingPost] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    tags: "",
    metaDescription: "",
    keywords: "",
    featuredImage: "",
    status: "draft" as "draft" | "published" | "archived",
  });

  const [scheduleData, setScheduleData] = useState({
    scheduledFor: "",
  });

  // Fetch posts
  const { data: posts, refetch: refetchPosts } = trpc.blog.list.useQuery({});

  // Fetch media library
  const { data: mediaFiles } = trpc.media.list.useQuery({ limit: 100 });

  // Mutations
  const createPostMutation = trpc.blog.create.useMutation({
    onSuccess: () => {
      toast.success("Blog post created successfully!");
      setShowNewPostDialog(false);
      resetForm();
      refetchPosts();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create post");
    },
  });

  const updatePostMutation = trpc.blog.update.useMutation({
    onSuccess: () => {
      toast.success("Blog post updated successfully!");
      setEditingPost(null);
      resetForm();
      refetchPosts();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update post");
    },
  });

  const deletePostMutation = trpc.blog.delete.useMutation({
    onSuccess: () => {
      toast.success("Blog post deleted successfully!");
      refetchPosts();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete post");
    },
  });

  const uploadMediaMutation = trpc.media.upload.useMutation({
    onSuccess: () => {
      toast.success("Media file uploaded successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to upload media");
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      tags: "",
      metaDescription: "",
      keywords: "",
      featuredImage: "",
      status: "draft",
    });
  };

  const handleCreatePost = async () => {
    if (!formData.title || !formData.slug || !formData.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    await createPostMutation.mutateAsync({
      title: formData.title,
      slug: formData.slug,
      content: formData.content,
      excerpt: formData.excerpt,
      tags: formData.tags,
      metaDescription: formData.metaDescription,
      keywords: formData.keywords,
      featuredImage: formData.featuredImage,
    });
  };

  const handleUpdatePost = async () => {
    if (!editingPost?.id || !formData.title || !formData.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    await updatePostMutation.mutateAsync({
      id: editingPost.id,
      data: {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        excerpt: formData.excerpt,
        tags: formData.tags,
        metaDescription: formData.metaDescription,
        keywords: formData.keywords,
        featuredImage: formData.featuredImage,
        status: formData.status,
      },
    });
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      tags: post.tags || "",
      metaDescription: post.metaDescription || "",
      keywords: post.keywords || "",
      featuredImage: post.featuredImage || "",
      status: post.status || "draft",
    });
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        const base64Data = base64.split(",")[1];

        await uploadMediaMutation.mutateAsync({
          fileName: file.name,
          fileData: base64Data,
          mimeType: file.type,
          fileSize: file.size,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredPosts = posts?.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || post.status === statusFilter;

    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Blog CMS</h1>
            <p className="text-slate-600">Manage your blog content and media</p>
          </div>
          <Button onClick={() => setShowNewPostDialog(true)} className="gap-2">
            <Plus size={18} />
            New Post
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="posts">Blog Posts</TabsTrigger>
            <TabsTrigger value="media">Media Library</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent value="posts" className="space-y-4">
            {/* Search & Filter */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Posts List */}
            <div className="grid gap-4">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <Card key={post.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{post.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">{post.slug}</p>
                        <div className="flex gap-2 mt-3">
                          <span className="text-xs px-2 py-1 bg-slate-100 rounded">
                            {post.status}
                          </span>
                          <span className="text-xs text-slate-600">
                            {format(new Date(post.createdAt), "MMM dd, yyyy")}
                          </span>
                          <span className="text-xs text-slate-600">
                            {post.viewCount} views
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPost(post)}
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedPostId(post.id)}
                        >
                          <History size={16} />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deletePostMutation.mutate({ id: post.id })}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-slate-600">No posts found</p>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Media Library</h3>
              <label>
                <Button asChild>
                  <span className="cursor-pointer">
                    <ImageIcon size={18} className="mr-2" />
                    Upload Media
                  </span>
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMediaUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mediaFiles?.map((file) => (
                <Card key={file.id} className="overflow-hidden">
                  <img
                    src={file.url}
                    alt={file.altText || file.fileName}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-2">
                    <p className="text-xs font-semibold truncate">{file.fileName}</p>
                    <p className="text-xs text-slate-600">
                      {(file.fileSize / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Scheduled Posts</h3>
              <p className="text-slate-600">Schedule posts for future publishing</p>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Blog Analytics</h3>
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4 text-center">
                  <p className="text-3xl font-bold">{posts?.length || 0}</p>
                  <p className="text-sm text-slate-600">Total Posts</p>
                </Card>
                <Card className="p-4 text-center">
                  <p className="text-3xl font-bold">
                    {posts?.filter((p) => p.status === "published").length || 0}
                  </p>
                  <p className="text-sm text-slate-600">Published</p>
                </Card>
                <Card className="p-4 text-center">
                  <p className="text-3xl font-bold">
                    {posts?.reduce((sum, p) => sum + (p.viewCount || 0), 0) || 0}
                  </p>
                  <p className="text-sm text-slate-600">Total Views</p>
                </Card>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* New Post Dialog */}
      <Dialog open={showNewPostDialog} onOpenChange={setShowNewPostDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Blog Post</DialogTitle>
            <DialogDescription>
              Write and publish a new blog post with rich formatting
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold">Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Post title"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Slug *</label>
                <Input
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="post-url-slug"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold">Excerpt</label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                placeholder="Short summary of the post"
                rows={2}
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Content *</label>
              <RichTextEditor
                value={formData.content}
                onChange={(content) =>
                  setFormData({ ...formData, content })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold">Tags</label>
                <Input
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="tag1, tag2, tag3"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Featured Image URL</label>
                <Input
                  value={formData.featuredImage}
                  onChange={(e) =>
                    setFormData({ ...formData, featuredImage: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold">Meta Description</label>
              <Textarea
                value={formData.metaDescription}
                onChange={(e) =>
                  setFormData({ ...formData, metaDescription: e.target.value })
                }
                placeholder="SEO meta description (max 160 chars)"
                rows={2}
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Keywords</label>
              <Input
                value={formData.keywords}
                onChange={(e) =>
                  setFormData({ ...formData, keywords: e.target.value })
                }
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowNewPostDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreatePost}
                disabled={createPostMutation.isPending}
              >
                {createPostMutation.isPending ? "Creating..." : "Create Post"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

