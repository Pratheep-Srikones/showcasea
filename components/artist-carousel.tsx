"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Dummy data for featured artists
const featuredArtists = [
  {
    id: 1,
    name: "Elena Rodriguez",
    username: "elenaart",
    avatar:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    image:
      "https://images.unsplash.com/photo-1652170153084-6b35f0b0e886?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Urban Dreamscape",
    medium: "Digital Art",
  },
  {
    id: 2,
    name: "Marcus Chen",
    username: "marcusdesigns",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    image:
      "https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Neon Reflections",
    medium: "Photography",
  },
  {
    id: 3,
    name: "Aisha Johnson",
    username: "aishacreates",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    image:
      "https://images.unsplash.com/photo-1745040569753-45bda00ac48c?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Abstract Emotions",
    medium: "Oil Painting",
  },
  {
    id: 4,
    name: "David Kim",
    username: "davidkim",
    avatar:
      "https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    image:
      "https://images.unsplash.com/photo-1696944389930-8e173626b912?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Geometric Harmony",
    medium: "3D Modeling",
  },
  {
    id: 5,
    name: "Sofia Patel",
    username: "sofiadraws",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    image:
      "https://images.unsplash.com/photo-1611581524836-692bcce7bbbc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Nature's Whisper",
    medium: "Photography",
  },
];

export function ArtistCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredArtists.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + featuredArtists.length) % featuredArtists.length
    );
  };

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay, currentIndex]);

  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex items-center justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={() => {
            prevSlide();
            setAutoplay(false);
          }}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous slide</span>
        </Button>
        <div className="w-full overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {featuredArtists.map((artist) => (
              <div key={artist.id} className="min-w-full px-4">
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                      <Image
                        src={artist.image || "/placeholder.svg"}
                        alt={artist.title}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage
                            src={artist.avatar || "/placeholder.svg"}
                            alt={artist.name}
                          />
                          <AvatarFallback>
                            {artist.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-bold">{artist.title}</h3>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/profile/${artist.username}`}
                              className="text-sm font-medium hover:underline"
                            >
                              {artist.name}
                            </Link>
                            <span className="text-xs text-muted-foreground">
                              • {artist.medium}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={() => {
            nextSlide();
            setAutoplay(false);
          }}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next slide</span>
        </Button>
      </div>
      <div className="mt-4 flex justify-center gap-2">
        {featuredArtists.map((_, index) => (
          <Button
            key={index}
            variant="ghost"
            size="icon"
            className={`h-2 w-2 rounded-full p-0 ${
              index === currentIndex ? "bg-primary" : "bg-muted"
            }`}
            onClick={() => {
              setCurrentIndex(index);
              setAutoplay(false);
            }}
          >
            <span className="sr-only">Go to slide {index + 1}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
