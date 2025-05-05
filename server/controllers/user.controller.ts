import { ArtWork } from "@/db/models/artwork.model";
import { User } from "@/db/models/user.model";
import { generateToken } from "@/lib/utils/jwt";
import { comparePassword, hashPassword } from "@/lib/utils/password";
import { TRPCError } from "@trpc/server";
import { cookies } from "next/headers";
import { uploadProfileImage } from "@/lib/cloud/cloudinary";

export const signupUser = async ({
  first_name,
  last_name,
  email,
  username,
  password,
}: {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
}) => {
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "Email or username already in use",
    });
  }
  password = await hashPassword(password);
  const newUser = await User.create({
    first_name,
    last_name,
    email,
    username,
    password,
  });

  return {
    message: "User created successfully",
    userId: newUser._id,
  };
};

export const loginUser = async ({
  email,
  password,
  rememberMe,
}: {
  email: string;
  password: string;
  rememberMe: boolean;
}) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid email or password",
    });
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid email or password",
    });
  }

  const token = generateToken({ id: user._id, email: user.email });
  (await cookies()).set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",

    maxAge: rememberMe ? 60 * 60 * 24 * 30 : undefined,
  });
  user.password = ""; // Remove password from user object
  return {
    message: "Login successful",
    user: user,
  };
};
export const logoutUser = async () => {
  (await cookies()).set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return {
    message: "Logout successful",
  };
};
export const getUserById = async (id: string) => {
  if (!id) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "User ID is required",
    });
  }
  const user = await User.findById(id).select("-password"); // Exclude password from the result
  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }

  return user;
};

export const getUsernameById = async (id: string) => {
  if (!id) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "User ID is required",
    });
  }
  const user = await User.findById(id).select("username"); // Exclude password from the result
  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }

  return user.username;
};

export const getTotalCountsForUser = async (userId: string) => {
  if (!userId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "User ID is required",
    });
  }

  let counts = { totalLikes: 0, totalComments: 0, totalViews: 0 };

  try {
    const result = await ArtWork.aggregate([
      { $match: { artist: userId } },
      {
        $group: {
          _id: null,
          totalLikes: { $sum: { $ifNull: ["$likeCount", 0] } },
          totalComments: { $sum: { $ifNull: ["$commentCount", 0] } },
          totalViews: { $sum: { $ifNull: ["$viewCount", 0] } },
        },
      },
    ]);

    counts = {
      totalLikes: result[0]?.totalLikes || 0,
      totalComments: result[0]?.totalComments || 0,
      totalViews: result[0]?.totalViews || 0,
    };
  } catch (error) {
    console.error("Error fetching user counts:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error fetching user counts",
    });
  }

  return counts;
};

export const updateUserPicture = async (userId: string, imageStr: string) => {
  if (!userId || !imageStr) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "User ID and image string are required",
    });
  }

  const upload_url = await uploadProfileImage(imageStr, userId);
  if (!upload_url) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to upload image",
    });
  }

  imageStr = upload_url; // Use the uploaded URL for the image
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { profile_picture_url: imageStr },
    { new: true }
  ).select("-password"); // Exclude password from the result

  if (!updatedUser) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }

  return updatedUser;
};

export const updateUserDetails = async (
  user_id: string,
  first_name: string,
  last_name: string,
  bio: string
) => {
  if (!user_id) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "User ID is required",
    });
  }

  const updatedUser = await User.findByIdAndUpdate(
    user_id,
    { first_name, last_name, bio },
    { new: true }
  ).select("-password"); // Exclude password from the result

  if (!updatedUser) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }

  return updatedUser;
};

export const updateUserSocialMedia = async (
  user_id: string,
  website: string,
  twitter: string,
  instagram: string
) => {
  if (!user_id) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "User ID is required",
    });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      { social_media: { website, twitter, instagram } },
      { new: true }
    ).select("-password"); // Exclude password from the result

    if (!updatedUser) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return updatedUser;
  } catch (error) {
    console.error("Error updating user social media:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to update user social media",
    });
  }
};

export const updatePassword = async (
  user_id: string,
  old_password: string,
  new_password: string
) => {
  if (!user_id) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "User ID is required",
    });
  }
  const user = await User.findById(user_id);
  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }
  const isPasswordValid = await comparePassword(old_password, user.password);

  if (!isPasswordValid) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid password",
    });
  }
  const hashedPassword = await hashPassword(new_password);
  const updatedUser = await User.findByIdAndUpdate(
    user_id,
    { password: hashedPassword },
    { new: true }
  ).select("-password"); // Exclude password from the result
  if (!updatedUser) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }
  return { message: "Password updated successfully" };
};

export const updateNotifications = async (
  user_id: string,
  comments: boolean,
  likes: boolean,
  follows: boolean,
  messages: boolean,
  marketing: boolean
) => {
  if (!user_id) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "User ID is required",
    });
  }

  const updatedUser = await User.findByIdAndUpdate(
    user_id,
    {
      notifications: { comments, likes, follows, messages, marketing },
    },
    { new: true }
  ).select("-password"); // Exclude password from the result

  if (!updatedUser) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }

  return updatedUser;
};

export const updatePrivacy = async (
  user_id: string,
  profile_visibility: boolean,
  search_visibility: boolean,
  comments: boolean,
  data_collection: boolean
) => {
  if (!user_id) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "User ID is required",
    });
  }

  const updatedUser = await User.findByIdAndUpdate(
    user_id,
    {
      privacy: {
        profile_visibility,
        search_visibility,
        comments,
        data_collection,
      },
    },
    { new: true }
  ).select("-password"); // Exclude password from the result

  if (!updatedUser) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }

  return updatedUser;
};
