"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Heart, MessageSquare, Eye, ArrowLeft, Trash } from "lucide-react";
import { useArtStore } from "@/store/useArtStore";
import { trpc } from "@/lib/trpc/client";
import { CommentType } from "@/types/types";
import { useAuthStore } from "@/store/useAuthStore";

export default function ArtworkDetailPage() {
  const { user } = useAuthStore();
  const {
    seletedArtWork,
    changeCommentCount,
    changeLikeCount,
    hasViewed,
    setHasViewed,
  } = useArtStore();

  const increaseViewCountMutation =
    trpc.artWork.increaseViewCount.useMutation();

  useEffect(() => {
    if (seletedArtWork && !hasViewed) {
      increaseViewCountMutation.mutate(seletedArtWork._id as string);
      setHasViewed(true);
    }
  }, []);

  const isOwner: boolean = user?._id === seletedArtWork?.artist?._id;

  const [activeTab, setActiveTab] = useState<"details" | "comments">("details");
  const [selectedImage, setSelectedImage] = useState(
    seletedArtWork?.image_urls[0]
  );
  const likeMutation = trpc.like.likeArtWork.useMutation();
  const unlikeMutation = trpc.like.unlikeArtWork.useMutation();
  const addCommentMutation = trpc.comment.addComment.useMutation();
  const deleteCommentMutation = trpc.comment.deleteComment.useMutation();

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

  const [comments, setComments] = useState<CommentType[]>([]);
  const { data: commentsData } = trpc.comment.getComments.useQuery({
    artWork_id: seletedArtWork?._id!,
  });

  useEffect(() => {
    if (commentsData) {
      setComments(commentsData);
    }
  }, [commentsData]);

  const handleLike = (artWork_id: string, artist_id: string) => {
    likeMutation.mutate(
      { artWork_id, artist_id },
      {
        onSuccess: (data) => {
          if (data) {
            setHasLiked(true);
            changeLikeCount(1);
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
            changeLikeCount(-1);
          }
        },
        onError: (error) => {
          console.error("Error unliking artwork:", error);
        },
      }
    );
  };

  const [commentContent, setCommentContent] = useState<string>("");

  const handleAddComment = () => {
    if (commentContent.trim() === "") return;
    addCommentMutation.mutate(
      { artWork_id: seletedArtWork?._id!, content: commentContent },
      {
        onSuccess: (data) => {
          if (data) {
            setCommentContent("");
            console.log("Comment added:", data.comment);
            setComments((prev) => [data.comment, ...prev]);
            setActiveTab("comments");
            changeCommentCount(1);
          }
        },
        onError: (error) => {
          console.error("Error adding comment:", error);
        },
      }
    );
  };

  const handleDeleteComment = (comment_id: string) => {
    deleteCommentMutation.mutate(
      { comment_id },
      {
        onSuccess: (data) => {
          if (data) {
            setComments((prev) =>
              prev.filter((comment) => comment._id !== comment_id)
            );
            changeCommentCount(-1);
          }
        },
        onError: (error) => {
          console.error("Error deleting comment:", error);
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
        <TabsContent value="comments" className="mt-6">
          <div className="relative max-h-[500px] rounded-md border p-4 shadow-sm">
            {/* Scrollable comments */}
            <div className="space-y-4 overflow-y-auto pr-2 pb-[150px] max-h-[400px]">
              {comments &&
                comments.map((c) => (
                  <Card
                    key={c?._id}
                    className="shadow-none border border-muted p-3 relative"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={c?.userId?.profile_picture_url}
                          alt={c?.userId?.username}
                        />
                        <AvatarFallback>
                          {c?.userId?.username[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-sm">
                              {c?.userId.username}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {new Date(c?.createdAt).toLocaleDateString()}
                            </p>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className={`text-muted-foreground hover:text-red-600 ${
                              !isOwner && c?.userId._id !== user?._id
                                ? "hidden"
                                : ""
                            }`}
                            onClick={() => handleDeleteComment(c._id)}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>

                        <p className="text-sm mt-2">{c?.content}</p>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>

            {/* Fixed comment input at the bottom */}
            <div className="absolute bottom-4 left-4 right-4 border-t pt-4 bg-background">
              <textarea
                rows={2}
                placeholder="Add a comment..."
                className="w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                autoComplete="off"
              />
              <div className="flex justify-end mt-2">
                <Button size="sm" onClick={handleAddComment}>
                  Post
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
