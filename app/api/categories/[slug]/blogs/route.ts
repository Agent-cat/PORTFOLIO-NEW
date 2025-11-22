import { NextResponse } from "next/server";
import { getCategoryBySlug } from "@/actions/categories";
import { getPosts } from "@/actions/posts";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const posts = await getPosts({ categoryId: cat.id, published: true });
  return NextResponse.json(posts);
}
