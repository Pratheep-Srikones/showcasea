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
import { useArtStore } from "@/store/useArtStore";
import { useRouter } from "next/navigation";
import { toastError } from "@/lib/utils/toast";
import SearchResult from "@/components/modals/SearchResult";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const handleSearch = () => {
    if (searchQuery) {
      setModalOpen(true);
    } else {
      toastError("Please enter a search term");
    }
  };

  const [sortBy, setSortBy] = useState("viewCount");
  const { setSelectedArtWork } = useArtStore();
  const router = useRouter();
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
  const itemsPerPage = 8; // or 8, or whatever suits your layout

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
  if (modalOpen) {
    return (
      <SearchResult
        searchTerm={searchQuery}
        onClose={() => setModalOpen(false)}
      />
    );
  }
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" onClick={handleSearch}>
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
                        <div
                          onClick={() => {
                            setSelectedArtWork(artwork);
                            router.push(`/artwork`);
                          }}
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
                        </div>
                        <div className="p-4">
                          <div className="flex flex-col space-y-2">
                            <div
                              onClick={() => {
                                setSelectedArtWork(artwork);
                                router.push(`/artwork`);
                              }}
                              className="text-lg font-semibold text-foreground cursor-pointer truncate hover:underline"
                            >
                              {artwork.title}
                            </div>
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
