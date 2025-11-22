export default function Loading() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 h-8 w-40 rounded-full border border-black/10" />
      <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
      <div className="mt-3 h-8 w-4/5 bg-gray-200 rounded animate-pulse" />
      <div className="mt-2 h-5 w-3/5 bg-gray-200 rounded animate-pulse" />
      <div className="mt-6 flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="mt-8 space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-4 w-full bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    </main>
  );
}
