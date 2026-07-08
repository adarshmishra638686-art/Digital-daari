import { useEffect } from "react";
import { Link, useRoute } from "wouter";
import {
  ArrowLeft,
  CalendarDays,
  Loader2,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { setPageSeo } from "@/components/Seo";
import "./blog-post.css";

function extractFirstImageSrc(html: string) {
  const match = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  return match?.[1] || "";
}

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

function getTagList(tags?: string | null) {
  return (tags || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export default function BlogPost() {
  const [matched, params] = useRoute<{ slug: string }>("/blog/:slug");
  const slug = matched ? params.slug : "";

  const { data: post, isLoading } = trpc.blog.getBySlug.useQuery(
    { slug },
    { enabled: Boolean(slug) }
  );

  const { data: allPosts } = trpc.blog.getPublished.useQuery({ limit: 50 });

  useEffect(() => {
    if (!post) return;

    setPageSeo(
      {
        title: post.metaTitle || post.title,
        description:
          post.metaDescription ||
          post.excerpt ||
          "Read the latest Digitaldaari blog post and digital marketing insights.",
        keywords:
          post.keywords || post.tags || "digital marketing blog, SEO insights, digitaldaari",
      },
      `/blog/${post.slug}`
    );
  }, [post]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32">
        <div className="container flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32">
        <div className="container py-16 text-center">
          <h1 className="text-3xl font-black text-slate-900">Post not found</h1>
          <p className="mt-3 text-slate-600">This post is unavailable or not published yet.</p>
          <Link
            href="/blog"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const heroImage = post.featuredImage || extractFirstImageSrc(post.content || "");
  const authorName = (post as any).authorName || "Digitaldaari";
  const authorInitials = authorName
    .split(" ")
    .filter(Boolean)
    .map((part: string) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const postTags = getTagList(post.tags);
  const relatedPosts = (allPosts || [])
    .filter((item) => {
      if (item.id === post.id) return false;
      const itemTags = getTagList(item.tags);
      return postTags.some((tag) => itemTags.some((itemTag) => itemTag.toLowerCase() === tag.toLowerCase()));
    })
    .slice(0, 3);

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/blog/${post.slug}`;
  const encodedTitle = encodeURIComponent(post.title);
  const encodedUrl = encodeURIComponent(shareUrl);
  const postSummary = post.metaDescription || post.excerpt || stripHtml(post.content || "").slice(0, 180);

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 text-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="mx-auto max-w-4xl py-14 md:py-18">
            <Link
              href="/blog"
              className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-300 transition-colors hover:text-indigo-200"
            >
              <ArrowLeft size={16} />
              Back to Blog
            </Link>

            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-300">
              Blog Post
            </p>
            <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-5xl lg:text-6xl font-['Montserrat']">
              {post.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
              {postSummary}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <CalendarDays size={16} />
                <span className="font-semibold">
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <span className="font-semibold">By {authorName}</span>
              </div>
            </div>

            {postTags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {postTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block rounded-full border border-indigo-400/40 bg-indigo-500/20 px-4 py-2 text-sm font-semibold text-indigo-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            <div className="lg:col-span-3 space-y-8">
              {heroImage && (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  <img
                    src={heroImage}
                    alt={post.title}
                    className="aspect-[16/9] w-full object-contain bg-slate-100"
                  />
                </div>
              )}

              <article className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm md:p-12">
                <div
                  className="blog-article-content prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </article>

              <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-900 font-['Montserrat']">
                  <Share2 size={20} className="text-indigo-600" />
                  Share This Article
                </h3>
                <div className="flex flex-wrap gap-4">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700"
                  >
                    <Facebook size={18} />
                    Share on Facebook
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-sky-600"
                  >
                    <Twitter size={18} />
                    Share on Twitter
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-blue-800"
                  >
                    <Linkedin size={18} />
                    Share on LinkedIn
                  </a>
                </div>
              </div>

              {relatedPosts.length > 0 && (
                <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                  <h3 className="mb-5 text-lg font-black text-slate-900 font-['Montserrat']">Latest Blogs</h3>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {relatedPosts.map((related) => (
                      <Link
                        key={related.id}
                        href={`/blog/${related.slug}`}
                        className="group rounded-xl border border-slate-100 p-4 transition-all hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
                      >
                        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                          {new Date(related.publishedAt || related.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <p className="mt-2 line-clamp-2 font-semibold text-slate-900 group-hover:text-indigo-700">
                          {related.title}
                        </p>
                        <p className="mt-2 text-sm text-slate-500 line-clamp-3">
                          {related.excerpt || stripHtml(related.content || "").slice(0, 120)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="space-y-6 lg:col-span-1">
              <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-black text-slate-900 font-['Montserrat']">About Author</h3>
                <div className="mb-4 flex gap-4">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-600">
                    {authorInitials || "DA"}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{authorName}</p>
                    <p className="font-['DM_Sans'] text-sm text-slate-600">
                      Digital marketing experts sharing growth strategies, SEO insights, and practical ideas.
                    </p>
                  </div>
                </div>
              </div>

              {postTags.length > 0 && (
                <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-black text-slate-900 font-['Montserrat']">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {postTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 text-white shadow-sm">
                <h3 className="mb-3 text-lg font-black font-['Montserrat']">Newsletter</h3>
                <p className="mb-4 text-sm text-indigo-100 font-['DM_Sans']">
                  Get weekly marketing tips, SEO updates, and content ideas delivered to your inbox.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-semibold text-indigo-700 transition-colors hover:bg-indigo-50"
                >
                  Subscribe
                </Link>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-black text-slate-900 font-['Montserrat']">Article Info</h3>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                    <span className="font-semibold text-slate-900">Published</span>
                    <span>
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-slate-900">Categories</span>
                    <span>{postTags.length || 0}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-3 text-lg font-black text-slate-900 font-['Montserrat']">Need Help?</h3>
                <p className="mb-4 text-sm text-slate-600 font-['DM_Sans']">
                  Want help with SEO, blog content, or website growth strategy?
                </p>
                <Link
                  href="/contact"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  Contact Us
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
