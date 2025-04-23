import { TRPCError } from "@trpc/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SECRET,
});

export const uploadProfileImage = async (file: string) => {
  return await cloudinary.uploader.upload(file, {
    folder: "profiles",
  });
};

export const uploadPostImage = async (file: string) => {
  return await cloudinary.uploader.upload(file, {
    folder: "posts",
  });
};

export const uploadArworkImagesGetUrls = async (files: string[]) => {
  try {
    const uploadPromises = files.map((file) =>
      cloudinary.uploader.upload(file, {
        folder: "posts",
      })
    );

    const uploadResults = await Promise.all(uploadPromises);

    return uploadResults.map((result) => result.secure_url);
  } catch (error) {
    console.error("Error uploading images:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to upload images",
    });
  }
};

export const extractPublicId = (secureUrl: string): string | null => {
  try {
    // Example input:
    // https://res.cloudinary.com/du9frz9rv/image/upload/v1745341315/profiles/i5r7jnbd0pooc8ne67tc.png

    const url = new URL(secureUrl);
    const parts = url.pathname.split("/"); // ['/', 'image', 'upload', 'v123456789', 'profiles', 'i5r7jnbd0pooc8ne67tc.png']
    const folder = parts[parts.length - 2]; // 'profiles'
    const filenameWithExt = parts[parts.length - 1]; // 'i5r7jnbd0pooc8ne67tc.png'

    const filename = filenameWithExt.replace(/\.[^/.]+$/, ""); // remove file extension
    return `${folder}/${filename}`; // 'profiles/i5r7jnbd0pooc8ne67tc'
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  }
};
