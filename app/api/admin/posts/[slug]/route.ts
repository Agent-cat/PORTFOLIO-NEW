import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { updatePost, deletePost } from "@/actions/posts";

export async function PATCH(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  await requireAdmin();
  const { slug } = await params;
  const body = await req.json();
  const updated = await updatePost(slug, body);
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  await requireAdmin();
  const { slug } = await params;
  await deletePost(slug);
  return NextResponse.json({ ok: true });
}
