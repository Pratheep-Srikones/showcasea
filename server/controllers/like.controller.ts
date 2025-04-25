import { ArtWork } from "@/lib/db/models/artwork.model";
import { Like } from "@/lib/db/models/like.model";
import { User } from "@/lib/db/models/user.model";
import { TRPCError } from "@trpc/server";
import mongoose from "mongoose";

export const likeArtWork = async (
  liker_id: string,
  artWork_id: string,
  artist_id: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingLike = await Like.findOne({
      userId: liker_id,
      postId: artWork_id,
    }).session(session);
    if (existingLike) {
      return null; // Already liked, no need to create a new like
    }
    const newLike = await Like.create(
      [{ userId: liker_id, postId: artWork_id }],
      {
        session,
      }
    );
    await ArtWork.findByIdAndUpdate(
      artWork_id,
      { $inc: { likeCount: 1 } },
      { session }
    );
    await User.findByIdAndUpdate(
      artist_id,
      { $inc: { totalLikes: 1 } },
      { session }
    );
    await session.commitTransaction();
    return {
      message: "Artwork liked successfully",
      likeId: newLike[0]._id,
    };
  } catch (error) {
    await session.abortTransaction();
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to like artwork",
    });
  } finally {
    session.endSession();
  }
};
export const unlikeArtWork = async (
  liker_id: string,
  artWork_id: string,
  artist_id: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingLike = await Like.findOne({
      userId: liker_id,
      postId: artWork_id,
    }).session(session);
    if (!existingLike) {
      return null; // Not liked yet, no need to remove a like
    }
    await Like.deleteOne({ _id: existingLike._id }, { session });
    await ArtWork.findByIdAndUpdate(
      artWork_id,
      { $inc: { likeCount: -1 } },
      { session }
    );
    await User.findByIdAndUpdate(
      artist_id,
      { $inc: { totalLikes: -1 } },
      { session }
    );
    await session.commitTransaction();
    return {
      message: "Artwork unliked successfully",
      likeId: existingLike._id,
    };
  } catch (error) {
    await session.abortTransaction();
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to unlike artwork",
    });
  } finally {
    session.endSession();
  }
};

export const hasLiked = async (liker_id: string, artWork_id: string) => {
  const existingLike = await Like.findOne({
    userId: liker_id,
    postId: artWork_id,
  });
  return existingLike !== null; // Return true if the like exists, false otherwise
};
