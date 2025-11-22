import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Post } from "@/lib/models/Post";
import { requireAdmin } from "@/lib/auth";
import { createPost } from "@/actions/posts";

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();
    const posts = await Post.find().sort({ createdAt: -1 }).lean();
    
    // Ensure proper serialization by converting to plain objects
    const serializedPosts = posts.map((post: any) => ({
      _id: post._id?.toString?.() || post._id,
      id: post._id?.toString?.() || post._id,
      slug: post.slug,
      title: post.title,
      description: post.description,
      pages: post.pages || [],
      author: post.author,
      image: post.image,
      tags: post.tags || [],
      published: post.published,
      views: post.views,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      categories: post.categories || [],
    }));
    
    return NextResponse.json(serializedPosts);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error fetching posts:", errorMessage);
    
    // Return 401 for auth errors
    if (errorMessage === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized", details: "Please log in" },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to fetch posts", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const created = await createPost(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Failed to create post", details: errorMessage },
      { status: errorMessage === "Slug already exists" ? 409 : 400 }
    );
  }
}
