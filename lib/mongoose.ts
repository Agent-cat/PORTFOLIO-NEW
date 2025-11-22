import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

// Ensure migrations run only once per process
let ranPostsMigration: boolean = (global as any)._ranPostsMigration || false;

async function runPostsMigrations(db: any) {
  if (!db) return;
  try {
    // Check if collection exists
    const collections = await db.listCollections().toArray();
    const postsCollectionExists = collections.some((c: any) => c.name === "posts");

    if (postsCollectionExists) {
      // Convert legacy `content` to `pages[0]` when pages are missing or empty, then unset content
      await db.collection("posts").updateMany(
        { content: { $exists: true } },
        [
          {
            $set: {
              pages: {
                $cond: [
                  { $eq: [ { $size: { $ifNull: ["$pages", []] } }, 0 ] },
                  [ { pageNumber: 1, title: "$title", content: "$content" } ],
                  "$pages"
                ]
              }
            }
          },
          { $unset: "content" }
        ]
      );
    }
  } catch (e) {
    console.log("Migration completed or skipped");
  }
}

export async function connectDB() {
  if (cached.conn) {
    // Run migrations if not already executed
    if (!ranPostsMigration) {
      await runPostsMigrations(cached.conn.connection.db);
      ranPostsMigration = true;
      (global as any)._ranPostsMigration = true;
    }
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then((mongoose) => {
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
    // Run migrations once after establishing connection
    if (!ranPostsMigration) {
      await runPostsMigrations(cached.conn.connection.db);
      ranPostsMigration = true;
      (global as any)._ranPostsMigration = true;
    }
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
