import { NextResponse } from "next/server";
import { getCategoryTreeWithCounts } from "@/actions/categories";

export async function GET() {
  const tree = await getCategoryTreeWithCounts();
  return NextResponse.json(tree);
}
