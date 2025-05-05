"use client";
import Image from "next/image";
import Link from "next/link";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

type SampleChat = {
  id: string;
  participant: { name: string; avatar: string };
  lastMessage: string;
  unreadCount: number;
  updatedAt: string;
};

const sampleChats: SampleChat[] = [
  {
    id: "1",
    participant: {
      name: "Alex Monroe",
      avatar: "/avatars/alex.jpg",
    },
    lastMessage: "Hey, just saw your latest artwork. Amazing!",
    unreadCount: 2,
    updatedAt: "2h ago",
  },
  {
    id: "2",
    participant: {
      name: "Jamie Lane",
      avatar: "/avatars/jamie.jpg",
    },
    lastMessage: "Let’s collab on that digital piece?",
    unreadCount: 0,
    updatedAt: "1d ago",
  },
];

export default function ChatsPage() {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main content */}
      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Chats</h1>
          </div>

          <div className="space-y-4">
            {sampleChats.map((chat) => (
              <Link
                href={`/chat/${chat.id}`}
                key={chat.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted transition"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={chat.participant.avatar}
                    alt={chat.participant.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{chat.participant.name}</p>
                    <p className="text-muted-foreground text-sm truncate max-w-xs">
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-muted-foreground">
                    {chat.updatedAt}
                  </span>
                  {chat.unreadCount > 0 && (
                    <span className="mt-1 inline-block text-xs bg-primary text-white rounded-full px-2 py-0.5">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
