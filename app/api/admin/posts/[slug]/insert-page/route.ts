import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { insertPage } from "@/actions/posts";

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  await requireAdmin();
  const { slug } = await params;
  const body = await req.json();
  if (!body || typeof body.pageNumber !== "number" || !body.content) {
    return NextResponse.json({ error: "pageNumber (number) and content (string) required" }, { status: 400 });
  }
  const title = body.title || `Page ${body.pageNumber}`;
  await insertPage(slug, { pageNumber: Number(body.pageNumber), title, content: body.content });
  return NextResponse.json({ ok: true });
}
