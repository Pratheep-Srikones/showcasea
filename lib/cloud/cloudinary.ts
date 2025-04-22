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
