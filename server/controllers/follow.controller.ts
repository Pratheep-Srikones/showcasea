import { Follow } from "@/db/models/follow.model";
import { User } from "@/db/models/user.model";
import mongoose from "mongoose";
import { addNotification } from "./notification.controller";

export const addFollow = async (followerId: string, followingId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingFollow = await Follow.findOne({
      followerId,
      followingId,
    }).session(session);
    if (existingFollow) {
      return null; // Already following, no need to create a new follow
    }
    const newFollow = await Follow.create([{ followerId, followingId }], {
      session,
    });
    await User.findByIdAndUpdate(
      followingId,
      { $inc: { followerCount: 1 } },
      { session }
    );
    await User.findByIdAndUpdate(
      followerId,
      { $inc: { followingCount: 1 } },
      { session }
    );
    await session.commitTransaction();
    await addNotification(followerId, followingId, "follow", null, null);
    return {
      message: "Followed successfully",
      followId: newFollow[0]._id,
    };
  } catch (error) {
    await session.abortTransaction();
    throw new Error("Failed to follow user");
  } finally {
    session.endSession();
  }
};

export const removeFollow = async (followerId: string, followingId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingFollow = await Follow.findOne({
      followerId,
      followingId,
    }).session(session);
    if (!existingFollow) {
      return null; // Not following, no need to remove follow
    }
    await Follow.deleteOne({ _id: existingFollow._id }, { session });
    await User.findByIdAndUpdate(
      followingId,
      { $inc: { followerCount: -1 } },
      { session }
    );
    await User.findByIdAndUpdate(
      followerId,
      { $inc: { followingCount: -1 } },
      { session }
    );
    await session.commitTransaction();
    return {
      message: "Unfollowed successfully",
      followId: existingFollow._id,
    };
  } catch (error) {
    await session.abortTransaction();
    throw new Error("Failed to unfollow user");
  } finally {
    session.endSession();
  }
};

export const getFollowers = async (userId: string) => {
  try {
    const followers = await Follow.find({ followingId: userId })
      .populate("followerId", "username profile_picture_url")
      .exec();
    return followers;
  } catch (error) {
    throw new Error("Failed to fetch followers");
  }
};

export const getFollowing = async (userId: string) => {
  try {
    const following = await Follow.find({ followerId: userId })
      .populate("followingId", "username profile_picture_url")
      .exec();
    return following;
  } catch (error) {
    throw new Error("Failed to fetch following");
  }
};

export const isFollowing = async (followerId: string, followingId: string) => {
  try {
    const follow = await Follow.findOne({
      followerId,
      followingId,
    }).exec();
    return follow !== null;
  } catch (error) {
    throw new Error("Failed to check if following");
  }
};

export const getSuggestedUsers = async (currentUserId: string) => {
  const suggestions = await Follow.aggregate([
    // Step 1: Get users the current user is following
    { $match: { followerId: currentUserId } },

    // Step 2: Get who these followed users are following
    {
      $lookup: {
        from: "follows",
        localField: "followingId",
        foreignField: "followerId",
        as: "secondDegreeFollows",
      },
    },
    { $unwind: "$secondDegreeFollows" },

    // Step 3: Group by suggested userId and count
    {
      $group: {
        _id: "$secondDegreeFollows.followingId",
        count: { $sum: 1 },
      },
    },

    // Step 4: Filter out current user themself
    {
      $match: {
        _id: { $ne: currentUserId },
      },
    },

    // Step 5: Remove users already followed
    {
      $lookup: {
        from: "follows",
        let: { suggestedUserId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$followerId", currentUserId] },
                  { $eq: ["$followingId", "$$suggestedUserId"] },
                ],
              },
            },
          },
        ],
        as: "alreadyFollowed",
      },
    },
    {
      $match: {
        alreadyFollowed: { $eq: [] },
      },
    },

    // Step 6: Fetch user details
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },

    // Step 7: Project only needed fields
    {
      $project: {
        _id: "$user._id",
        username: "$user.username",
        profile_picture_url: "$user.profile_picture_url",
      },
    },

    // Optional: limit number of suggestions
    { $limit: 10 },
  ]);

  return suggestions;
};
