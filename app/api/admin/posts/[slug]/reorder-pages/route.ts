import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { reorderPages } from "@/actions/posts";

export async function PATCH(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  await requireAdmin();
  const { slug } = await params;
  const body = await req.json();
  if (!Array.isArray(body.order)) {
    return NextResponse.json({ error: "order must be an array" }, { status: 400 });
  }
  await reorderPages(slug, body.order);
  return NextResponse.json({ ok: true });
}
