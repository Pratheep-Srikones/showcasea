"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heart, MessageSquare, Eye, ArrowLeft } from "lucide-react";
import { useArtStore } from "@/store/useArtStore";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";

export default function ArtworkDetailPage() {
  const router = useRouter();
  const { seletedArtWork } = useArtStore();

  const [activeTab, setActiveTab] = useState<"details" | "comments">("details");
  const [selectedImage, setSelectedImage] = useState(
    seletedArtWork?.image_urls[0]
  );
  const likeMutation = trpc.like.likeArtWork.useMutation();
  const unlikeMutation = trpc.like.unlikeArtWork.useMutation();
  const { data: hasLikedData, isPending } = trpc.like.hasLiked.useQuery({
    liker_id: seletedArtWork?.artist?._id!,
    artWork_id: seletedArtWork?._id!,
  });
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    if (hasLikedData !== undefined) {
      setHasLiked(hasLikedData);
    }
  }, [hasLikedData]);

  const dummyComments = [
    {
      id: 1,
      author: {
        username: "artlover42",
        profile_picture_url: "/placeholder.svg?height=50&width=50",
      },
      content: "Absolutely stunning work!",
      createdAt: "2025-04-19T09:12:00.000Z",
    },
    {
      id: 2,
      author: {
        username: "neonfan",
        profile_picture_url: "/placeholder.svg?height=50&width=50",
      },
      content: "The colors are so vibrant, love it!",
      createdAt: "2025-04-20T14:45:00.000Z",
    },
  ];
  const handleLike = (artWork_id: string, artist_id: string) => {
    likeMutation.mutate(
      { artWork_id, artist_id },
      {
        onSuccess: (data) => {
          if (data) {
            setHasLiked(true);
          }
        },
        onError: (error) => {
          console.error("Error liking artwork:", error);
        },
      }
    );
  };
  const handleUnlike = (artWork_id: string, artist_id: string) => {
    unlikeMutation.mutate(
      { artWork_id, artist_id },
      {
        onSuccess: (data) => {
          if (data) {
            setHasLiked(false);
          }
        },
        onError: (error) => {
          console.error("Error unliking artwork:", error);
        },
      }
    );
  };
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div
        onClick={() => {
          window.history.back();
        }}
        className="flex items-center text-sm text-muted-foreground mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Gallery
      </div>

      {/* Title & Artist */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold">{seletedArtWork?.title}</h1>
        <div className="flex items-center mt-4 md:mt-0">
          <Avatar className="h-10 w-10 border-2 border-background">
            <AvatarImage
              src={seletedArtWork?.artist?.profile_picture_url}
              alt={seletedArtWork?.artist?.username}
            />
            <AvatarFallback>
              {seletedArtWork?.artist?.first_name[0]}
            </AvatarFallback>
          </Avatar>
          <Link
            href={`/profile/${seletedArtWork?.artist?._id}`}
            className="ml-3 text-lg font-medium hover:underline"
          >
            {seletedArtWork?.artist?.first_name}{" "}
            {seletedArtWork?.artist?.last_name}
          </Link>
        </div>
      </div>

      {/* Main Image & Thumbnails */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-8">
        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg">
          <Image
            src={selectedImage || "/placeholder.svg"}
            alt={seletedArtWork?.title || "Artwork"}
            fill
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {seletedArtWork?.image_urls.map((url) => (
            <div
              key={url}
              className={`relative w-full aspect-[4/3] rounded-md overflow-hidden cursor-pointer ${
                url === selectedImage ? "ring-2 ring-purple-600" : ""
              }`}
              onClick={() => setSelectedImage(url)}
            >
              <Image src={url} alt="thumbnail" fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Stats & Actions */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-6 text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="h-5 w-5" /> <span>{seletedArtWork?.viewCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="h-5 w-5" />{" "}
            <span>{seletedArtWork?.likeCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-5 w-5" />{" "}
            <span>{seletedArtWork?.commentCount}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={hasLiked ? "default" : "outline"}
            className={`flex items-center gap-2 transition-colors duration-200 ${
              hasLiked
                ? "text-red-600 dark:text-red-400 border-red-600 dark:border-red-400"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-pressed={hasLiked}
            onClick={() =>
              hasLiked
                ? handleUnlike(
                    seletedArtWork?._id!,
                    seletedArtWork?.artist?._id!
                  )
                : handleLike(seletedArtWork?._id!, seletedArtWork?.artist?._id!)
            }
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                hasLiked ? "fill-current text-red-600 dark:text-red-400" : ""
              }`}
            />
            {hasLiked ? "Liked" : "Like"}
          </Button>

          <Button variant="outline" className="flex items-center gap-2">
            <MessageSquare /> Comment
          </Button>
        </div>
      </div>

      {/* Tabs: Details & Comments */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "details" | "comments")}
      >
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-sm text-muted-foreground">
              {seletedArtWork?.description}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {seletedArtWork?.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="comments" className="mt-6 space-y-4">
          {dummyComments.map((c) => (
            <Card key={c.id} className="shadow-sm">
              <CardHeader className="flex items-center gap-3 p-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={c.author.profile_picture_url}
                    alt={c.author.username}
                  />
                  <AvatarFallback>{c.author.username[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{c.author.username}</h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p>{c.content}</p>
              </CardContent>
            </Card>
          ))}

          <div className="mt-4">
            <textarea
              rows={3}
              placeholder="Add a comment..."
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Button className="mt-2">Post Comment</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
