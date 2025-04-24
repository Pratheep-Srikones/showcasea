"use client";

import { trpc } from "@/lib/trpc/client";
import { ArtworkType } from "@/types/types";
import { useEffect, useState } from "react";

const UserInfo = () => {
  const { data: user, isPending, error } = trpc.user.getMe.useQuery();
  const { data: artWorks, isPending: isGettingArt } =
    trpc.artWork.getArtWorksByArtistId.useQuery(user?._id || "");

  const upload = trpc.image.uploadProfileImage.useMutation();
  const [pic, setPic] = useState<File | null>(null);

  useEffect(() => {
    if (error) {
      console.error("Auth error:", error.message);
    }
  }, [error]);

  const handleUpload = () => {
    if (!pic) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      upload.mutate(base64String, {
        onSuccess: (url) => {
          console.log("Image uploaded:", url);
        },
        onError: (err) => {
          console.error("Upload failed", err);
        },
      });
    };
    reader.readAsDataURL(pic);
  };

  if (isPending) return <p>Loading...</p>;
  if (!user) return <p>You are not logged in</p>;

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
          onChange={(e) => setPic(e.target.files?.[0] ?? null)}
        />
        <button onClick={handleUpload}>Upload</button>

        {artWorks && artWorks?.length > 0 && (
          <div>
            {artWorks?.map((artWork) => (
              <div key={artWork._id}>
                <h2>{artWork.title}</h2>
                <p>{artWork.description}</p>
                <img
                  src={artWork.image_urls[0]}
                  alt={artWork.title}
                  style={{ width: "200px" }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
