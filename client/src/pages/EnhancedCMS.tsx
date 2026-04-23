import { useState, useEffect } from "react";
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
  EyeOff,
  Clock,
  Image as ImageIcon,
  Search,
  Filter,
  Calendar,
  Tag,
  Folder,
  BarChart3,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function EnhancedCMS() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("posts");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNewPostDialog, setShowNewPostDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
    publishedAt: "",
  });

  // Fetch posts
  const { data: posts = [], refetch: refetchPosts, isLoading: postsLoading } = trpc.blog.list.useQuery({} as any);

  // Fetch categories
  const { data: categories = [], refetch: refetchCategories } = trpc.categories.list.useQuery({} as any);

  // Fetch media library
  const { data: mediaFiles = [] } = trpc.media.list.useQuery({ limit: 100 } as any);

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
      setShowDeleteConfirm(false);
      setSelectedPostId(null);
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

  const createCategoryMutation = trpc.categories.create.useMutation({
    onSuccess: () => {
      toast.success("Category created successfully!");
      refetchCategories();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create category");
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
      publishedAt: "",
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
      publishedAt: post.publishedAt ? format(new Date(post.publishedAt), "yyyy-MM-dd") : "",
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

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || post.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;
  const totalViews = posts.reduce((sum, p) => sum + (p.viewCount || 0), 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-slate-600">Total Posts</p>
            <p className="text-3xl font-bold mt-2">{posts.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-slate-600">Published</p>
            <p className="text-3xl font-bold mt-2 text-green-600">{publishedCount}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-slate-600">Drafts</p>
            <p className="text-3xl font-bold mt-2 text-yellow-600">{draftCount}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-slate-600">Total Views</p>
            <p className="text-3xl font-bold mt-2 text-blue-600">{totalViews}</p>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="posts" className="gap-2">
              <Edit2 size={16} />
              Posts
            </TabsTrigger>
            <TabsTrigger value="media" className="gap-2">
              <ImageIcon size={16} />
              Media
            </TabsTrigger>
            <TabsTrigger value="categories" className="gap-2">
              <Folder size={16} />
              Categories
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 size={16} />
              Analytics
            </TabsTrigger>
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
              {postsLoading ? (
                <Card className="p-8 text-center">
                  <p className="text-slate-600">Loading posts...</p>
                </Card>
              ) : filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <Card key={post.id} className="p-4 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start gap-4">
                      {post.featuredImage && (
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-24 h-24 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{post.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">{post.slug}</p>
                        <div className="flex gap-3 mt-3 flex-wrap">
                          <span className={`text-xs px-2 py-1 rounded font-medium ${
                            post.status === "published"
                              ? "bg-green-100 text-green-700"
                              : post.status === "draft"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {post.status}
                          </span>
                          <span className="text-xs text-slate-600">
                            {format(new Date(post.createdAt), "MMM dd, yyyy")}
                          </span>
                          <span className="text-xs text-slate-600 flex items-center gap-1">
                            <Eye size={14} />
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
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setSelectedPostId(post.id);
                            setShowDeleteConfirm(true);
                          }}
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
              <h3 className="font-semibold">Media Library ({mediaFiles.length})</h3>
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
              {mediaFiles.map((file) => (
                <Card key={file.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="relative">
                    <img
                      src={file.url}
                      alt={file.altText || file.fileName}
                      className="w-full h-32 object-cover group-hover:opacity-75 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(file.url);
                          toast.success("URL copied!");
                        }}
                      >
                        Copy URL
                      </Button>
                    </div>
                  </div>
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

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Categories ({categories.length})</h3>
              <Button
                size="sm"
                onClick={() => {
                  const name = prompt("Category name:");
                  if (name) {
                    createCategoryMutation.mutate({
                      name,
                      slug: name.toLowerCase().replace(/\s+/g, "-"),
                    });
                  }
                }}
              >
                <Plus size={16} className="mr-2" />
                Add Category
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card key={category.id} className="p-4">
                  <div
                    className="w-full h-12 rounded mb-3"
                    style={{ backgroundColor: category.color }}
                  />
                  <h4 className="font-semibold">{category.name}</h4>
                  <p className="text-xs text-slate-600">{category.slug}</p>
                  {category.description && (
                    <p className="text-xs mt-2 text-slate-700">{category.description}</p>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6">
                <h4 className="font-semibold mb-4">Top Performing Posts</h4>
                <div className="space-y-3">
                  {posts
                    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
                    .slice(0, 5)
                    .map((post) => (
                      <div key={post.id} className="flex justify-between items-center">
                        <p className="text-sm truncate">{post.title}</p>
                        <span className="text-sm font-semibold">{post.viewCount || 0}</span>
                      </div>
                    ))}
                </div>
              </Card>

              <Card className="p-6">
                <h4 className="font-semibold mb-4">Content Status</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <p className="text-sm">Published</p>
                    <span className="text-sm font-semibold text-green-600">{publishedCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm">Drafts</p>
                    <span className="text-sm font-semibold text-yellow-600">{draftCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm">Archived</p>
                    <span className="text-sm font-semibold">
                      {posts.filter((p) => p.status === "archived").length}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* New/Edit Post Dialog */}
      <Dialog open={showNewPostDialog || !!editingPost} onOpenChange={(open) => {
        if (!open) {
          setShowNewPostDialog(false);
          setEditingPost(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? "Edit Blog Post" : "Create New Blog Post"}
            </DialogTitle>
            <DialogDescription>
              {editingPost
                ? "Update your blog post with rich formatting and SEO metadata"
                : "Write and publish a new blog post with rich formatting"}
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
                <label className="text-sm font-semibold">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(status: any) =>
                    setFormData({ ...formData, status })
                  }
                >
                  <SelectTrigger>
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
                <label className="text-sm font-semibold">Keywords</label>
                <Input
                  value={formData.keywords}
                  onChange={(e) =>
                    setFormData({ ...formData, keywords: e.target.value })
                  }
                  placeholder="keyword1, keyword2"
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

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowNewPostDialog(false);
                  setEditingPost(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={editingPost ? handleUpdatePost : handleCreatePost}
                disabled={createPostMutation.isPending || updatePostMutation.isPending}
              >
                {createPostMutation.isPending || updatePostMutation.isPending
                  ? "Saving..."
                  : editingPost
                  ? "Update Post"
                  : "Create Post"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The post will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedPostId) {
                  deletePostMutation.mutate({ id: selectedPostId });
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
