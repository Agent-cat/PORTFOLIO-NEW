import { NextResponse } from "next/server";
import { getPosts } from "@/actions/posts";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || undefined;
  const tag = searchParams.get("tag") || undefined;
  const categoryId = searchParams.get("categoryId") || undefined;
  const author = searchParams.get("author") || undefined;
  const section = (searchParams.get("section") as any) || undefined;
  const publishedParam = searchParams.get("published");
  const published = publishedParam === null ? undefined : publishedParam === "true";
  const take = Number(searchParams.get("take") || "0") || 0;
  const page = Number(searchParams.get("page") || "1") || 1;
  const sortBy = (searchParams.get("sortBy") as any) || undefined;
  const sortOrder = (Number(searchParams.get("sortOrder") || "-1") as any) || -1;

  const posts = await getPosts({ q, tag, categoryId, author, section, published, take, page, sortBy, sortOrder });
  return NextResponse.json(posts);
}
