"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useArtStore } from "@/store/useArtStore";
import { ArtworkType, UserType } from "@/types/types";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc/client";

export default function ForYouPage() {
  const { user } = useAuthStore();
  const { setSelectedArtWork } = useArtStore();
  const router = useRouter();

  const [artWorks, setArtWorks] = useState<ArtworkType[]>([]);
  const [start, setStart] = useState(0);
  const offset = 8;

  const [suggestedUsers, setSuggestedUsers] = useState<UserType[]>([]);

  const {
    data: artWorkData,
    isPending: artWorkPending,
    isFetching: artWorkFetching,
    refetch,
  } = trpc.artWork.getSuggestedArtworks.useQuery({
    start,
    offset,
  });

  const loadMore = () => {
    setStart((prev) => prev + offset);
  };
  const { data: userData, isPending: userPending } =
    trpc.follow.getSuggestions.useQuery();

  useEffect(() => {
    if (artWorkData && start === 0) {
      setArtWorks(artWorkData);
    } else if (artWorkData && start > 0) {
      setArtWorks((prev) => [...prev, ...artWorkData]);
    }
  }, [artWorkData, start]);

  useEffect(() => {
    if (userData) {
      setSuggestedUsers(userData);
    }
  }, [userData]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* Suggested Artworks Section */}
      <section className="border rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
          Suggested Artworks
        </h2>

        {artWorkPending && artWorks.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-muted rounded-2xl h-60 w-full"
              />
            ))}
          </div>
        ) : artWorks.length === 0 ? (
          <div className="text-muted-foreground text-center py-10">
            No artworks found.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {artWorks.map((artwork) => (
                <div
                  key={artwork._id}
                  className="bg-card rounded-2xl shadow-md overflow-hidden border"
                >
                  <div
                    onClick={() => {
                      setSelectedArtWork(artwork as ArtworkType);
                      router.push(`/artwork`);
                    }}
                    className="cursor-pointer"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <Image
                        src={artwork.image_urls[0]}
                        alt={artwork.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div
                      onClick={() => {
                        setSelectedArtWork(artwork as ArtworkType);
                        router.push(`/artwork`);
                      }}
                      className="font-medium hover:underline cursor-pointer"
                    >
                      {artwork.title}
                    </div>
                    <Link
                      href={`/profile/${artwork.artist._id}`}
                      className="flex items-center gap-2"
                    >
                      <Avatar className="h-6 w-6 border">
                        <AvatarImage
                          src={artwork.artist.profile_picture_url}
                          alt={artwork.artist.username}
                        />
                        <AvatarFallback>
                          {artwork.artist.username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        {artwork.artist.first_name} {artwork.artist.last_name}
                      </span>
                    </Link>
                    <div className="flex justify-between text-sm text-muted-foreground pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>{artwork.likeCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{artwork.commentCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{artwork.viewCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <button
                onClick={() => setStart((prev) => prev + offset)}
                disabled={artWorkFetching}
                className="px-4 py-2 border rounded-lg text-sm hover:bg-muted transition"
              >
                {artWorkFetching ? "Loading..." : "Load More"}
              </button>
            </div>
          </>
        )}
      </section>

      {/* Suggested Users Section */}
      <section className="border rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
          Suggested Users
        </h2>
        {userPending ? (
          <p className="text-muted-foreground text-sm">
            Loading suggestions...
          </p>
        ) : suggestedUsers.length === 0 ? (
          <p className="text-muted-foreground text-sm">No suggestions yet.</p>
        ) : (
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-4 px-1 sm:gap-6 sm:px-2 w-max snap-x">
              {suggestedUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex flex-col items-center p-4 bg-card rounded-2xl shadow-sm border min-w-[140px] snap-start cursor-pointer hover:shadow-md transition"
                  onClick={() => router.push(`/profile/${user._id}`)}
                >
                  <Avatar className="border w-16 h-16 mb-3">
                    <AvatarImage
                      src={user.profile_picture_url}
                      alt={user.username}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-lg">
                      {user.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm text-center hover:underline truncate w-full">
                    {user.username}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
