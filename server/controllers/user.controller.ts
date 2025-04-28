import { ArtWork } from "@/lib/db/models/artwork.model";
import { User } from "@/lib/db/models/user.model";
import { generateToken } from "@/lib/helpers/jwt";
import { comparePassword, hashPassword } from "@/lib/helpers/password";
import { TRPCError } from "@trpc/server";
import { cookies } from "next/headers";

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
  console.log("logging out...");
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
