import { NextResponse } from "next/server";
import { headers } from "next/headers";
import crypto from "node:crypto";
import { connectDB } from "@/lib/mongoose";
import { ViewEvent } from "@/lib/models/ViewEvent";
import { Post } from "@/lib/models/Post";

function getIP(h: Headers) {
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const cf = h.get("cf-connecting-ip");
  if (cf) return cf;
  return h.get("x-real-ip") || "0.0.0.0";
}

export async function POST(req: Request) {
  try {
    const { slug } = await req.json();
    if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    await connectDB();
    const h = await headers();
    const ip = getIP(h as any);
    const bucket = Math.floor(Date.now() / (1000 * 60 * 60 * 6)); // 6-hour bucket
    const ipHash = crypto.createHash("sha256").update(`${ip}-${bucket}`).digest("hex");

    const exists = await ViewEvent.findOne({ slug, ipHash });
    if (exists) return NextResponse.json({ ok: true, rateLimited: true });

    await ViewEvent.create({ slug, ipHash } as any);
    await Post.updateOne({ slug }, { $inc: { views: 1 } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
