import mongoose, { Schema } from "mongoose";

export interface IPostPage {
  pageNumber: number;
  title: string;
  content: string;
}

export interface IPost {
  _id: string;
  id: string;
  slug: string;
  title: string;
  description?: string;
  pages: IPostPage[];
  author: string;
  image?: string;
  tags: string[];
  published: boolean;
  views: number;
  categories?: string[];
  section?: "content" | "categories" | "other";
  createdAt: string | null;
  updatedAt: string | null;
}

const postSchema = new Schema<IPost>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: null,
    },
    pages: {
      type: [
        {
          pageNumber: {
            type: Number,
            required: true,
          },
          title: {
            type: String,
            required: true,
          },
          content: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
    },
    author: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    categories: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Category",
        },
      ],
      default: [],
    },
    section: {
      type: String,
      enum: ["content", "categories", "other"],
      default: "content",
      index: true,
    },
    published: {
      type: Boolean,
      default: false,
      index: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

// Create compound index for published and createdAt
postSchema.index({ published: 1, createdAt: -1 });

// Add virtual id field that maps to _id
postSchema.virtual("id").get(function (this: any) {
  return this._id?.toString();
});

// Ensure virtuals are included when converting to JSON
postSchema.set("toObject", { virtuals: true });
postSchema.set("toJSON", { virtuals: true });

// Pre-save hook to ensure pages array is valid
postSchema.pre("save", function (next) {
  // Ensure pages is an array
  if (!this.pages) {
    this.pages = [];
  }
  // Remove any old content field if it exists
  if ((this as any).content !== undefined) {
    delete (this as any).content;
  }
  next();
});

export const Post =
  mongoose.models.Post || mongoose.model<IPost>("Post", postSchema);
