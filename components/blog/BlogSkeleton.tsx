export default function BlogSkeleton() {
  return (
    <main className="min-h-screen bg-[#d4d3d3]">
      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Header Skeleton */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-8 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="w-4 h-4 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="w-48 h-5 bg-gray-300 rounded animate-pulse"></div>
            </div>
            <div className="w-32 h-4 bg-gray-300 rounded animate-pulse hidden sm:block"></div>
          </div>
          
          {/* Tags Skeleton */}
          <div className="flex flex-wrap gap-1.5">
            <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-14 h-6 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Divider Skeleton */}
        <div className="border-t border-gray-400 my-6"></div>

        {/* Article Content Skeleton */}
        <article className="mb-16">
          {/* Title Skeleton */}
          <div className="w-3/4 h-12 bg-gray-300 rounded-lg mb-8 animate-pulse"></div>
          
          {/* Paragraph Skeletons */}
          <div className="space-y-4">
            <div className="w-full h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-full h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-5/6 h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-4/5 h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-full h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-3/4 h-5 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Code Block Skeleton */}
          <div className="my-6">
            <div className="w-full h-32 bg-gray-800 rounded-lg animate-pulse"></div>
          </div>

          {/* More Paragraph Skeletons */}
          <div className="space-y-4 mt-6">
            <div className="w-full h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-5/6 h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-full h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-4/5 h-5 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* List Skeleton */}
          <div className="my-6 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              <div className="w-4/5 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Final Paragraphs */}
          <div className="space-y-4 mt-6">
            <div className="w-full h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-5/6 h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-3/4 h-5 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </article>

        {/* Pagination Skeleton - Only show if multi-page content is expected */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#d4d3d3] border-t-2 border-black shadow-lg">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
            <div className="w-20 h-9 bg-gray-300 rounded-md animate-pulse"></div>
            <div className="w-16 h-9 bg-gray-300 rounded-md animate-pulse"></div>
            <div className="w-20 h-9 bg-gray-300 rounded-md animate-pulse"></div>
          </div>
        </div>

        {/* Padding for fixed bottom nav */}
        <div className="h-16 sm:h-20"></div>
      </div>
    </main>
  );
}
