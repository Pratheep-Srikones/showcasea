import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, unique: true },
    email: { type: String, unique: true },

    bio: { type: String },
    profile_picture_url: { type: String },
    social_media: {
      website: { type: String },
      twitter: { type: String },
      instagram: { type: String },
    },
    privacy: {
      profile_visibility: { type: Boolean, default: true },
      search_visibility: { type: Boolean, default: true },
      comments: { type: Boolean, default: true },
      data_collection: { type: Boolean, default: true },
    },
    notifications: {
      comments: { type: Boolean, default: true },
      likes: { type: Boolean, default: true },
      follows: { type: Boolean, default: true },
      messages: { type: Boolean, default: true },
      marketing: { type: Boolean, default: true },
    },
    followerCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    totalLikes: { type: Number, default: 0 },
  },
  { timestamps: true }
);
export const User = models.User || model("User", UserSchema);
