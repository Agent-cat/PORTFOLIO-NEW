export default function BlogListSkeleton() {
  return (
    <main className="min-h-screen bg-[#d4d3d3]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Header Skeleton */}
        <div className="mb-12">
          <div className="w-48 h-12 bg-gray-300 rounded-lg animate-pulse mb-4"></div>
          <div className="w-64 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Category Filter Skeleton */}
        <div className="mb-8">
          <div className="flex gap-2 flex-wrap">
            <div className="w-20 h-8 bg-gray-800 text-white rounded-full animate-pulse"></div>
            <div className="w-16 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-24 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-18 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-14 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Article Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col h-full pb-4 border-b-2 border-gray-400">
              {/* Image Skeleton */}
              <div className="w-full h-48 bg-gray-300 rounded-lg mb-4 animate-pulse"></div>
              
              {/* Content Skeleton */}
              <div className="flex flex-col grow">
                {/* Title Skeleton */}
                <div className="w-full h-7 bg-gray-300 rounded mb-3 animate-pulse"></div>
                <div className="w-3/4 h-7 bg-gray-300 rounded mb-4 animate-pulse"></div>
                
                {/* Description Skeleton */}
                <div className="space-y-2 mb-4 grow">
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-5/6 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
                
                {/* Date Skeleton */}
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="mt-12 flex justify-center">
          <div className="flex gap-2">
            <div className="w-10 h-10 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-10 h-10 bg-gray-800 text-white rounded animate-pulse"></div>
            <div className="w-10 h-10 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-10 h-10 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-10 h-10 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
