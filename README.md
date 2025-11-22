This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

# Blog Backend (MongoDB + Server Actions)

This project includes a full blog backend built with:

- Next.js App Router with Server Actions for write operations
- MongoDB via Mongoose
- Admin authentication (JWT cookie) with role-based authorization
- Server-side Markdown → sanitized HTML rendering
- Categories as a tree, multi-page blog content, sections, search/sort/pagination

## Setup

1) Install deps

```bash
npm install
```

2) Create .env.local

```
MONGODB_URI="<your-mongodb-connection-string>"
JWT_SECRET="<a-long-random-secret>"

# Optional seed admin creds (used only by the seed script)
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=admin123
```

3) Seed database (admin user, example categories, and a sample 3-page blog)

```bash
npm run seed
```

4) Start dev server

```bash
npm run dev
```

## Models

- Blog (Post): slug, title, description, pages[{ pageNumber, title, content }], author, image, tags[], published, views, categories[ObjectId], section ("content" | "categories" | "other")
- Category: name, slug, parent ref, children refs[], optional metadata, timestamps
- User: email, passwordHash, role ("admin" | "user")

Notes:

- Blog pages store Markdown in pages[].content
- Slugs normalized to lowercase and unique
- strict: false to allow flexible fields
- Category statics include createCategory and getTree

## Admin Auth

- Login page: /login (sets JWT cookie on success)
- Admin area: /admin (hidden from Navbar, protected server-side)
- All admin APIs and server actions call requireAdmin()

## Server Actions (key)

- Blogs: createPost, updatePost, deletePost, getPostBySlug, getPosts, getRenderedPage, reorderPages, insertPage
- Categories: createCategory, updateCategory, deleteCategory, getCategoryTreeWithCounts, listCategories
- Auth: signIn, signOut, currentUser

## REST API (mirrors server actions)

- GET /api/blog — query blogs by q, tag, categoryId, author, published, section, sort, page, take
- GET /api/blog/[slug]/page?page=1 — returns blog metadata + sanitized HTML for the requested page with next/prev/jumpTo info
- POST /api/views — rate-limited view counter (6-hour IP bucket)
- Admin (JWT cookie required):
  - GET/POST /api/admin/posts
  - PATCH/DELETE /api/admin/posts/[slug]
  - PATCH /api/admin/posts/[slug]/reorder-pages
  - POST /api/admin/posts/[slug]/insert-page
  - GET/POST /api/admin/categories
  - PATCH/DELETE /api/admin/categories/[id]
- Public categories:
  - GET /api/categories/tree
  - GET /api/categories/[slug]/blogs

Example HTTP requests are in docs/api-examples.http

## Markdown Rendering & Security

- Markdown is rendered server-side using unified/remark/rehype
- Output sanitized via rehype-sanitize (allowlist)
- Supports GFM (tables, task lists), code blocks, images, links

## Sections & UI

- Blogs can be flagged with section: "content" | "categories" | "other"
- Admin form includes section and autoPlaceInSection (routes to categories when true)
- Public reading route: /blog/[slug]
  - Next/Previous navigation and JumpTo (page numbers)
  - Per-page sanitized HTML is fetched via server action
- Category browsing: /categories/[slug]

## Search, Sorting, Pagination

- Server-side search across title/description/pages/tags
- Sort by createdAt/updatedAt/views/title
- Pagination via take + page

## Image Handling

- Backend accepts image URLs; prefer trusted/CDN sources
- If adding upload, integrate with a trusted service and sanitize

## Hiding /admin Link

- Navbar has no /admin entry by design
- Route /admin remains accessible and protected by admin auth

## Sample Create Payload (accepted)

```json
{
  "slug": "my-first-deep-dive",
  "title": "My First Deep Dive",
  "description": "An in-depth multi-page article about X",
  "author": "Vishnu",
  "image": "https://cdn.example.com/images/cover.jpg",
  "tags": ["rust", "backend"],
  "published": true,
  "categories": ["<categoryId1>", "<categoryId2>"],
  "section": "categories",
  "pages": [
    { "pageNumber": 1, "title": "Introduction", "content": "# Intro\n\nThis is the intro in markdown" },
    { "pageNumber": 2, "title": "Deep details", "content": "## Details\n\nMore markdown content..." }
  ],
  "autoPlaceInSection": true
}
# PORTFOLIO-NEW
# PORTFOLIO-NEW
