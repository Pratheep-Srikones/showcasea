import { User } from "@/lib/db/models/user.model";
import { hashPassword } from "@/lib/helpers/password";
import { TRPCError } from "@trpc/server";

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
