// components/UserInfo.tsx
"use client";

import { trpc } from "@/lib/trpc/client";
import { useEffect } from "react";

const UserInfo = () => {
  const { data: user, isLoading, error } = trpc.user.getMe.useQuery();

  useEffect(() => {
    if (error) {
      console.error("Auth error:", error.message);
    }
  }, [error]);

  if (isLoading) return <p>Loading...</p>;

  if (!user) return <p>You are not logged in</p>;

  return (
    <div>
      <h1>
        Welcome, {user.first_name} {user.last_name}
      </h1>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default UserInfo;
