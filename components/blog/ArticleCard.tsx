import Link from "next/link";
import type { PostModel } from "@/actions/posts";

function formatDate(value: string | Date | null) {
  if (!value) return "N/A";
  const d = new Date(value);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

export default function ArticleCard({ post }: { post: PostModel }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="flex flex-col h-full pb-4 border-b-2 border-gray-400 group"
    >
      {/* Image Rectangle */}
      <div className="w-full h-48 bg-gray-800 overflow-hidden rounded-lg mb-4">
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-600 text-sm font-medium">
            No image
          </div>
        )}
      </div>

      {/* Content Below */}
      <div className="flex flex-col grow">
        <h3 className="text-2xl font-bold tracking-tight text-black line-clamp-2 group-hover:underline transition-all">
          {post.title}
        </h3>
        {post.description ? (
          <p className="mt-2 text-base text-gray-700 line-clamp-2 grow">
            {post.description}
          </p>
        ) : null}

        <div className="mt-4 text-sm text-gray-600">
          {formatDate(post.createdAt)}
        </div>
      </div>
    </Link>
  );
}
