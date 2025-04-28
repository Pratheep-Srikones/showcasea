"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Heart,
  MessageSquare,
  Eye,
  Mail,
  LinkIcon,
  Instagram,
  Twitter,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useParams, useRouter } from "next/navigation";
import { ArtworkType, UserType } from "@/types/types";
import { trpc } from "@/lib/trpc/client";
import { useArtStore } from "@/store/useArtStore";

export default function UserProfilePage() {
  const router = useRouter();

  const { setSelectedArtWork, increaseViewCount } = useArtStore();
  const increaseViewCountMutation =
    trpc.artWork.increaseViewCount.useMutation();
  const params = useParams();
  const { user_id } = params;
  const { user } = useAuthStore();

  const isMyPage = user_id === user?._id;

  const { data: userProfileData, isLoading: isUserProfileLoading } =
    trpc.user.getUserById.useQuery({ id: user_id as string });

  const { data: userArtworksData, isLoading: isUserArtworksLoading } =
    trpc.artWork.getArtWorksByArtistId.useQuery(user_id as string);

  const userArtWorks = (userArtworksData as ArtworkType[]) || [];
  if (isUserProfileLoading || isUserArtworksLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-6 h-6 rounded-full border-4 border-t-transparent border-purple-600 animate-spin"></div>
          <p className="text-muted-foreground text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Cover Image */}
      <div className="relative h-[200px] md:h-[300px] w-full overflow-hidden">
        <Image
          src={"/cover.jpeg"}
          alt="Cover"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Profile Info */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative -mt-16 md:-mt-24 mb-6 flex flex-col items-center md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col items-center md:flex-row md:items-end gap-4">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage
                src={userProfileData?.profile_picture_url}
                alt={userProfileData?.username}
              />
              <AvatarFallback className="text-5xl font-bold">
                {userProfileData?.first_name[0].toUpperCase()}
                {userProfileData?.last_name[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="mt-4 md:mt-0 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold">
                {userProfileData?.first_name} {userProfileData?.last_name}
              </h1>
              <p className="text-muted-foreground">
                @{userProfileData?.username}
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button className={`${isMyPage ? "hidden" : ""}`}>Follow</Button>
            <Button variant="outline" className={`${isMyPage ? "hidden" : ""}`}>
              <Mail className="mr-2 h-4 w-4" />
              Message
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <h3 className="font-medium">About</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {userProfileData?.bio || "No bio available."}
                </p>

                <div className="mt-4 flex flex-col gap-2">
                  {userProfileData?.social_media?.website && (
                    <a
                      href={userProfileData?.social_media?.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <LinkIcon className="h-4 w-4" />
                      <span>{userProfileData?.social_media?.website}</span>
                    </a>
                  )}
                  {userProfileData?.social_media?.instagram && (
                    <a
                      href={`https://instagram.com/${userProfileData?.social_media?.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <Instagram className="h-4 w-4" />
                      <span>@{userProfileData?.social_media?.instagram}</span>
                    </a>
                  )}
                  {userProfileData?.social_media?.twitter && (
                    <a
                      href={`https://twitter.com/${userProfileData?.social_media?.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <Twitter className="h-4 w-4" />
                      <span>@{userProfileData?.social_media?.twitter}</span>
                    </a>
                  )}
                </div>
              </div>
              <div className="border-t p-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">
                      {userProfileData?.followerCount || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {userProfileData?.followingCount || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Following</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <Tabs defaultValue="artworks">
              <TabsList>
                <TabsTrigger value="artworks">Artworks</TabsTrigger>
                <TabsTrigger value="liked">Liked</TabsTrigger>
              </TabsList>
              <TabsContent value="artworks" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userArtWorks.map((artwork) => (
                    <Card key={artwork._id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <Link
                          onClick={() => {
                            setSelectedArtWork(artwork);
                            increaseViewCountMutation.mutate(artwork._id, {
                              onSuccess: () => {
                                increaseViewCount();
                              },
                            });
                          }}
                          href={`/artwork`}
                        >
                          <div className="relative aspect-[4/3] w-full overflow-hidden">
                            <Image
                              src={artwork.image_urls[0] || "/placeholder.svg"}
                              alt={artwork.title}
                              width={600}
                              height={400}
                              className="object-cover transition-transform hover:scale-105"
                            />
                          </div>
                        </Link>
                        <div className="p-4">
                          <Link
                            onClick={() => {
                              setSelectedArtWork(artwork);
                              increaseViewCountMutation.mutate(artwork._id, {
                                onSuccess: () => {
                                  increaseViewCount();
                                },
                              });
                            }}
                            href={`/artwork`}
                            className="font-medium hover:underline"
                          >
                            {artwork.title}
                          </Link>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between p-4 pt-0">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            <span>{artwork.likeCount || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{artwork.commentCount || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{artwork.viewCount || 0}</span>
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="liked" className="mt-6">
                <div className="flex items-center justify-center h-40 border rounded-lg">
                  <p className="text-muted-foreground">No liked artworks yet</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
