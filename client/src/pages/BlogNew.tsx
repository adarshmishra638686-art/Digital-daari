import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Loader2, CalendarDays } from "lucide-react";
import { trpc } from "@/lib/trpc";

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

export default function BlogNew() {
  const { data: posts = [], isLoading } = trpc.blog.getPublished.useQuery(
    { limit: 1000 },
    { refetchOnMount: "always" }
  );

  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 9;

  const allTags = useMemo(() => {
    return Array.from(
      new Set(posts.flatMap((p) => (p.tags || "").split(",").map((t) => t.trim())))
    ).filter(Boolean);
  }, [posts]);

  const filtered = useMemo(() => {
    const arr = posts.filter((p) => p.status === "published");
    if (selectedTag) {
      return arr.filter((p) => (p.tags || "").split(",").map((t) => t.trim()).includes(selectedTag));
    }
    return arr;
  }, [posts, selectedTag]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  if (page > totalPages) setPage(1);

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-slate-50 border-b border-slate-100">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-3xl font-black">Digital Marketing Blog</h1>
          <p className="mt-2 text-slate-600 max-w-2xl">
            Discover the latest digital marketing strategies, trends, and insights from our experts.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <nav className="mb-6 flex flex-wrap gap-3 items-center">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-2 rounded-md ${!selectedTag ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-3 py-2 rounded-md ${selectedTag === tag ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`}
            >
              {tag}
            </button>
          ))}
        </nav>

        {isLoading ? (
          <div className="py-24 flex justify-center">
            <Loader2 className="animate-spin text-slate-700" size={36} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {current.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                  <article className="h-full bg-white border border-slate-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-48 bg-slate-100 overflow-hidden">
                      {extractFirstImageSrc(post.content || "") || post.featuredImage ? (
                        <img src={post.featuredImage || extractFirstImageSrc(post.content || "")} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">No image</div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                        <span className="font-medium text-slate-700">{(post.tags || "").split(",")[0] || "General"}</span>
                        <span className="flex items-center gap-2"><CalendarDays size={12} />{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h2 className="font-semibold text-lg text-slate-900 mb-2 line-clamp-2">{post.title}</h2>
                      <p className="text-sm text-slate-600 line-clamp-3">{post.excerpt || stripHtml(post.content || "").slice(0, 140) + "..."}</p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            <footer className="mt-8 flex items-center justify-between">
              <div className="text-sm text-slate-600">Showing {filtered.length} articles</div>
              <div className="flex items-center gap-2">
                <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 rounded-md bg-slate-100 disabled:opacity-40">Prev</button>
                <div className="px-3 py-1 text-sm">{page} / {totalPages}</div>
                <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-1 rounded-md bg-slate-100 disabled:opacity-40">Next</button>
              </div>
            </footer>
          </>
        )}
      </main>
    </div>
  );
}
