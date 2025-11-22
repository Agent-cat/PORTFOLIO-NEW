import Link from "next/link";

export default function NotFound() {
  return (
    <main className="w-full min-h-screen flex items-center justify-center">
      <section className="mx-auto max-w-7xl px-6 text-center">
        <h1 className="text-6xl md:text-7xl font-bold text-gray-900">404</h1>
        <p className="mt-4 text-lg text-gray-700">
          Page not found. The page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-full border border-black px-6 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-black hover:text-gray-100"
        >
          Back to home
        </Link>
      </section>
    </main>
  );
}
