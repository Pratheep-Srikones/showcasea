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
    user: {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      username: user.username,
    },
  };
};
