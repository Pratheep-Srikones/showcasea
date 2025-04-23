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

// Dummy data for user profile
const userProfile = {
  name: "Elena Rodriguez",
  username: "elenaart",
  avatar: "/placeholder.svg?height=150&width=150",
  coverImage: "/placeholder.svg?height=400&width=1200",
  bio: "Digital artist and illustrator specializing in vibrant, surreal landscapes and character design. Based in Barcelona, Spain.",
  followers: 1245,
  following: 328,
  likes: 8976,
  links: {
    website: "https://elenaart.com",
    instagram: "elenaart",
    twitter: "elenaart",
  },
  artworks: [
    {
      id: 1,
      title: "Neon Dreams",
      image: "/placeholder.svg?height=400&width=600",
      likes: 245,
      comments: 32,
      views: 1890,
    },
    {
      id: 2,
      title: "Digital Flora",
      image: "/placeholder.svg?height=400&width=600",
      likes: 189,
      comments: 24,
      views: 1456,
    },
    {
      id: 3,
      title: "Abstract Emotions",
      image: "/placeholder.svg?height=400&width=600",
      likes: 312,
      comments: 45,
      views: 2134,
    },
    {
      id: 4,
      title: "Urban Geometry",
      image: "/placeholder.svg?height=400&width=600",
      likes: 178,
      comments: 19,
      views: 1245,
    },
    {
      id: 5,
      title: "Sunset Reflections",
      image: "/placeholder.svg?height=400&width=600",
      likes: 203,
      comments: 27,
      views: 1567,
    },
    {
      id: 6,
      title: "Geometric Harmony",
      image: "/placeholder.svg?height=400&width=600",
      likes: 156,
      comments: 21,
      views: 1234,
    },
  ],
  collections: [
    {
      id: 1,
      title: "Abstract Works",
      image: "/placeholder.svg?height=400&width=600",
      count: 12,
    },
    {
      id: 2,
      title: "Character Designs",
      image: "/placeholder.svg?height=400&width=600",
      count: 8,
    },
    {
      id: 3,
      title: "Landscapes",
      image: "/placeholder.svg?height=400&width=600",
      count: 15,
    },
  ],
};

export default function UserProfilePage() {
  const { user } = useAuthStore();
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
                src={user?.profile_picture_url}
                alt={user?.username}
              />
              <AvatarFallback className="text-5xl font-bold">
                {user?.first_name[0].toUpperCase()}
                {user?.last_name[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="mt-4 md:mt-0 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold">
                {user?.first_name} {user?.last_name}
              </h1>
              <p className="text-muted-foreground">@{user?.username}</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button>Follow</Button>
            <Button variant="outline">
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
                  {user?.bio || "No bio available."}
                </p>

                <div className="mt-4 flex flex-col gap-2">
                  {user?.social_media?.website && (
                    <a
                      href={user?.social_media?.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <LinkIcon className="h-4 w-4" />
                      <span>{user?.social_media?.website}</span>
                    </a>
                  )}
                  {user?.social_media?.instagram && (
                    <a
                      href={`https://instagram.com/${user?.social_media?.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <Instagram className="h-4 w-4" />
                      <span>@{user?.social_media?.instagram}</span>
                    </a>
                  )}
                  {user?.social_media?.twitter && (
                    <a
                      href={`https://twitter.com/${user?.social_media?.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <Twitter className="h-4 w-4" />
                      <span>@{user?.social_media?.twitter}</span>
                    </a>
                  )}
                </div>
              </div>
              <div className="border-t p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">
                      {userProfile.followers}
                    </p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {userProfile.following}
                    </p>
                    <p className="text-xs text-muted-foreground">Following</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{userProfile.likes}</p>
                    <p className="text-xs text-muted-foreground">Likes</p>
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
                <TabsTrigger value="collections">Collections</TabsTrigger>
                <TabsTrigger value="liked">Liked</TabsTrigger>
              </TabsList>
              <TabsContent value="artworks" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userProfile.artworks.map((artwork) => (
                    <Card key={artwork.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <Link href={`/artwork/${artwork.id}`}>
                          <div className="relative aspect-[4/3] w-full overflow-hidden">
                            <Image
                              src={artwork.image || "/placeholder.svg"}
                              alt={artwork.title}
                              width={600}
                              height={400}
                              className="object-cover transition-transform hover:scale-105"
                            />
                          </div>
                        </Link>
                        <div className="p-4">
                          <Link
                            href={`/artwork/${artwork.id}`}
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
                            <span>{artwork.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{artwork.comments}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{artwork.views}</span>
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="collections" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userProfile.collections.map((collection) => (
                    <Card key={collection.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <Link href={`/collection/${collection.id}`}>
                          <div className="relative aspect-[4/3] w-full overflow-hidden">
                            <Image
                              src={collection.image || "/placeholder.svg"}
                              alt={collection.title}
                              width={600}
                              height={400}
                              className="object-cover transition-transform hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <span className="text-white text-xl font-bold">
                                {collection.count} artworks
                              </span>
                            </div>
                          </div>
                        </Link>
                        <div className="p-4">
                          <Link
                            href={`/collection/${collection.id}`}
                            className="font-medium hover:underline"
                          >
                            {collection.title}
                          </Link>
                        </div>
                      </CardContent>
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
