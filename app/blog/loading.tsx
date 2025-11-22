export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="text-center">
        <div className="h-8 w-56 mx-auto rounded bg-gray-200 animate-pulse" />
        <div className="mt-2 h-4 w-72 mx-auto rounded bg-gray-200 animate-pulse" />
      </div>

      <div className="mt-6 h-10 max-w-xl mx-auto rounded-md bg-gray-200 animate-pulse" />

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-black/10 bg-white overflow-hidden">
            <div className="h-44 bg-gray-200 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-2/5 bg-gray-200 rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-6 w-14 bg-gray-200 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
