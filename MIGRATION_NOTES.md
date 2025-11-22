# Migration: Prisma PostgreSQL → MongoDB with Mongoose

## Changes Made

### Dependencies
- **Removed**: `@prisma/client`, `prisma`
- **Added**: `mongoose` (^8.0.0)

### Files Created
- `/lib/mongoose.ts` - MongoDB connection handler with singleton pattern
- `/lib/models/Post.ts` - Mongoose Post schema and model
- `.env.local.example` - Environment variable template

### Files Modified
- `package.json` - Updated dependencies
- `actions/posts.ts` - Replaced Prisma queries with Mongoose operations
- `app/api/admin/posts/route.ts` - Updated API route to use Mongoose
- `components/blog/ArticleCard.tsx` - Updated type imports
- `app/blog/page.tsx` - Updated type imports
- `app/admin/page.tsx` - Updated type imports
- `components/admin/PostForm.tsx` - Updated type imports

### Removed Files (can be deleted)
- `prisma/schema.prisma`
- `prisma/prisma.config.ts`
- `lib/prisma.ts`
- `app/generated/prisma/` directory

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up MongoDB**:
   - Create a MongoDB Atlas account: https://www.mongodb.com/cloud/atlas
   - Create a cluster and database
   - Get your connection string

3. **Configure environment**:
   - Copy `.env.local.example` to `.env.local`
   - Add your MongoDB connection string to `MONGODB_URI`

4. **Run the application**:
   ```bash
   npm run dev
   ```

## Key Differences

### Query Syntax
- **Prisma**: `prisma.post.findMany({ where: {...} })`
- **Mongoose**: `Post.find({...})`

### Operators
- **Prisma**: `{ contains: "text", mode: "insensitive" }`
- **Mongoose**: `{ $regex: "text", $options: "i" }`

### Increment Operations
- **Prisma**: `{ views: { increment: 1 } }`
- **Mongoose**: `{ $inc: { views: 1 } }`

### Data Serialization
- Mongoose documents use `.lean()` for plain objects
- Use `.toObject()` when returning from server actions

## Features Preserved
✅ Create, Read, Update, Delete (CRUD) operations
✅ Search functionality (title, description, tags)
✅ Tag filtering
✅ Published/Draft status
✅ View counter
✅ Timestamps (createdAt, updatedAt)
✅ Server actions for all mutations
✅ Next.js caching and revalidation
