"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { getPostBySlug, getRenderedPage } from "@/actions/posts";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import ContentRenderer from "@/components/blog/ContentRenderer";
import type { IPost } from "@/lib/models/Post";

function formatDate(value: string | Date | null) {
  if (!value) return "N/A";
  const d = new Date(value);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [post, setPost] = useState<IPost | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [markdownContent, setMarkdownContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState<string>("");
  const [showPageDropdown, setShowPageDropdown] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { slug: resolvedSlug } = await params;
        setSlug(resolvedSlug);
        const fetchedPost = await getPostBySlug(resolvedSlug);

        if (!fetchedPost || !fetchedPost.published) {
          notFound();
        }

        // Ensure pages array exists
        if (!fetchedPost.pages || fetchedPost.pages.length === 0) {
          console.warn(`Post "${resolvedSlug}" has no pages`);
        }

        setPost(fetchedPost);
        // Fetch initial page markdown content
        try {
          const rp = await getRenderedPage(resolvedSlug, 1);
          setMarkdownContent(rp?.contentMarkdown || "");
        } catch {}
        // Increment views (rate-limited server endpoint)
        try {
          fetch("/api/views", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug: resolvedSlug }),
          });
        } catch {}
        setLoading(false);
      } catch (error) {
        console.error("Error loading post:", error);
        notFound();
      }
    })();
  }, [params]);

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  if (!post) {
    notFound();
  }

  const pages = post.pages || [];
  const totalPages = pages.length;
  const currentPageData = pages[currentPage - 1];

  const goToPreviousPage = async () => {
    if (currentPage > 1) {
      const next = currentPage - 1;
      setCurrentPage(next);
      try {
        const rp = await getRenderedPage(slug, next);
        setMarkdownContent(rp?.contentMarkdown || "");
      } catch {}
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToNextPage = async () => {
    if (currentPage < totalPages) {
      const next = currentPage + 1;
      setCurrentPage(next);
      try {
        const rp = await getRenderedPage(slug, next);
        setMarkdownContent(rp?.contentMarkdown || "");
      } catch {}
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-[#d4d3d3]">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Header Section */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-black hover:shadow-lg transition-all"
          >
            <span>←</span> Back to Blog
          </Link>
        </div>

        {/* Title and Metadata Section */}
        <div className="mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-black mb-6">
            {post.title}
          </h1>

          {/* Author and Date - Horizontal Layout */}
          <div className="flex items-center gap-8 mb-6 text-sm">
            <div className="flex flex-col">
              <span className="text-gray-600 text-xs uppercase tracking-wide">
                Author
              </span>
              <span className="text-lg font-bold text-black">
                {post.author}
              </span>
            </div>
            <div className="w-px h-8 bg-gray-400" />
            <div className="flex flex-col">
              <span className="text-gray-600 text-xs uppercase tracking-wide">
                Published
              </span>
              <span className="text-lg font-bold text-black">
                {formatDate(post.createdAt)}
              </span>
            </div>
          </div>

          {post.description ? (
            <p className="text-lg text-gray-800 mb-6">{post.description}</p>
          ) : null}

          {/* Categories */}
          {(post as any)?.categories?.length ? (
            <div className="flex flex-wrap gap-2 mb-6">
              {(post as any).categories.map((c: any, i: number) => (
                <Link
                  key={c.id}
                  href={`/categories/${c.slug}`}
                  className="inline-block rounded-full border-2 border-black bg-gray-900 text-white px-4 py-1.5 text-sm font-medium hover:bg-black transition-colors"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          ) : null}

          {/* Tags */}
          {post.tags?.length ? (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((t: string, i: number) => (
                <span
                  key={i}
                  className="inline-block bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="border-t-2 border-black my-8" />

        {/* Article Content */}
        {currentPageData ? (
          <article className="mb-16">
            <ContentRenderer content={markdownContent} />
          </article>
        ) : totalPages === 0 ? (
          <div className="text-center text-gray-800 py-12">
            <p className="text-lg font-medium">
              No content pages available for this post.
            </p>
          </div>
        ) : (
          <div className="text-center text-gray-800 py-12">
            <p className="text-lg font-medium">Loading content...</p>
          </div>
        )}
      </div>

      {/* Fixed Bottom Navigation */}
      {totalPages > 1 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#d4d3d3] border-t-2 border-black">
          <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between gap-4">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="flex items-center gap-2 rounded-lg border-2 border-black bg-gray-900 text-white px-6 py-3 font-medium hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
              Previous
            </button>

            <div className="relative">
              <button
                onClick={() => setShowPageDropdown(!showPageDropdown)}
                className="flex items-center gap-2 rounded-lg border-2 border-black bg-gray-900 text-white px-4 py-3 font-medium hover:bg-black transition-colors"
              >
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <ChevronDown
                  size={20}
                  className={`transition-transform ${
                    showPageDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showPageDropdown && (
                <div className="absolute bottom-full left-0 mb-2 bg-[#d4d3d3] border-2 border-black rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                  {pages.map((pageData, idx) => (
                    <button
                      key={idx}
                      onClick={async () => {
                        setCurrentPage(idx + 1);
                        try {
                          const rp = await getRenderedPage(slug, idx + 1);
                          setMarkdownContent(rp?.contentMarkdown || "");
                        } catch {}
                        setShowPageDropdown(false);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`w-full text-left px-4 py-2 font-medium transition-colors ${
                        currentPage === idx + 1
                          ? "bg-black text-white"
                          : "text-black hover:bg-gray-300"
                      }`}
                    >
                      <div className="font-semibold">{pageData.title}</div>
                      <div className="text-xs text-gray-600">
                        Page {idx + 1} of {totalPages}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 rounded-lg border-2 border-black bg-gray-900 text-white px-6 py-3 font-medium hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Padding for fixed bottom nav */}
      {totalPages > 1 && <div className="h-24" />}
    </main>
  );
}
