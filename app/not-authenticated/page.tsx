"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

export default function NotAuthenticatedPage() {
  const router = useRouter();

  const { isAuthenticated } = useAuthStore();

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <Lock className="w-16 h-16 text-muted-foreground mb-4" />
      <h1 className="text-4xl font-bold mb-2">Authentication Required</h1>
      <p className="text-muted-foreground mb-6">
        You need to be logged in to access this page.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => router.push("/auth")}>Login</Button>
        <Link href="/">
          <Button variant="outline">Go Home</Button>
        </Link>
      </div>
    </div>
  );
}
