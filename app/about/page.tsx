import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Palette,
  Star,
  Users,
  CalendarCheck,
  Code,
  Rocket,
} from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6 text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            About Showcasa
          </h1>
          <p className="max-w-3xl mx-auto text-muted-foreground text-lg md:text-xl">
            Showcasa is a digital sanctuary for visual storytellers. We empower
            creators to showcase their work, connect with other artists, and
            grow in a supportive community.
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="w-full py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6 grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold sm:text-4xl">Our Mission</h2>
            <p className="text-muted-foreground text-lg">
              Our mission is to democratize the creative space by giving artists
              of all backgrounds a platform to shine. Whether you're a digital
              painter, a 3D designer, or a pixel artist, Showcasa is your space
              to share, grow, and be discovered.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <Feature
              icon={Palette}
              title="Creativity First"
              description="We celebrate all forms of digital creativity, no matter the style or medium."
            />
            <Feature
              icon={Star}
              title="Elevate Talent"
              description="Our tools help artists grow their reach and be seen by a wider audience."
            />
            <Feature
              icon={Users}
              title="Build Community"
              description="Connect, collaborate, and support each other through feedback and interaction."
            />
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="w-full py-16 md:py-24 bg-muted">
        <div className="container px-4 md:px-6 space-y-10">
          <h2 className="text-3xl font-bold text-center sm:text-4xl">
            Our Journey
          </h2>
          <div className="space-y-10">
            <TimelineStep
              icon={CalendarCheck}
              year="2023"
              title="Humble Beginnings"
              description="Showcasa was born as a weekend side project with a simple goal: help digital artists get visibility."
            />
            <TimelineStep
              icon={Code}
              year="2024"
              title="Platform Launch"
              description="We launched our MVP with support for image galleries and creator profiles. The response was overwhelming!"
            />
            <TimelineStep
              icon={Rocket}
              year="2025"
              title="Community Explosion"
              description="Now home to thousands of artists, Showcasa continues to evolve as a hub for creative discovery."
            />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6 space-y-10">
          <h2 className="text-3xl font-bold text-center sm:text-4xl">
            Meet the Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-center">
            <TeamCard
              name="Sarah Kim"
              role="Founder & Product"
              image="/team/sarah.jpg"
            />
            <TeamCard
              name="Liam Patel"
              role="Frontend Engineer"
              image="/team/liam.jpg"
            />
            <TeamCard
              name="Anya Silva"
              role="UX Designer"
              image="/team/anya.jpg"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 md:py-24 bg-muted text-center">
        <div className="container px-4 md:px-6 space-y-6">
          <h2 className="text-3xl font-bold sm:text-4xl">Join the Movement</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground md:text-lg">
            Thousands of creators have already joined Showcasa to share their
            work, get inspired, and grow. What are you waiting for?
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/auth?tab=signup">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/explore">Explore Artworks</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 Showcasa. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="/terms"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Privacy
            </Link>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Feature card
function Feature({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mx-auto">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

// Timeline step
function TimelineStep({
  icon: Icon,
  year,
  title,
  description,
}: {
  icon: any;
  year: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-6">
      <div className="flex-shrink-0">
        <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div>
        <h4 className="text-xl font-semibold">
          {year} — {title}
        </h4>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

// Team card
function TeamCard({
  name,
  role,
  image,
}: {
  name: string;
  role: string;
  image: string;
}) {
  return (
    <div className="space-y-4">
      <Image
        src={image}
        alt={name}
        width={120}
        height={120}
        className="rounded-full mx-auto object-cover"
      />
      <h4 className="text-lg font-bold">{name}</h4>
      <p className="text-muted-foreground">{role}</p>
    </div>
  );
}
