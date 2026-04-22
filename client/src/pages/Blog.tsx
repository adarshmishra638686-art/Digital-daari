/* ============================================================
   BLOG PAGE — Dynamic blog posts from database
   Design: Electric Growth — Dark Navy + Sky Blue
   ============================================================ */

import { useState } from "react";
import { Link } from "wouter";
import { Clock, ArrowRight, Search, Tag, MessageCircle, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Streamdown } from "streamdown";

export default function Blog() {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Fetch published blog posts
  const { data: posts, isLoading } = trpc.blog.getPublished.useQuery({
    limit: 50,
  });

  // Filter posts based on search and selected tag
  const filteredPosts = posts?.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(search.toLowerCase());

    const matchesTag = !selectedTag || (post.tags?.includes(selectedTag));

    return matchesSearch && matchesTag;
  }) || [];

  // Extract unique tags from all posts
  const allTags = Array.from(
    new Set(
      posts?.flatMap((post) => post.tags?.split(",").map((t) => t.trim()) || []) || []
    )
  ).filter(Boolean);

  return (
    <div className="min-h-screen" style={{ background: "#06091A" }}>
      {/* ===== HERO SECTION ===== */}
      <section
        className="relative min-h-[400px] flex items-center pt-28 overflow-hidden"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663571710539/2AKrWQ2ThXRHggBVBCqHwp/hero-bg-8SxTT79aV5ntSmzyUNCTpT.webp)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(6,9,26,0.92) 0%, rgba(6,9,26,0.75) 50%, rgba(6,9,26,0.85) 100%)",
          }}
        />

        {/* Glow orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #00AEEF, transparent)" }}
        />

        <div className="container relative z-10 py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-['Montserrat'] text-white leading-tight mb-4">
              Digital Marketing <span className="gradient-text">Insights</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl font-['DM_Sans'] leading-relaxed">
              Expert tips, strategies, and case studies to help your business grow online.
            </p>
          </div>
        </div>
      </section>

      {/* ===== SEARCH & FILTER ===== */}
      <section className="section-pad" style={{ background: "#0D1230" }}>
        <div className="container">
          <div className="space-y-6">
            {/* Search */}
            <div className="relative max-w-2xl">
              <Search size={18} className="absolute left-4 top-3.5 text-[#00AEEF]" />
              <Input
                placeholder="Search blog posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 py-3 bg-[#06091A] border-[rgba(0,174,239,0.2)] text-white placeholder-slate-500"
              />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-2 rounded-full text-sm font-['DM_Sans'] transition-all ${
                  !selectedTag
                    ? "bg-[#00AEEF] text-white"
                    : "bg-[#06091A] text-slate-300 border border-[rgba(0,174,239,0.2)] hover:border-[#00AEEF]"
                }`}
              >
                All Posts
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-4 py-2 rounded-full text-sm font-['DM_Sans'] transition-all flex items-center gap-2 ${
                    selectedTag === tag
                      ? "bg-[#00AEEF] text-white"
                      : "bg-[#06091A] text-slate-300 border border-[rgba(0,174,239,0.2)] hover:border-[#00AEEF]"
                  }`}
                >
                  <Tag size={14} />
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== BLOG POSTS GRID ===== */}
      <section className="section-pad" style={{ background: "#06091A" }}>
        <div className="container">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-[#00AEEF]" size={32} />
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <div className="card-glow rounded-xl overflow-hidden bg-[#0D1230] group h-full hover:border-[#00AEEF] transition-all cursor-pointer">
                    {/* Featured Image */}
                    {post.featuredImage && (
                      <div className="h-48 overflow-hidden bg-[#06091A]">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                      {/* Meta */}
                      <div className="flex items-center gap-4 mb-3 text-xs text-slate-400 font-['DM_Sans']">
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          {Math.ceil((post.content?.length || 0) / 200)} min read
                        </div>
                        <span>
                          {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold font-['Montserrat'] text-white mb-2 group-hover:text-[#00AEEF] transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-slate-400 text-sm leading-relaxed font-['DM_Sans'] mb-4 line-clamp-3">
                        {post.excerpt || post.content?.substring(0, 150) + "..."}
                      </p>

                      {/* Tags */}
                      {post.tags && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.split(",").map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-1 rounded bg-[#00AEEF]/10 text-[#00AEEF] font-['DM_Sans']"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* CTA */}
                      <div className="flex items-center gap-2 text-[#00AEEF] font-semibold text-sm font-['DM_Sans'] group-hover:gap-3 transition-all">
                        Read More <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-400 text-lg font-['DM_Sans']">
                No blog posts found. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section
        className="relative section-pad overflow-hidden"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663571710539/2AKrWQ2ThXRHggBVBCqHwp/cta-bg-fFKXsuvhuVkYZUHHac7WC3.webp)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(6,9,26,0.85)" }} />
        <div className="container relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black font-['Montserrat'] text-white mb-6">
            Ready to Grow Your <span className="gradient-text">Business?</span>
          </h2>
          <p className="text-slate-300 text-lg md:text-xl font-['DM_Sans'] max-w-2xl mx-auto mb-10">
            Apply these strategies to your business or let our experts handle it for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <button className="shimmer-btn text-white font-black text-lg px-10 py-5 rounded-xl font-['Montserrat'] tracking-wide hover:scale-105 transition-all duration-300">
                Get Free Consultation <ArrowRight size={20} />
              </button>
            </Link>
            <a
              href="https://wa.link/qgr50h"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#25D366] text-white font-black text-lg px-10 py-5 rounded-xl font-['Montserrat'] tracking-wide hover:bg-[#22C55E] hover:scale-105 transition-all duration-300 justify-center"
            >
              <MessageCircle size={20} />
              WhatsApp Us Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
