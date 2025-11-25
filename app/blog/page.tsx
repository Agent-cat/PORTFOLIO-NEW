import { getPosts, type PostModel } from "@/actions/posts";
import ArticleCard from "@/components/blog/ArticleCard";
import SearchBar from "@/components/blog/SearchBar";
import CategoryFilter from "@/components/blog/CategoryFilter";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; category?: string }>;
}) {
  const params = await searchParams;
  const posts = await getPosts({
    q: params?.q ?? undefined,
    tag: params?.tag ?? undefined,
  });

  // Extract all unique tags from posts to use as categories
  const allCategories = Array.from(
    new Set(posts.flatMap((post: PostModel) => post.tags || []))
  ).sort();

  // Filter posts by selected category
  const selectedCategory = params?.category;
  const filteredPosts = selectedCategory
    ? posts.filter((post: PostModel) => post.tags?.includes(selectedCategory))
    : posts;

  return (
    <main className="min-h-screen ">
      <div className="mx-auto max-w-5xl px-8 md:px-12 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black">
            Blog Articles
          </h1>
          <p className="mt-3 text-lg text-black">
            Discover insights, tutorials, and stories
          </p>
        </div>

        <div className="mt-8 mb-12 flex gap-4 items-center justify-center flex-wrap max-w-2xl mx-auto">
          <div className="w-full">
            <SearchBar placeholder="Search articles..." />
          </div>
          {allCategories.length > 0 && (
            <CategoryFilter categories={allCategories} />
          )}
        </div>

        {filteredPosts.length === 0 ? (
          <p className="mt-12 text-center text-black text-lg">
            No articles found.
          </p>
        ) : (
          <div className="mt-10 grid gap-8 grid-cols-1 md:grid-cols-2">
            {filteredPosts.map((p: PostModel) => (
              <ArticleCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
