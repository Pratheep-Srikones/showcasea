"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Grid,
  List,
  Upload,
  Heart,
  MessageSquare,
  Eye,
} from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { AddArtworkModal } from "@/components/add-artwork-modal";
import { useAuthStore } from "@/store/useAuthStore";
import { trpc } from "@/lib/trpc/client";
import { ArtworkType } from "@/types/types";
import { optimizeUrl } from "@/lib/helpers/link";
export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: userArtworksData, isLoading: isUserArtworksLoading } =
    trpc.artWork.getArtWorksByArtistId.useQuery(user?._id as string);

  const { data: userCountsData, isPending: isCountDataPending } =
    trpc.user.getCountsData.useQuery();

  const userArtWorks = (userArtworksData as ArtworkType[]) || [];
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 p-6 lg:p-10">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.first_name}! Manage your artworks and
                account.
              </p>
            </div>
            <AddArtworkModal>
              <Button className="flex items-center gap-2">
                <Plus className="mr-2 h-4 w-4" />
                Add New Artwork
              </Button>
            </AddArtworkModal>
          </div>

          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Views
                </CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isCountDataPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-10 rounded-md bg-muted animate-pulse" />
                      {/* Optional: loading text, smaller and muted */}
                      {/* <p className="text-muted-foreground text-sm">Loading...</p> */}
                    </div>
                  ) : (
                    userCountsData?.totalViews
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Likes
                </CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isCountDataPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-10 rounded-md bg-muted animate-pulse" />
                      {/* Optional: loading text, smaller and muted */}
                      {/* <p className="text-muted-foreground text-sm">Loading...</p> */}
                    </div>
                  ) : (
                    userCountsData?.totalLikes
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Comments
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isCountDataPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-10 rounded-md bg-muted animate-pulse" />
                      {/* Optional: loading text, smaller and muted */}
                      {/* <p className="text-muted-foreground text-sm">Loading...</p> */}
                    </div>
                  ) : (
                    userCountsData?.totalComments
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="grid" className="w-full">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="grid" className="flex items-center gap-2">
                  <Grid className="h-4 w-4" />
                  Grid
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  List
                </TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
            {isUserArtworksLoading ? (
              <>
                <div className="flex items-center justify-center h-screen">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-6 h-6 rounded-full border-4 border-t-transparent border-purple-600 animate-spin"></div>
                    <p className="text-muted-foreground text-lg">Loading...</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <TabsContent value="grid" className="mt-6">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {userArtWorks.map((artwork) => (
                      <Card key={artwork._id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="relative aspect-square w-full overflow-hidden">
                            <Image
                              src={
                                optimizeUrl(artwork.image_urls[0]) ||
                                "/placeholder.svg"
                              }
                              alt={artwork.title}
                              width={400}
                              height={300}
                              loading="lazy"
                              placeholder="blur"
                              blurDataURL="/placeholder-blur.jpg" // Or a tiny base64 string
                              className="object-cover transition-transform hover:scale-105"
                            />
                          </div>
                        </CardContent>
                        <CardHeader className="p-4">
                          <CardTitle className="line-clamp-1 text-lg">
                            {artwork.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {artwork.description}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter className="flex justify-between p-4 pt-0">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                          <div className="text-xs text-muted-foreground">
                            {new Date(artwork.createdAt).toLocaleDateString()}
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="list" className="mt-6">
                  <div className="rounded-md border">
                    {userArtWorks.map((artwork, index) => (
                      <div
                        key={artwork._id}
                        className={`flex items-center p-4 ${
                          index !== userArtWorks.length - 1 ? "border-b" : ""
                        }`}
                      >
                        <div className="relative h-16 w-16 overflow-hidden rounded-md">
                          <Image
                            src={
                              optimizeUrl(artwork.image_urls[0]) ||
                              "/placeholder.svg"
                            }
                            alt={artwork.title}
                            width={400}
                            height={300}
                            loading="lazy"
                            placeholder="blur"
                            blurDataURL="/placeholder-blur.jpg" // Or a tiny base64 string
                            className="object-cover transition-transform hover:scale-105"
                          />
                        </div>
                        <div className="ml-4 flex-1 space-y-1">
                          <p className="font-medium">{artwork.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {artwork.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                        <div className="ml-4 text-xs text-muted-foreground">
                          {new Date(artwork.createdAt).toLocaleDateString()}
                        </div>
                        <Button variant="ghost" size="icon" className="ml-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="19" cy="12" r="1" />
                            <circle cx="5" cy="12" r="1" />
                          </svg>
                          <span className="sr-only">More options</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
