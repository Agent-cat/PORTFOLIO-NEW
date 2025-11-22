// "use server";

// import { connectDB } from "@/lib/mongoose";
// import { Category, type ICategory } from "@/lib/models/Category";
// import { Post } from "@/lib/models/Post";
// import { requireAdmin } from "@/lib/auth";

// export type CreateCategoryInput = {
//   name: string;
//   slug?: string;
//   parentId?: string | null;
//   metadata?: Record<string, any> | null;
// };

// export async function createCategory(input: CreateCategoryInput) {
//   await requireAdmin();
//   await connectDB();
//   const cat = await (Category as any).createCategory(input);
//   return { id: String((cat as any)._id), slug: (cat as any).slug };
// }

// export async function updateCategory(
//   id: string,
//   updates: Partial<CreateCategoryInput>
// ) {
//   await requireAdmin();
//   await connectDB();
//   if (updates.parentId === undefined) {
//     // noop
//   }
//   const doc = await Category.findById(id);
//   if (!doc) throw new Error("Category not found");

//   if (updates.name !== undefined) doc.name = updates.name;
//   if (updates.slug !== undefined && updates.slug) doc.slug = updates.slug;
//   if (updates.metadata !== undefined) (doc as any).metadata = updates.metadata;

//   const prevParent = doc.parent ? String(doc.parent) : null;
//   const nextParent =
//     updates.parentId === undefined ? prevParent : updates.parentId || null;

//   if (nextParent !== prevParent) {
//     if (prevParent) {
//       await Category.findByIdAndUpdate(prevParent, {
//         $pull: { children: doc._id },
//       });
//     }
//     doc.parent = nextParent
//       ? (doc as any).constructor.Types.ObjectId(nextParent)
//       : null;
//     if (nextParent) {
//       await Category.findByIdAndUpdate(nextParent, {
//         $addToSet: { children: doc._id },
//       });
//     }
//   }

//   await doc.save();
//   return { ok: true };
// }

// export async function deleteCategory(id: string) {
//   await requireAdmin();
//   await connectDB();
//   const doc = await Category.findById(id);
//   if (!doc) return { ok: true };
//   if (doc.parent) {
//     await Category.findByIdAndUpdate(doc.parent, {
//       $pull: { children: doc._id },
//     });
//   }
//   await Post.updateMany(
//     { categories: doc._id },
//     { $pull: { categories: doc._id } }
//   );
//   await Category.deleteOne({ _id: doc._id });
//   return { ok: true };
// }

// export type CategoryNode = ICategory & {
//   blogCount?: number;
//   children: CategoryNode[];
// };

// export async function getCategoryTreeWithCounts(): Promise<CategoryNode[]> {
//   await connectDB();
//   const cats = await Category.find().lean();
//   const ids = cats.map((c) => c._id);
//   const counts = await Post.aggregate([
//     { $unwind: { path: "$categories", preserveNullAndEmptyArrays: false } },
//     { $match: { categories: { $in: ids } } },
//     { $group: { _id: "$categories", count: { $sum: 1 } } },
//   ]);
//   const countMap = new Map<string, number>();
//   counts.forEach((c: any) => countMap.set(String(c._id), c.count));

//   const map = new Map<string, any>();
//   cats.forEach((c: any) => {
//     map.set(String(c._id), {
//       ...c,
//       blogCount: countMap.get(String(c._id)) || 0,
//       children: [],
//     });
//   });
//   const roots: any[] = [];
//   cats.forEach((c: any) => {
//     if (c.parent) {
//       const parent = map.get(String(c.parent));
//       if (parent) parent.children.push(map.get(String(c._id)));
//     } else {
//       roots.push(map.get(String(c._id)));
//     }
//   });
//   return roots as any;
// }

// export async function listCategories() {
//   await connectDB();
//   const cats = await Category.find().sort({ name: 1 }).lean();
//   return cats.map((c: any) => ({
//     id: String(c._id),
//     name: c.name,
//     slug: c.slug,
//     parent: c.parent ? String(c.parent) : null,
//   }));
// }

// export async function getCategoryBySlug(slug: string) {
//   await connectDB();
//   const doc = await Category.findOne({
//     slug: slug.toLowerCase().trim(),
//   }).lean();
//   if (!doc) return null;
//   return {
//     id: String((doc as any)._id),
//     name: (doc as any).name,
//     slug: (doc as any).slug,
//   };
// }
