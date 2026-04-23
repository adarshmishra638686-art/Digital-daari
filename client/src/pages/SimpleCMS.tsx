import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
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
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useLocation } from "wouter";

export default function SimpleCMS() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
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
  });

  // Fetch posts
  const { data: posts = [], refetch: refetchPosts, isLoading: postsLoading } = trpc.blog.list.useQuery({} as any);

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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Posts Grid */}
        <div className="grid gap-4">
          {postsLoading ? (
            <Card className="p-8 text-center">
              <p className="text-slate-600">Loading posts...</p>
            </Card>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start gap-4">
                  {post.featuredImage && (
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-32 h-32 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{post.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{post.slug}</p>
                    {post.excerpt && (
                      <p className="text-sm text-slate-700 mt-2 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex gap-3 mt-4 flex-wrap items-center">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                          post.status === "published"
                            ? "bg-green-100 text-green-700"
                            : post.status === "draft"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {post.status}
                      </span>
                      <span className="text-xs text-slate-600">
                        {format(new Date(post.createdAt), "MMM dd, yyyy")}
                      </span>
                      <span className="text-xs text-slate-600 flex items-center gap-1">
                        <Eye size={14} />
                        {post.viewCount || 0} views
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditPost(post)}
                      className="gap-2"
                    >
                      <Edit2 size={16} />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedPostId(post.id);
                        setShowDeleteConfirm(true);
                      }}
                      className="gap-2"
                    >
                      <Trash2 size={16} />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center">
              <p className="text-slate-600 text-lg">No blog posts yet</p>
              <p className="text-slate-500 mt-2">Create your first blog post</p>
            </Card>
          )}
        </div>
      </div>

      {/* Floating Action Button for New Post */}
      <button
        onClick={() => setShowNewPostDialog(true)}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all"
        title="New Post"
      >
        <Plus size={24} />
      </button>

      {/* New/Edit Post Dialog */}
      <Dialog
        open={showNewPostDialog || !!editingPost}
        onOpenChange={(open) => {
          if (!open) {
            setShowNewPostDialog(false);
            setEditingPost(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? "Edit Blog Post" : "Create New Blog Post"}
            </DialogTitle>
            <DialogDescription>
              {editingPost
                ? "Update your blog post with rich formatting and SEO metadata"
                : "Write and publish a new blog post"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold block mb-2">Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Post title"
                />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-2">Slug *</label>
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
              <label className="text-sm font-semibold block mb-2">Excerpt</label>
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
              <label className="text-sm font-semibold block mb-2">Content *</label>
              <RichTextEditor
                value={formData.content}
                onChange={(content) =>
                  setFormData({ ...formData, content })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold block mb-2">Status</label>
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
                <label className="text-sm font-semibold block mb-2">Featured Image URL</label>
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
                <label className="text-sm font-semibold block mb-2">Tags</label>
                <Input
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="tag1, tag2, tag3"
                />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-2">Keywords</label>
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
              <label className="text-sm font-semibold block mb-2">Meta Description</label>
              <Textarea
                value={formData.metaDescription}
                onChange={(e) =>
                  setFormData({ ...formData, metaDescription: e.target.value })
                }
                placeholder="SEO meta description (max 160 chars)"
                rows={2}
              />
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t">
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
    </div>
  );
}
