"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { getPostBySlug, getRenderedPage } from "@/actions/posts";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import ContentRenderer from "@/components/blog/ContentRenderer";
import BlogSkeleton from "@/components/blog/BlogSkeleton";
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
          // Post has no pages, continue silently
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
        notFound();
      }
    })();
  }, [params]);

  if (loading) {
    return <BlogSkeleton />;
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
      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Compact Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full border border-gray-400 bg-transparent text-gray-700 px-3 py-1.5 text-sm font-medium hover:bg-gray-900 hover:text-white hover:border-black transition-all"
              >
                <span>←</span> Blog
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-sm font-semibold text-gray-900 truncate max-w-md">
                {post.title}
              </span>
              {currentPageData && (
                <>
                  <span className="text-gray-400">/</span>
                  <span className="text-sm font-medium text-gray-600">
                    {currentPageData.title}
                  </span>
                </>
              )}
            </div>
            <div className="text-xs text-gray-500 hidden sm:block">
              {post.author} • {formatDate(post.createdAt)}
            </div>
          </div>

          {/* Tags */}
          {post.tags?.length ? (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((t: string, i: number) => (
                <span
                  key={i}
                  className="inline-block border border-gray-300 bg-gray-50 text-gray-700 px-2 py-1 rounded text-xs font-medium hover:bg-gray-100 transition-colors"
                >
                  #{t}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="border-t border-gray-400 my-6" />

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
        <div className="fixed bottom-0 left-0 right-0 bg-[#d4d3d3] border-t-2 border-black shadow-lg">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
            {/* Previous Button */}
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="flex items-center gap-1 sm:gap-2 rounded-md border-2 border-black bg-gray-900 text-white px-2 sm:px-4 py-1.5 sm:py-2 text-sm font-medium hover:bg-black transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </button>

            {/* Page Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowPageDropdown(!showPageDropdown)}
                className="flex items-center gap-1 sm:gap-2 rounded-md border-2 border-black bg-gray-900 text-white px-2 sm:px-3 py-1.5 sm:py-2 text-sm font-medium hover:bg-black transition-all hover:shadow-md"
              >
                <span className="text-xs">
                  {currentPage}/{totalPages}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${
                    showPageDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showPageDropdown && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-[#d4d3d3] border-2 border-black rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto w-64 sm:w-80">
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
                      className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 font-medium transition-colors border-b border-gray-300 last:border-b-0 ${
                        currentPage === idx + 1
                          ? "bg-black text-white"
                          : "text-black hover:bg-gray-300"
                      }`}
                    >
                      <div className="font-semibold text-xs sm:text-sm truncate">
                        {pageData.title}
                      </div>
                      <div className="text-xs text-gray-600">
                        Page {idx + 1} of {totalPages}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 sm:gap-2 rounded-md border-2 border-black bg-gray-900 text-white px-2 sm:px-4 py-1.5 sm:py-2 text-sm font-medium hover:bg-black transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Padding for fixed bottom nav */}
      {totalPages > 1 && <div className="h-16 sm:h-20" />}
    </main>
  );
}
