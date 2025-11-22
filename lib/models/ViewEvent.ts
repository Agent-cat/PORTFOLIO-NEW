import mongoose, { Schema } from "mongoose";

export interface IViewEvent {
  _id: string;
  slug: string;
  ipHash: string;
  createdAt: Date;
}

const viewEventSchema = new Schema<IViewEvent>(
  {
    slug: { type: String, required: true, index: true },
    ipHash: { type: String, required: true, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

viewEventSchema.index({ slug: 1, ipHash: 1, createdAt: -1 });

export const ViewEvent = mongoose.models.ViewEvent || mongoose.model<IViewEvent>("ViewEvent", viewEventSchema);
