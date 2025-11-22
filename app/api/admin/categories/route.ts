import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { listCategories } from "@/actions/categories";
import { createCategory } from "@/actions/categories";

export async function GET() {
  await requireAdmin();
  const cats = await listCategories();
  return NextResponse.json(cats);
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const created = await createCategory(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
