import { NextResponse } from "next/server";
import { getRenderedPage, getPostBySlug } from "@/actions/posts";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || "1") || 1;
  const [post, rendered] = await Promise.all([
    getPostBySlug(slug),
    getRenderedPage(slug, page),
  ]);
  if (!post || !rendered) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    blog: {
      slug: post.slug,
      title: post.title,
      description: post.description,
      author: post.author,
      image: (post as any).image || null,
      tags: (post as any).tags || [],
      views: (post as any).views || 0,
      categories: (post as any).categories || [],
      published: (post as any).published,
      createdAt: (post as any).createdAt,
      updatedAt: (post as any).updatedAt,
    },
    page: rendered,
  });
}
