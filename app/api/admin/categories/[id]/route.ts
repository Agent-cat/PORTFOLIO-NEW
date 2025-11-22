import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { updateCategory, deleteCategory } from "@/actions/categories";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const body = await req.json();
  await updateCategory(id, body);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  await deleteCategory(id);
  return NextResponse.json({ ok: true });
}
