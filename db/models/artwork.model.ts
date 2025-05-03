import mongoose, { Schema, model, models } from "mongoose";

const ArtWorkSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image_urls: [{ type: String, required: true }],
    tags: [{ type: String }],
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ArtWork = models.ArtWork || model("ArtWork", ArtWorkSchema);
