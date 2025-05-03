import { Comment } from "@/db/models/comment.model";
import mongoose from "mongoose";
import { TRPCError } from "@trpc/server";

import { ArtWork } from "@/db/models/artwork.model";

export const AddComment = async (
  user_id: string,
  artWork_id: string,
  content: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const newComment = await Comment.create(
      [{ userId: user_id, artWorkId: artWork_id, content }],
      { session }
    );
    await ArtWork.findByIdAndUpdate(
      artWork_id,
      { $inc: { commentCount: 1 } },
      { session }
    );
    await session.commitTransaction();
    await newComment[0].populate("userId", {
      username: 1,
      profile_picture_url: 1,
    });
    //console.log("New comment added:", newComment[0]);
    return {
      message: "Comment added successfully",
      comment: newComment[0],
    };
  } catch (error) {
    await session.abortTransaction();
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to add comment",
    });
  } finally {
    session.endSession();
  }
};

export const getComments = async (artWork_id: string) => {
  try {
    const comments = await Comment.find({ artWorkId: artWork_id })
      .populate("userId", {
        username: 1,
        profile_picture_url: 1,
      })
      .select({ content: 1, createdAt: 1, updatedAt: 1 })

      .sort({ createdAt: -1 });
    return comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch comments",
    });
  }
};

export const deleteComment = async (comment_id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const comment = await Comment.findByIdAndDelete(comment_id, { session });
    if (!comment) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Comment not found",
      });
    }
    await ArtWork.findByIdAndUpdate(
      comment.artWorkId,
      { $inc: { commentCount: -1 } },
      { session }
    );
    await session.commitTransaction();
    return {
      message: "Comment deleted successfully",
    };
  } catch (error) {
    await session.abortTransaction();
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to delete comment",
    });
  } finally {
    session.endSession();
  }
};
