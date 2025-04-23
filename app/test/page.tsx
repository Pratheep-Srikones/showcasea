// components/UserInfo.tsx
"use client";

import { trpc } from "@/lib/trpc/client";
import { useEffect, useState } from "react";

const UserInfo = () => {
  const { data: user, isLoading, error } = trpc.user.getMe.useQuery();
  const upload = trpc.image.uploadProfileImage.useMutation();
  const [pic, setPic] = useState<File | null>(null);
  useEffect(() => {
    if (error) {
      console.error("Auth error:", error.message);
    }
  }, [error]);

  if (isLoading) return <p>Loading...</p>;

  if (!user) return <p>You are not logged in</p>;

  const handleUpload = async () => {
    if (!pic) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      upload.mutate(base64String, {
        onSuccess: (url) => {
          console.log("Image uploaded:", url);
          // Optionally update user state or show success toast
        },
        onError: (err) => {
          console.error("Upload failed", err);
        },
      });
    };
    reader.readAsDataURL(pic); // Read image as base64 string
  };

  return (
    <div>
      <h1>
        Welcome, {user.first_name} {user.last_name}
      </h1>
      <p>Email: {user.email}</p>
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setPic(e.target.files[0]);
            } else {
              setPic(null);
            }
          }}
        />
        <button onClick={() => handleUpload()}>Upload</button>
      </div>
    </div>
  );
};

export default UserInfo;
