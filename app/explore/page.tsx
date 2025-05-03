"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageSquare, Eye, Search, Filter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ArtworkType } from "@/types/types";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc/client";

// Dummy data for explore page
const artworks = [
  {
    id: 1,
    title: "Neon Dreams",
    creator: {
      name: "Elena Rodriguez",
      username: "elenaart",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    image: "/placeholder.svg?height=400&width=600",
    likes: 245,
    comments: 32,
    views: 1890,
    tags: ["digital", "neon", "cyberpunk"],
  },
  {
    id: 2,
    title: "Mountain Serenity",
    creator: {
      name: "David Kim",
      username: "davidkim",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    image: "/placeholder.svg?height=400&width=600",
    likes: 189,
    comments: 24,
    views: 1456,
    tags: ["photography", "nature", "landscape"],
  },
  {
    id: 3,
    title: "Abstract Emotions",
    creator: {
      name: "Aisha Johnson",
      username: "aishacreates",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    image: "/placeholder.svg?height=400&width=600",
    likes: 312,
    comments: 45,
    views: 2134,
    tags: ["painting", "abstract", "emotions"],
  },
  {
    id: 4,
    title: "Urban Geometry",
    creator: {
      name: "Marcus Chen",
      username: "marcusdesigns",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    image: "/placeholder.svg?height=400&width=600",
    likes: 178,
    comments: 19,
    views: 1245,
    tags: ["photography", "urban", "architecture"],
  },
  {
    id: 5,
    title: "Digital Flora",
    creator: {
      name: "Sofia Patel",
      username: "sofiadraws",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    image: "/placeholder.svg?height=400&width=600",
    likes: 267,
    comments: 38,
    views: 1879,
    tags: ["digital", "nature", "illustration"],
  },
  {
    id: 6,
    title: "Sunset Reflections",
    creator: {
      name: "James Wilson",
      username: "jameswilson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    image: "/placeholder.svg?height=400&width=600",
    likes: 203,
    comments: 27,
    views: 1567,
    tags: ["photography", "nature", "sunset"],
  },
  {
    id: 7,
    title: "Geometric Harmony",
    creator: {
      name: "Olivia Martinez",
      username: "oliviaart",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    image: "/placeholder.svg?height=400&width=600",
    likes: 156,
    comments: 21,
    views: 1234,
    tags: ["digital", "geometric", "abstract"],
  },
  {
    id: 8,
    title: "Ethereal Dreams",
    creator: {
      name: "Liam Johnson",
      username: "liamcreates",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    image: "/placeholder.svg?height=400&width=600",
    likes: 289,
    comments: 42,
    views: 2045,
    tags: ["painting", "surreal", "fantasy"],
  },
  {
    id: 9,
    title: "Cosmic Voyage",
    creator: {
      name: "Nina Carter",
      username: "ninacreates",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    image: "/placeholder.svg?height=400&width=600",
    likes: 321,
    comments: 50,
    views: 2300,
    tags: ["digital", "space", "sci-fi"],
  },
  {
    id: 10,
    title: "Rustic Charm",
    creator: {
      name: "Ethan Brown",
      username: "ethanbrown",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    image: "/placeholder.svg?height=400&width=600",
    likes: 198,
    comments: 30,
    views: 1600,
    tags: ["photography", "rustic", "vintage"],
  },
  {
    id: 11,
    title: "Ocean Bliss",
    creator: {
      name: "Sophia Lee",
      username: "sophialee",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    image: "/placeholder.svg?height=400&width=600",
    likes: 275,
    comments: 40,
    views: 2000,
    tags: ["painting", "ocean", "serenity"],
  },
  {
    id: 12,
    title: "City Lights",
    creator: {
      name: "Ryan Adams",
      username: "ryanadams",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    image: "/placeholder.svg?height=400&width=600",
    likes: 240,
    comments: 35,
    views: 1900,
    tags: ["photography", "city", "night"],
  },
];

export default function ExplorePage() {
  const [sortBy, setSortBy] = useState("viewCount");
  const [tag, setTag] = useState("all");

  const [count, setCount] = useState(0);
  const { data: countData } =
    trpc.artWork.getFilteredArtWorkCount.useQuery(tag);

  useEffect(() => {
    if (countData && countData > 0) {
      setCount(countData);
    }
    console.log(countData);
  }, [countData]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // or 8, or whatever suits your layout

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const [currentArtworks, setCurrentArtWorks] = useState<ArtworkType[]>([]);

  const totalPages = Math.ceil(count / itemsPerPage);
  const { data: currentArtworksData, isPending } =
    trpc.artWork.getFilteredArtworks.useQuery({
      tag: tag,
      sortBy: sortBy,
      start: indexOfFirst,
      offset: indexOfLast,
    });

  useEffect(() => {
    if (currentArtworksData) {
      setCurrentArtWorks(currentArtworksData);
    }
  }, [currentArtworksData]);
  return (
    <div className="container mx-auto py-6 lg:py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Explore Artworks
            </h1>
            <p className="text-muted-foreground">
              Discover amazing creations from artists around the world.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search artworks or creators..."
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Tabs
            defaultValue="all"
            value={tag}
            onValueChange={setTag}
            className="w-full sm:w-auto"
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="digital">Digital</TabsTrigger>
              <TabsTrigger value="photography">Photography</TabsTrigger>
              <TabsTrigger value="painting">Painting</TabsTrigger>
              <TabsTrigger value="illustration">Illustration</TabsTrigger>
            </TabsList>
          </Tabs>

          <Select
            defaultValue="viewCount"
            value={sortBy}
            onValueChange={setSortBy}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="viewCount">Trending</SelectItem>
              <SelectItem value="createdAt">Newest</SelectItem>
              <SelectItem value="likeCount">Most Popular</SelectItem>
              <SelectItem value="commentCount">Most Comments</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          {/* Artwork Grid */}
          {isPending ? (
            // Loading State
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="animate-pulse overflow-hidden">
                  <div className="aspect-[4/3] bg-muted w-full" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted w-3/4 rounded" />
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-muted" />
                      <div className="h-4 bg-muted w-1/2 rounded" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {!currentArtworks || currentArtworks.length === 0 ? (
                // Empty State
                <div className="w-full text-center py-20 text-muted-foreground">
                  <p className="text-lg font-medium">No artworks found</p>
                  <p className="text-sm">
                    Try adjusting your filters or sorting options.
                  </p>
                </div>
              ) : (
                // Loaded Content
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentArtworks.map((artwork) => (
                    <Card key={artwork._id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <Link href={`/artwork/${artwork._id}`}>
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
                          <div className="flex flex-col space-y-2">
                            <Link
                              href={`/artwork/${artwork._id}`}
                              className="font-medium hover:underline"
                            >
                              {artwork.title}
                            </Link>
                            <Link
                              href={`/profile/${artwork.artist._id}`}
                              className="flex items-center gap-2"
                            >
                              <Avatar className="h-6 w-6">
                                <AvatarImage
                                  src={
                                    artwork?.artist?.profile_picture_url ||
                                    "/placeholder.svg"
                                  }
                                  alt={artwork?.artist?.username}
                                />
                                <AvatarFallback>
                                  {artwork.artist?.username?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-muted-foreground">
                                {artwork?.artist?.first_name}{" "}
                                {artwork?.artist?.last_name}
                              </span>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between p-4 pt-0">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            <span>{artwork?.likeCount}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{artwork?.commentCount}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{artwork?.viewCount}</span>
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Pagination Controls */}
          <div className="flex flex-wrap items-center justify-center mt-8 gap-2">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </Button>

            <div className="flex overflow-x-auto max-w-full gap-1 px-2 items-center">
              {/* Always show first page if not near current */}
              {currentPage > 2 && (
                <>
                  <Button
                    size="sm"
                    variant={currentPage === 1 ? "default" : "outline"}
                    onClick={() => setCurrentPage(1)}
                    className="min-w-[2.5rem]"
                  >
                    1
                  </Button>
                  {currentPage > 3 && <span className="px-1">...</span>}
                </>
              )}

              {/* Page before */}
              {currentPage > 1 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="min-w-[2.5rem]"
                >
                  {currentPage - 1}
                </Button>
              )}

              {/* Current page */}
              <Button
                size="sm"
                variant="default"
                className="min-w-[2.5rem] cursor-default"
              >
                {currentPage}
              </Button>

              {/* Page after */}
              {currentPage < totalPages && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="min-w-[2.5rem]"
                >
                  {currentPage + 1}
                </Button>
              )}

              {/* Last page */}
              {currentPage < totalPages - 1 && (
                <>
                  {currentPage < totalPages - 2 && (
                    <span className="px-1">...</span>
                  )}
                  <Button
                    size="sm"
                    variant={currentPage === totalPages ? "default" : "outline"}
                    onClick={() => setCurrentPage(totalPages)}
                    className="min-w-[2.5rem]"
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>

            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
