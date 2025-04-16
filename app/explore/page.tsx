import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageSquare, Eye, Search, Filter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

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
]

export default function ExplorePage() {
  return (
    <div className="container mx-auto py-6 lg:py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Explore Artworks</h1>
            <p className="text-muted-foreground">Discover amazing creations from artists around the world.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search artworks or creators..." className="pl-8" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Tabs defaultValue="all" className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="digital">Digital</TabsTrigger>
              <TabsTrigger value="photography">Photography</TabsTrigger>
              <TabsTrigger value="painting">Painting</TabsTrigger>
              <TabsTrigger value="illustration">Illustration</TabsTrigger>
            </TabsList>
          </Tabs>
          <Select defaultValue="trending">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trending">Trending</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="comments">Most Comments</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artworks.map((artwork) => (
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
                  <div className="flex flex-col space-y-2">
                    <Link href={`/artwork/${artwork.id}`} className="font-medium hover:underline">
                      {artwork.title}
                    </Link>
                    <Link href={`/profile/${artwork.creator.username}`} className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={artwork.creator.avatar || "/placeholder.svg"} alt={artwork.creator.name} />
                        <AvatarFallback>{artwork.creator.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">{artwork.creator.name}</span>
                    </Link>
                  </div>
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
                <div className="flex gap-1">
                  {artwork.tags.slice(0, 1).map((tag) => (
                    <Link
                      key={tag}
                      href={`/explore?tag=${tag}`}
                      className="text-xs bg-muted px-2 py-1 rounded-md hover:bg-muted/80"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
