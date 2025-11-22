import Link from "next/link";
import PostForm from "@/components/admin/PostForm";

export default function CreatePostPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8">
        <Link href="/admin" className="text-blue-600 hover:text-blue-800">
          ← Back to Admin
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Create New Post</h1>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-8">
        <PostForm />
      </div>
    </div>
  );
}
