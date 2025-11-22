"use server";

import { unstable_cache, revalidatePath, revalidateTag } from "next/cache";
import { connectDB } from "@/lib/mongoose";
import { Post, type IPost, type IPostPage } from "@/lib/models/Post";
import { Category } from "@/lib/models/Category";
import { renderMarkdownToHtml } from "@/lib/markdown";
import { requireAdmin } from "@/lib/auth";

export type CreatePostInput = {
  slug: string;
  title: string;
  description?: string | null;
  pages: IPostPage[];
  author: string;
  image?: string | null;
  tags?: string[];
  published?: boolean;
  categories?: string[];
  section?: "content" | "categories" | "other";
  autoPlaceInSection?: boolean;
};

export type PostModel = IPost;

function normalizeSlug(slug: string) {
  return slug.trim().toLowerCase();
}

function normalizePages(pages: IPostPage[]): IPostPage[] {
  const sorted = [...pages].sort((a, b) => (a.pageNumber || 0) - (b.pageNumber || 0));
  return sorted.map((p, i) => ({ pageNumber: i + 1, title: p.title || `Page ${i + 1}`, content: p.content || "" }));
}

export async function createPost(input: CreatePostInput) {
  try {
    await requireAdmin();
    await connectDB();
    
    if (!input.pages || input.pages.length === 0) {
      throw new Error("At least one page with content is required");
    }

    const slug = normalizeSlug(input.slug);

    const existing = await Post.findOne({ slug }).lean();
    if (existing) throw new Error("Slug already exists");

    const pages = normalizePages(input.pages);

    // Optional verify categories exist
    let categoryIds: any[] = [];
    if (input.categories && input.categories.length) {
      const cats = await Category.find({ _id: { $in: input.categories } }).select("_id");
      categoryIds = cats.map((c) => c._id);
    }

    const section = input.autoPlaceInSection
      ? "categories"
      : input.section || (categoryIds.length ? "categories" : "content");

    const post = await Post.create({
      slug,
      title: input.title,
      description: input.description || undefined,
      pages,
      author: input.author,
      image: input.image || undefined,
      tags: input.tags ?? [],
      published: input.published ?? false,
      categories: categoryIds,
      section,
    });
    
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    // Bust caches backed by unstable_cache tags
    try {
      revalidateTag("posts", "max");
      revalidateTag(`post:${post.slug}`, "max");
    } catch {}
    return { ok: true, id: String(post._id), slug: post.slug };
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

export async function updatePost(slug: string, data: Partial<CreatePostInput>) {
  try {
    await requireAdmin();
    await connectDB();

    const update: any = { ...data };

    if (data.slug) {
      update.slug = normalizeSlug(data.slug);
    }
    if (data.pages && data.pages.length) {
      update.pages = normalizePages(data.pages as any);
    }

    if (data.categories) {
      const cats = await Category.find({ _id: { $in: data.categories } }).select("_id");
      update.categories = cats.map((c) => c._id);
    }

    if (data.autoPlaceInSection) {
      update.section = "categories";
    }

    const post = await Post.findOneAndUpdate({ slug }, update, { new: true });
    if (!post) throw new Error("Post not found");
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    try {
      revalidateTag("posts", "max");
      revalidateTag(`post:${slug}`, "max");
    } catch {}
    return { ok: true, id: String(post._id), slug: post.slug };
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
}

export async function deletePost(slug: string) {
  await requireAdmin();
  await connectDB();
  await Post.findOneAndDelete({ slug });
  revalidatePath("/blog");
  try {
    revalidateTag("posts", "max");
    revalidateTag(`post:${slug}`, "max");
  } catch {}
}

export async function incrementViews(slug: string) {
  await connectDB();
  await Post.findOneAndUpdate({ slug }, { $inc: { views: 1 } });
}

export type ListOptions = {
  q?: string;
  tag?: string;
  categoryId?: string;
  author?: string;
  published?: boolean;
  section?: "content" | "categories" | "other";
  take?: number;
  page?: number;
  sortBy?: "createdAt" | "updatedAt" | "views" | "title";
  sortOrder?: 1 | -1;
};

export async function getPosts(opts: ListOptions = {}): Promise<IPost[]> {
  const key = `posts-${opts.q ?? ""}-${opts.tag ?? ""}-${opts.take ?? "all"}`;
  const run = unstable_cache(
    async () => {
      await connectDB();
      const query: any = { };
      if (opts.published !== undefined) query.published = opts.published;
      else query.published = true;

      if (opts.q) {
        query.$or = [
          { title: { $regex: opts.q, $options: "i" } },
          { description: { $regex: opts.q, $options: "i" } },
          { tags: opts.q },
          { "pages.content": { $regex: opts.q, $options: "i" } },
        ];
      }

      if (opts.tag) {
        query.tags = opts.tag;
      }

      if (opts.categoryId) {
        query.categories = opts.categoryId;
      }

      if (opts.author) {
        query.author = opts.author;
      }

      if (opts.section) {
        query.section = opts.section;
      }

      const sortField = opts.sortBy || "createdAt";
      const sortOrder = opts.sortOrder || -1;
      const take = opts.take || 0;
      const page = Math.max(1, opts.page || 1);

      const posts = await Post.find(query)
        .sort({ [sortField]: sortOrder })
        .skip(take ? (page - 1) * take : 0)
        .limit(take || 0)
        .lean({ virtuals: true });

      // Serialize posts to ensure all IPost properties are present
      return posts.map((post: any) => ({
        _id: post._id?.toString?.() ?? String(post._id ?? ""),
        id: post.id ?? (post._id?.toString?.() ?? String(post._id ?? "")),
        slug: post.slug,
        title: post.title,
        description: post.description ?? null,
        author: post.author,
        image: post.image ?? null,
        tags: Array.isArray(post.tags) ? post.tags : [],
        published: Boolean(post.published),
        views: Number(post.views ?? 0),
        createdAt: post.createdAt ? new Date(post.createdAt).toISOString() : null,
        updatedAt: post.updatedAt ? new Date(post.updatedAt).toISOString() : null,
        pages: Array.isArray(post.pages)
          ? post.pages.map((p: any, i: number) => ({
              pageNumber: Number(p.pageNumber ?? i + 1),
              title: p.title ?? `Page ${i + 1}`,
              content: p.content ?? "",
              _id: p._id ? String(p._id) : undefined,
            }))
          : [],
        categories: Array.isArray(post.categories)
          ? post.categories.map((c: any) => ({ id: String(c._id), name: c.name, slug: c.slug }))
          : [],
      })) as IPost[];
    },
    [key],
    { tags: ["posts"], revalidate: 60 }
  );

  return run();
}

export async function getPostBySlug(slug: string): Promise<IPost | null> {
  const run = unstable_cache(
    async () => {
      await connectDB();
      const post = (await Post.findOne({ slug })
        .populate("categories", "name slug")
        .lean({ virtuals: true })) as any;
      if (!post) return null;
      // Normalize legacy posts: synthesize pages from legacy `content`
      if ((!post.pages || post.pages.length === 0) && post.content) {
        post.pages = [
          { pageNumber: 1, title: post.title, content: post.content },
        ];
      }
      // Sort pages deterministically
      post.pages = Array.isArray(post.pages)
        ? [...post.pages].sort((a: any, b: any) => Number(a.pageNumber) - Number(b.pageNumber))
        : [];
      // Serialize to plain JS-friendly object for Client Components
      const serialized = {
        _id: post._id?.toString?.() ?? String(post._id ?? ""),
        id: post.id ?? (post._id?.toString?.() ?? String(post._id ?? "")),
        slug: post.slug,
        title: post.title,
        description: post.description ?? null,
        author: post.author,
        image: post.image ?? null,
        tags: Array.isArray(post.tags) ? post.tags : [],
        published: Boolean(post.published),
        views: Number(post.views ?? 0),
        createdAt: post.createdAt ? new Date(post.createdAt).toISOString() : null,
        updatedAt: post.updatedAt ? new Date(post.updatedAt).toISOString() : null,
        pages: Array.isArray(post.pages)
          ? post.pages.map((p: any, i: number) => ({
              pageNumber: Number(p.pageNumber ?? i + 1),
              title: p.title ?? `Page ${i + 1}`,
              content: p.content ?? "",
              _id: p._id ? String(p._id) : undefined,
            }))
          : [],
        categories: Array.isArray(post.categories)
          ? post.categories.map((c: any) => ({ id: String(c._id), name: c.name, slug: c.slug }))
          : [],
      } as any;
      return serialized as IPost;
    },
    ["post", slug],
    { tags: ["posts", `post:${slug}`], revalidate: 300 }
  );

  return run();
}

export type RenderedPage = {
  pageNumber: number;
  title: string;
  contentMarkdown: string;
  contentHtml: string;
  prevPageNumber: number | null;
  nextPageNumber: number | null;
  pagesCount: number;
  jumpTo: Array<{ pageNumber: number; title: string }>;
};

export async function getRenderedPage(slug: string, pageNumber: number): Promise<RenderedPage | null> {
  await connectDB();
  const post = await Post.findOne({ slug }).lean();
  if (!post) return null;
  const pages = Array.isArray((post as any).pages)
    ? [...(post as any).pages].sort((a: any, b: any) => Number(a.pageNumber) - Number(b.pageNumber))
    : [];
  const idx = Math.max(0, Math.min(pages.length - 1, Number(pageNumber) - 1));
  const current = pages[idx];
  if (!current) return null;
  const html = await renderMarkdownToHtml(current.content || "");
  return {
    pageNumber: Number(current.pageNumber),
    title: current.title || `Page ${idx + 1}`,
    contentMarkdown: current.content || "",
    contentHtml: html,
    prevPageNumber: idx > 0 ? Number(pages[idx - 1].pageNumber) : null,
    nextPageNumber: idx < pages.length - 1 ? Number(pages[idx + 1].pageNumber) : null,
    pagesCount: pages.length,
    jumpTo: pages.map((p: any) => ({ pageNumber: Number(p.pageNumber), title: p.title || `Page ${p.pageNumber}` })),
  };
}

export async function reorderPages(
  slug: string,
  order: Array<{ id?: string; pageNumber: number }>
) {
  await requireAdmin();
  await connectDB();
  const post = await Post.findOne({ slug });
  if (!post) throw new Error("Post not found");
  const byId = new Map<string, any>();
  (post.pages as any[]).forEach((p: any) => {
    if (p._id) byId.set(String(p._id), p);
  });
  const newPages: any[] = [];
  for (const item of order) {
    if (item.id && byId.has(item.id)) {
      const p = byId.get(item.id);
      newPages.push({ pageNumber: item.pageNumber, title: p.title, content: p.content, _id: p._id });
      byId.delete(item.id);
    }
  }
  // Append any remaining pages not specified, keeping their relative order
  for (const p of post.pages as any[]) {
    if (!p._id || !newPages.find((np) => String(np._id) === String(p._id))) {
      newPages.push({ pageNumber: newPages.length + 1, title: p.title, content: p.content, _id: p._id });
    }
  }
  // Renumber sequentially
  post.pages = newPages
    .sort((a, b) => Number(a.pageNumber) - Number(b.pageNumber))
    .map((p, i) => ({ pageNumber: i + 1, title: p.title, content: p.content })) as any;
  await post.save();
  revalidatePath(`/blog/${slug}`);
  try { revalidateTag(`post:${slug}`, "max"); } catch {}
  return { ok: true };
}

export async function insertPage(
  slug: string,
  newPage: { pageNumber: number; title: string; content: string }
) {
  await requireAdmin();
  await connectDB();
  const post = await Post.findOne({ slug });
  if (!post) throw new Error("Post not found");
  const pages = [...(post.pages as any[])].sort((a, b) => a.pageNumber - b.pageNumber);
  const insertAt = Math.max(1, Math.min(newPage.pageNumber, pages.length + 1));
  // shift subsequent pages
  const updated = [
    ...pages.filter((p) => p.pageNumber < insertAt),
    { pageNumber: insertAt, title: newPage.title, content: newPage.content },
    ...pages.filter((p) => p.pageNumber >= insertAt).map((p) => ({ ...p, pageNumber: p.pageNumber + 1 })),
  ].map((p, idx) => ({ pageNumber: idx + 1, title: p.title, content: p.content }));
  (post as any).pages = updated as any;
  await post.save();
  revalidatePath(`/blog/${slug}`);
  try { revalidateTag(`post:${slug}`, "max"); } catch {}
  return { ok: true };
}
