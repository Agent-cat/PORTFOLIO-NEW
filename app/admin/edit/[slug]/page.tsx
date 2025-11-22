import Link from "next/link";
import { notFound } from "next/navigation";
import PostForm from "@/components/admin/PostForm";
import { getPostBySlug } from "@/actions/posts";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8">
        <Link href="/admin" className="text-blue-600 hover:text-blue-800">
          ← Back to Admin
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Edit Post</h1>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-8">
        {post && (
          <PostForm
            // Pass only plain serializable fields
            post={{
              slug: post.slug,
              title: post.title,
              description: post.description ?? "",
              author: post.author,
              image: post.image ?? "",
              tags: post.tags ?? [],
              published: post.published,
              pages: Array.isArray(post.pages) ? post.pages : [],
              categories: (post as any).categories || [],
              section: (post as any).section || "content",
            } as any}
            isEditing
          />
        )}
      </div>
    </div>
  );
}
