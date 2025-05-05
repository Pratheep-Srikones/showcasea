"use client";
import Image from "next/image";
import Link from "next/link";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { trpc } from "@/lib/trpc/client";
import { useAuthStore } from "@/store/useAuthStore";
import { ChatType } from "@/types/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// 👇 ChatSkeleton component
const ChatSkeleton = () => (
  <div className="animate-pulse flex items-center justify-between p-4 rounded-lg border bg-muted/30">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-muted" />
      <div className="space-y-2">
        <div className="w-32 h-4 bg-muted rounded" />
        <div className="w-48 h-3 bg-muted rounded" />
      </div>
    </div>
    <div className="w-12 h-3 bg-muted rounded" />
  </div>
);

export default function ChatsPage() {
  const { user } = useAuthStore();
  const { data: chatsData, isPending } = trpc.chat.getChats.useQuery({
    userId: user?._id || "",
  });
  const markAsReadMutation = trpc.chat.markAsRead.useMutation();
  const router = useRouter();

  const [chats, setChats] = useState<ChatType[]>([]);

  useEffect(() => {
    if (chatsData) {
      setChats(chatsData);
    }
  }, [chatsData]);

  return (
    <div className="min-h-screen flex bg-background">
      <DashboardSidebar />

      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Chats</h1>
          </div>

          {/* Loading */}
          {isPending ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <ChatSkeleton key={i} />
              ))}
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center text-muted-foreground mt-12">
              <p className="text-lg">No chats yet.</p>
              <p className="text-sm">Start a conversation to see it here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {chats.map((chat: ChatType) => {
                const otherParticipant = chat.participants.find(
                  (p) => p._id !== user?._id
                )!;
                return (
                  <div
                    onClick={() => {
                      markAsReadMutation.mutate(chat._id!);
                      router.push(`/chat/${chat._id}`);
                    }}
                    key={chat._id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted transition"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={
                          otherParticipant?.profile_picture_url ||
                          "/default-avatar.jpg"
                        }
                        alt={otherParticipant?.username}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold">
                          {otherParticipant?.username}
                        </p>
                        <p className="text-muted-foreground text-sm truncate max-w-xs">
                          {chat.lastMessage?.content}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-muted-foreground">
                        {new Date(chat.updatedAt!).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {user?._id &&
                        chat.unreadCounts &&
                        (chat.unreadCounts[user._id] ?? 0) > 0 && (
                          <span className="mt-1 inline-block text-xs bg-primary text-white rounded-full px-2 py-0.5">
                            {chat.unreadCounts[user._id]}
                          </span>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
