/* ============================================================
   BLOG CMS — Comprehensive all-in-one CMS with all features
   Features: CRUD, Rich Text Editor, Media, Categories, Tags, 
   Scheduling, SEO, Analytics
   ============================================================ */

import { useState, useCallback } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RichTextEditor from "@/components/RichTextEditor";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  BarChart3,
  Search,
  Calendar,
  Tag,
  FileText,
  Image as ImageIcon,
  Clock,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function BlogCMS() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("posts");
  const [showNewPostDialog, setShowNewPostDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Form state
  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage: string;
    status: "draft" | "published" | "archived";
    categoryId: string;
    tags: string;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    scheduledAt: string;
  }>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    status: "draft",
    categoryId: "",
    tags: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    scheduledAt: "",
  });

  // Fetch posts
  const { data: posts = [], isLoading: postsLoading, refetch: refetchPosts } = trpc.blog.list.useQuery({
    status: statusFilter === "all" ? undefined : (statusFilter as "draft" | "published" | "archived"),
    search: searchQuery || undefined,
  });
  const { data: categories = [] } = trpc.categories.list.useQuery();

  // Mutations
  const createMutation = trpc.blog.create.useMutation({
    onSuccess: () => {
      toast.success("Post created successfully!");
      refetchPosts();
      resetForm();
      setShowNewPostDialog(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.blog.update.useMutation({
    onSuccess: () => {
      toast.success("Post updated successfully!");
      refetchPosts();
      resetForm();
      setEditingPost(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.blog.delete.useMutation({
    onSuccess: () => {
      toast.success("Post deleted successfully!");
      refetchPosts();
      setShowDeleteConfirm(false);
      setSelectedPostId(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      status: "draft",
      categoryId: "",
      tags: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      scheduledAt: "",
    });
  };

  const handleCreatePost = () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a post title");
      return;
    }
    createMutation.mutate(formData);
  };

  const handleUpdatePost = () => {
    if (!editingPost?.id) return;
    updateMutation.mutate({
      id: editingPost.id,
      data: formData,
    });
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setFormData({
      title: post.title || "",
      slug: post.slug || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      featuredImage: post.featuredImage || "",

      categoryId: post.categoryId?.toString() || "",
      tags: post.tags?.join(", ") || "",
      metaTitle: post.metaTitle || "",
      metaDescription: post.metaDescription || "",
      metaKeywords: post.metaKeywords || "",
      scheduledAt: post.scheduledAt ? format(new Date(post.scheduledAt), "yyyy-MM-dd'T'HH:mm") : "",
      status: (post.status || "draft") as "draft" | "published" | "archived",
    });
  };

  const handleDeletePost = (id: number) => {
    setSelectedPostId(id);
    setShowDeleteConfirm(true);
  };

  const handlePublishPost = (post: any) => {
    updateMutation.mutate({
      id: post.id,
      data: {
        status: (post.status === "published" ? "draft" : "published") as "draft" | "published" | "archived",
      },
    });
  };

  const confirmDelete = () => {
    if (selectedPostId) {
      deleteMutation.mutate({ id: selectedPostId });
    }
  };

  // Filter posts
  const filteredPosts = posts.filter((post: any) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Analytics
  const publishedCount = posts.filter((p: any) => p.status === "published").length;
  const draftCount = posts.filter((p: any) => p.status === "draft").length;
  const totalViews = posts.reduce((sum: number, p: any) => sum + (p.viewCount || 0), 0);
  const avgViews = publishedCount > 0 ? Math.round(totalViews / publishedCount) : 0;

  if (!user) {
    return <div className="text-center py-12">Please log in to access the CMS</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-2 border-cyan-400">
            <TabsTrigger value="posts" className="gap-2">
              <FileText size={16} />
              Posts
            </TabsTrigger>
            <TabsTrigger value="media" className="gap-2">
              <ImageIcon size={16} />
              Media
            </TabsTrigger>
            <TabsTrigger value="categories" className="gap-2">
              <Tag size={16} />
              Categories
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 size={16} />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent value="posts" className="space-y-6">
            {/* Toolbar */}
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-cyan-400" size={18} />
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-800 border-2 border-cyan-400 text-white placeholder-cyan-300"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-slate-800 border-2 border-cyan-400 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-2 border-cyan-400">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Drafts</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => setShowNewPostDialog(true)} className="gap-2 bg-cyan-500 hover:bg-cyan-600 text-black font-bold border-2 border-cyan-400">
                <Plus size={18} />
                New Post
              </Button>
            </div>

            {/* Posts Grid */}
            <div className="grid gap-4">
              {postsLoading ? (
                <Card className="p-8 text-center bg-slate-800 border-2 border-cyan-400">
                  <p className="text-cyan-300">Loading posts...</p>
                </Card>
              ) : filteredPosts.length > 0 ? (
                filteredPosts.map((post: any) => (
                  <Card key={post.id} className="p-6 bg-slate-800 border-2 border-cyan-400 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-cyan-300">{post.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            post.status === "published" ? "bg-green-600 text-green-100" :
                            post.status === "draft" ? "bg-yellow-600 text-yellow-100" :
                            "bg-slate-600 text-slate-100"
                          }`}>
                            {post.status}
                          </span>
                        </div>
                        <p className="text-cyan-100 mb-3">{post.excerpt}</p>
                        <div className="flex gap-4 text-sm text-cyan-200">
                          <span className="flex items-center gap-1">
                            <Eye size={14} />
                            {post.viewCount || 0} views
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {format(new Date(post.createdAt), "MMM dd, yyyy")}
                          </span>
                          {post.scheduledAt && (
                            <span className="flex items-center gap-1 text-blue-600">
                              <Clock size={14} />
                              Scheduled: {format(new Date(post.scheduledAt), "MMM dd, yyyy HH:mm")}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
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
                          onClick={() => handleDeletePost(post.id)}
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
                  <p className="text-slate-600 text-lg">No blog posts found</p>
                  <p className="text-slate-500 mt-2">Create your first blog post to get started</p>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-6">
            <Card className="p-8 text-center">
              <ImageIcon size={48} className="mx-auto text-slate-400 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Media Library</h3>
              <p className="text-slate-600 mb-6">Upload and manage your blog images and media files</p>
              <Button className="gap-2">
                <Plus size={18} />
                Upload Media
              </Button>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="flex gap-4">
              <Input placeholder="New category name..." className="flex-1" />
              <Button className="gap-2">
                <Plus size={18} />
                Add Category
              </Button>
            </div>
            <div className="grid gap-3">
              {categories.length > 0 ? (
                categories.map((cat: any) => (
                  <Card key={cat.id} className="p-4 flex justify-between items-center">
                    <span className="font-medium text-slate-900">{cat.name}</span>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </Card>
                ))
              ) : (
                <Card className="p-8 text-center text-slate-600">
                  No categories yet. Create one to organize your posts.
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="text-sm text-slate-600 mb-2">Total Posts</div>
                <div className="text-3xl font-bold text-blue-900">{posts.length}</div>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100">
                <div className="text-sm text-slate-600 mb-2">Published</div>
                <div className="text-3xl font-bold text-green-900">{publishedCount}</div>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100">
                <div className="text-sm text-slate-600 mb-2">Drafts</div>
                <div className="text-3xl font-bold text-yellow-900">{draftCount}</div>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100">
                <div className="text-sm text-slate-600 mb-2">Total Views</div>
                <div className="text-3xl font-bold text-purple-900">{totalViews}</div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp size={20} />
                Performance Metrics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-slate-600">Average Views per Post</span>
                  <span className="text-2xl font-bold text-slate-900">{avgViews}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-slate-600">Total Blog Views</span>
                  <span className="text-2xl font-bold text-slate-900">{totalViews}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Publishing Rate</span>
                  <span className="text-2xl font-bold text-slate-900">{publishedCount}/{posts.length}</span>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

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
              <DialogTitle>{editingPost ? "Edit Post" : "Create New Post"}</DialogTitle>
              <DialogDescription>
                {editingPost ? "Update your blog post details" : "Create a new blog post with all the details"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900">Basic Information</h3>
                <Input
                  placeholder="Post Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                <Input
                  placeholder="Post Slug (URL-friendly)"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                />
                <Textarea
                  placeholder="Post Excerpt (short summary)"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900">Content</h3>
                <RichTextEditor
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                />
              </div>

              {/* Media & Categories */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Featured Image URL</label>
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={formData.featuredImage}
                    onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={formData.categoryId} onValueChange={(val) => setFormData({ ...formData, categoryId: val })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat: any) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tags & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags (comma-separated)</label>
                  <Input
                    placeholder="seo, marketing, tips"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val as "draft" | "published" | "archived" })}>
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
              </div>

              {/* Scheduling */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Schedule Publishing (Optional)</label>
                <Input
                  type="datetime-local"
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                />
              </div>

              {/* SEO */}
              <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
                <h3 className="font-bold text-slate-900">SEO Optimization</h3>
                <Input
                  placeholder="Meta Title (60 chars)"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  maxLength={60}
                />
                <Textarea
                  placeholder="Meta Description (160 chars)"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  maxLength={160}
                  rows={2}
                />
                <Input
                  placeholder="Meta Keywords (comma-separated)"
                  value={formData.metaKeywords}
                  onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-4 border-t">
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
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="gap-2"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      {editingPost ? "Update Post" : "Create Post"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Post?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The post will be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex gap-3 justify-end">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
