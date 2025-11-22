import mongoose, { Schema, Types } from "mongoose";

export interface ICategory {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  parent: Types.ObjectId | null;
  children: Types.ObjectId[];
  metadata?: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
}

function slugify(input: string) {
  return input
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    children: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    metadata: { type: Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

categorySchema.pre("validate", function (next) {
  if (this.isModified("name") && (!this.slug || this.isModified("slug"))) {
    this.slug = slugify(this.slug || this.name);
  }
  next();
});

categorySchema.statics.createCategory = async function ({
  name,
  slug,
  parentId,
  metadata,
}: {
  name: string;
  slug?: string;
  parentId?: string | null;
  metadata?: Record<string, any> | null;
}) {
  const computedSlug = slug ? slugify(slug) : slugify(name);
  const category = await this.create({
    name,
    slug: computedSlug,
    parent: parentId ? new Types.ObjectId(parentId) : null,
    metadata: metadata ?? null,
  });

  if (parentId) {
    await this.findByIdAndUpdate(parentId, { $addToSet: { children: category._id } });
  }

  return category as ICategory;
};

categorySchema.statics.getTree = async function () {
  const categories: ICategory[] = await this.find().lean();
  const map = new Map<string, any>();
  categories.forEach((c: any) => {
    map.set(String(c._id), { ...c, children: [] });
  });
  const roots: any[] = [];
  categories.forEach((c: any) => {
    if (c.parent) {
      const parent = map.get(String(c.parent));
      if (parent) parent.children.push(map.get(String(c._id)));
    } else {
      roots.push(map.get(String(c._id)));
    }
  });
  return roots;
};

export interface ICategoryModel extends mongoose.Model<ICategory> {
  createCategory(args: {
    name: string;
    slug?: string;
    parentId?: string | null;
    metadata?: Record<string, any> | null;
  }): Promise<ICategory>;
  getTree(): Promise<ICategory[]>;
}

export const Category =
  (mongoose.models.Category as ICategoryModel) ||
  (mongoose.model<ICategory, ICategoryModel>("Category", categorySchema) as ICategoryModel);
