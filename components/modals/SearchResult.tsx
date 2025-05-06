"use client";

import Image from "next/image";
import Link from "next/link";
import { ArtworkType, UserType } from "@/types/types";
import { X, Heart, MessageCircle, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc/client";

const SearchResult = ({
  searchTerm,
  onClose,
}: {
  searchTerm: string;
  onClose: () => void;
}) => {
  const [artworkData, setArtworkData] = useState<ArtworkType[]>([]);
  const [userData, setUserData] = useState<UserType[]>([]);

  const { data: artWorkResults, isPending: artworkPending } =
    trpc.artWork.getArtworksByTitle.useQuery(searchTerm);
  const { data: userResults, isPending: userPending } =
    trpc.user.getByName.useQuery({ name: searchTerm });

  const isLoading = artworkPending || userPending;

  useEffect(() => {
    if (artWorkResults) {
      setArtworkData(artWorkResults);
    }
  }, [artWorkResults]);

  useEffect(() => {
    if (userResults) {
      setUserData(userResults);
    }
  }, [userResults]);
  return (
    <div className="relative w-full max-h-[80vh] overflow-y-auto space-y-8 p-4 bg-background rounded-lg border shadow-lg">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Users Section */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Users</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-lg border"
              >
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : userData.length === 0 ? (
          <p className="text-sm text-muted-foreground">No users found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userData.map((user) => (
              <Link
                href={`/profile/${user._id}`}
                key={user._id}
                className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted transition"
              >
                <Image
                  src={user.profile_picture_url || "/default-avatar.jpg"}
                  alt={user.username || "User Avatar"}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-sm text-muted-foreground truncate max-w-xs">
                    {user.bio || "No bio available."}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {user.followerCount ?? 0} followers
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Artworks Section */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Artworks</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="border rounded-lg overflow-hidden bg-card"
              >
                <Skeleton className="aspect-video w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-64" />
                  <Skeleton className="h-3 w-24" />
                  <div className="flex gap-4 mt-2">
                    <Skeleton className="h-3 w-6" />
                    <Skeleton className="h-3 w-6" />
                    <Skeleton className="h-3 w-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : artworkData.length === 0 ? (
          <p className="text-sm text-muted-foreground">No artworks found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {artworkData.map((artwork) => (
              <Link
                href={`/artwork/${artwork._id}`}
                key={artwork._id}
                className="group block border rounded-lg overflow-hidden hover:shadow transition bg-card"
              >
                <div className="aspect-video relative">
                  <Image
                    src={artwork.image_urls[0] || "/fallback-art.jpg"}
                    alt={artwork.title}
                    fill
                    className="object-cover transition group-hover:scale-105"
                  />
                </div>
                <div className="p-4 space-y-1">
                  <h3 className="font-semibold">{artwork.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {artwork.description}
                  </p>
                  <div className="text-xs text-muted-foreground mt-1">
                    By{" "}
                    <span className="font-medium">
                      {artwork.artist.username}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground flex gap-4 mt-2 items-center">
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" /> {artwork.likeCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />{" "}
                      {artwork.commentCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" /> {artwork.viewCount}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResult;
