/* ============================================================
   BLOG PAGE — Professional, attractive, and readable blog layout
   Design: Modern blog with featured section, sidebar, and grid
   ============================================================ */

import { useState } from "react";
import { Link } from "wouter";
import { Clock, Loader2, Search, ArrowRight, CalendarDays } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";

function stripHtml(html: string) {
  return html
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractFirstImageSrc(html: string) {
  const match = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  return match?.[1] || "";
}

function getReadMinutes(text: string) {
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 220));
}

function getPreviewExcerpt(text: string, maxLen = 150) {
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen).trimEnd()}...`;
}

export default function Blog() {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const { data: posts, isLoading } = trpc.blog.getPublished.useQuery(
    { limit: 50 },
    { refetchOnMount: "always" }
  );
  const isInitialLoading = isLoading || posts === undefined;

  const filteredPosts = (posts ?? []).filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(search.toLowerCase());

    const matchesTag = !selectedTag || post.tags?.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(
    new Set((posts ?? []).flatMap((post) => post.tags?.split(",").map((t) => t.trim()) || []))
  ).filter(Boolean);

  // Featured post is the first one
  const featuredPost = filteredPosts[0] || null;
  // Grid posts exclude the featured one
  const gridPosts = filteredPosts.slice(1);
  // Latest posts for sidebar
  const latestPosts = (posts ?? []).slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-16 md:py-24">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <p className="text-indigo-100 text-sm font-semibold uppercase tracking-widest mb-4">
              Resources & Insights
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-['Montserrat'] mb-4 leading-tight">
              Digital Marketing Blog
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 font-['DM_Sans'] leading-relaxed">
              Expert strategies, trending insights, and actionable tips to help your business grow. Explore our latest articles on SEO, marketing, and digital growth.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Search & Filters */}
          <div className="mb-12 bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
                <Input
                  placeholder="Search articles, keywords..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 py-3 border-slate-300 text-slate-900 placeholder-slate-400 text-base"
                />
              </div>
              <div className="text-sm text-slate-600 flex items-center">
                {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"} found
              </div>
            </div>

            {/* Category Tags */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">Filter by category:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    !selectedTag
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  All Articles
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                      selectedTag === tag
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {isInitialLoading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="animate-spin text-indigo-600" size={40} />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-xl border border-slate-200">
              <p className="text-slate-600 text-lg font-['DM_Sans'] mb-4">
                No articles match your search. Try different keywords or filters.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedTag(null);
                }}
                className="text-indigo-600 font-semibold hover:text-indigo-700 inline-flex items-center gap-2"
              >
                Clear filters <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content (2/3 width) */}
              <div className="lg:col-span-2 space-y-8">
                {/* Featured Article */}
                {featuredPost && (
                  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200 hover:shadow-lg transition-shadow duration-300">
                    <Link href={`/blog/${featuredPost.slug}`}>
                      <div className="grid md:grid-cols-2 h-full">
                        {/* Featured Image */}
                        <div className="h-64 md:h-auto bg-slate-200 overflow-hidden">
                          {extractFirstImageSrc(featuredPost.content || "") || featuredPost.featuredImage ? (
                            <img
                              src={
                                featuredPost.featuredImage ||
                                extractFirstImageSrc(featuredPost.content || "")
                              }
                              alt={featuredPost.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center">
                              <span className="text-indigo-300 text-sm">Featured Image</span>
                            </div>
                          )}
                        </div>

                        {/* Featured Content */}
                        <div className="p-8 flex flex-col justify-center">
                          <div className="mb-4">
                            <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full">
                              Featured
                            </span>
                          </div>

                          <h2 className="text-2xl md:text-3xl font-black font-['Montserrat'] text-slate-900 mb-3 leading-tight hover:text-indigo-600 transition-colors">
                            {featuredPost.title}
                          </h2>

                          <p className="text-slate-600 text-base leading-relaxed mb-5 font-['DM_Sans'] line-clamp-3">
                            {featuredPost.excerpt ||
                              getPreviewExcerpt(stripHtml(featuredPost.content || ""))}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-5">
                            <div className="flex items-center gap-2">
                              <CalendarDays size={16} className="text-indigo-600" />
                              {new Date(
                                featuredPost.publishedAt || featuredPost.createdAt
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={16} className="text-indigo-600" />
                              {getReadMinutes(stripHtml(featuredPost.content || ""))} min read
                            </div>
                          </div>

                          <div className="inline-flex items-center gap-2 text-indigo-600 font-semibold group">
                            Read Article
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                )}

                {/* Articles Grid */}
                {gridPosts.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-black font-['Montserrat'] text-slate-900 mb-6">
                      Latest Articles
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {gridPosts.map((post) => {
                        const plainContent = stripHtml(post.content || "");
                        const excerpt = post.excerpt || getPreviewExcerpt(plainContent);
                        const previewImage =
                          post.featuredImage || extractFirstImageSrc(post.content || "");
                        const readMinutes = getReadMinutes(plainContent);
                        const primaryTag = post.tags?.split(",")?.[0]?.trim() || "General";

                        return (
                          <Link key={post.id} href={`/blog/${post.slug}`}>
                            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg hover:border-indigo-300 transition-all duration-300 h-full flex flex-col group">
                              {/* Card Image */}
                              <div className="h-56 bg-slate-100 overflow-hidden">
                                {previewImage ? (
                                  <img
                                    src={previewImage}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-100 flex items-center justify-center">
                                    <span className="text-slate-400 text-sm">Article Image</span>
                                  </div>
                                )}
                              </div>

                              {/* Card Content */}
                              <div className="p-6 flex flex-col flex-1">
                                {/* Category */}
                                <div className="mb-3">
                                  <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
                                    {primaryTag}
                                  </span>
                                </div>

                                {/* Title */}
                                <h4 className="text-lg font-bold font-['Montserrat'] text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                  {post.title}
                                </h4>

                                {/* Excerpt */}
                                <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-1 line-clamp-2 font-['DM_Sans']">
                                  {excerpt}
                                </p>

                                {/* Meta Footer */}
                                <div className="border-t border-slate-100 pt-4 space-y-2">
                                  <div className="flex items-center justify-between text-xs text-slate-500">
                                    <div className="flex items-center gap-2">
                                      <CalendarDays size={14} />
                                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString(
                                        "en-US",
                                        { month: "short", day: "numeric", year: "2-digit" }
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Clock size={14} />
                                      {getReadMinutes(stripHtml(post.content || ""))} min
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar (1/3 width) */}
              <aside className="lg:col-span-1 space-y-6">
                {/* Latest Posts Widget */}
                <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-lg font-black font-['Montserrat'] text-slate-900 mb-5 flex items-center gap-2">
                    <span className="w-1 h-6 bg-indigo-600 rounded-full"></span>
                    Latest Posts
                  </h3>
                  <div className="space-y-4">
                    {latestPosts.map((post, idx) => (
                      <Link key={post.id} href={`/blog/${post.slug}`}>
                        <div className="group flex gap-3 pb-4 border-b border-slate-100 last:border-b-0 last:pb-0 cursor-pointer">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                              {idx + 1}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                              {post.title}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1">
                              {new Date(post.publishedAt || post.createdAt).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric" }
                              )}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Newsletter Signup Widget */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg p-6 text-white">
                  <h3 className="text-lg font-black font-['Montserrat'] mb-2">
                    Subscribe to Our Blog
                  </h3>
                  <p className="text-sm text-indigo-100 mb-4 font-['DM_Sans']">
                    Get the latest marketing tips and strategies delivered to your inbox.
                  </p>
                  <div className="flex flex-col gap-3">
                    <Input
                      placeholder="Your email address"
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/60 placeholder-shown:text-white"
                    />
                    <button className="bg-white text-indigo-600 font-semibold py-2.5 rounded-lg hover:bg-indigo-50 transition-colors">
                      Subscribe Now
                    </button>
                  </div>
                </div>

                {/* Categories Widget */}
                {allTags.length > 0 && (
                  <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-lg font-black font-['Montserrat'] text-slate-900 mb-5 flex items-center gap-2">
                      <span className="w-1 h-6 bg-indigo-600 rounded-full"></span>
                      Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                          className={`text-xs font-semibold px-3 py-2 rounded-lg transition-all ${
                            selectedTag === tag
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-100 text-slate-700 hover:bg-indigo-100"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* About Widget */}
                <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-lg font-black font-['Montserrat'] text-slate-900 mb-3">
                    About This Blog
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-['DM_Sans'] mb-4">
                    Discover practical digital marketing strategies, SEO tips, and growth insights from industry experts.
                  </p>
                  <Link href="/contact">
                    <button className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center justify-center gap-2">
                      Get in Touch <ArrowRight size={16} />
                    </button>
                  </Link>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
