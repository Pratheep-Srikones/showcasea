"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { ChatType, MessageType } from "@/types/types";
import { useAuthStore } from "@/store/useAuthStore";
import {
  subscribeToMessages,
  unsubscribeFromMessages,
} from "@/lib/utils/messages";
import { toastError } from "@/lib/utils/toast";

// Skeleton Components
const ChatHeaderSkeleton = () => (
  <div className="flex items-center gap-4 px-6 py-4 border-b animate-pulse">
    <div className="w-10 h-10 rounded-full bg-muted" />
    <div className="w-32 h-4 bg-muted rounded" />
  </div>
);

const MessageSkeleton = () => (
  <div className="space-y-3 px-6">
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className={`w-1/2 h-4 rounded-xl bg-muted ${
          i % 2 === 0 ? "ml-auto" : "mr-auto"
        }`}
      />
    ))}
  </div>
);

export default function ChatDetailPage() {
  const { user, connectSocket } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Ref for the last message

  useEffect(() => {
    const socket = connectSocket(user?._id!);

    if (socket) {
      subscribeToMessages(socket, user?._id!, (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
      });

      return () => {
        unsubscribeFromMessages(socket);
      };
    } else {
      toastError("Socket not connected. Cannot subscribe to messages.");
    }
  }, [user?._id]);
  const currentUserId = user?._id || "";
  const params = useParams();
  const chatId = params.id as string;

  const { data: currentChatData, isPending: chatLoading } =
    trpc.chat.getChat.useQuery({ chatId });
  const { data: messagesData, isPending: messagesLoading } =
    trpc.message.getMessages.useQuery({ chatId });

  const [chat, setChat] = useState<ChatType | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (currentChatData) setChat(currentChatData);
  }, [currentChatData]);

  useEffect(() => {
    if (messagesData) setMessages(messagesData);
  }, [messagesData]);

  const otherParticipant = chat?.participants.find(
    (p) => p._id !== currentUserId
  );

  const sendMessageMutation = trpc.message.addMessage.useMutation();
  const handleSend = () => {
    if (newMessage.trim() === "") return;

    sendMessageMutation.mutate(
      { chatId, content: newMessage },
      {
        onSuccess: (newMsg) => {
          setMessages((prev) => [...prev, newMsg]);
          setNewMessage("");
        },
      }
    );
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return (
    <div className="min-h-screen bg-background py-12 px-4 flex justify-center items-start">
      <div className="w-full max-w-3xl bg-white dark:bg-muted rounded-2xl shadow-lg flex flex-col h-[85vh] overflow-hidden border">
        {/* Header */}
        {chatLoading ? (
          <ChatHeaderSkeleton />
        ) : (
          <div className="flex items-center gap-4 px-6 py-4 border-b">
            <Image
              src={otherParticipant?.profile_picture_url || "/default.jpg"}
              alt={otherParticipant?.username || "User"}
              width={40}
              height={40}
              className="rounded-full"
            />
            <h2 className="text-xl font-semibold">
              {otherParticipant?.username || "Chat"}
            </h2>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {messagesLoading ? (
            <MessageSkeleton />
          ) : messages.length === 0 ? (
            <div className="text-center text-muted-foreground mt-10">
              <p className="text-sm">
                No messages yet. Start the conversation!
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.sender._id === currentUserId;
              return (
                <div
                  key={msg._id}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-xl text-sm ${
                      isMine
                        ? "bg-primary text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-foreground"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} /> {/* Empty div to scroll into view */}
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t bg-white dark:bg-muted flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border rounded-full px-4 py-2 text-sm outline-none bg-background"
            disabled={sendMessageMutation.isPending}
          />
          <button
            onClick={handleSend}
            className="bg-primary text-white px-4 py-2 rounded-full text-sm disabled:opacity-50"
            disabled={sendMessageMutation.isPending || newMessage.trim() === ""}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
