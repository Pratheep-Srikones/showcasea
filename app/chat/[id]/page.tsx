"use client";
import { useState } from "react";
import Image from "next/image";

const currentUserId = "user1";

// Mock chat data
const sampleChat = {
  _id: "chat1",
  participants: [
    {
      _id: "user1",
      name: "Alex Monroe",
      avatar: "/avatars/alex.jpg",
    },
    {
      _id: "user2",
      name: "Jamie Lane",
      avatar: "/avatars/jamie.jpg",
    },
  ],
  messages: [
    {
      _id: "msg1",
      sender: {
        _id: "user1",
        name: "Alex Monroe",
        avatar: "/avatars/alex.jpg",
      },
      content: "Hey! How are you doing?",
      createdAt: "2025-05-05T10:00:00Z",
    },
    {
      _id: "msg2",
      sender: {
        _id: "user2",
        name: "Jamie Lane",
        avatar: "/avatars/jamie.jpg",
      },
      content: "I'm good, just working on our project.",
      createdAt: "2025-05-05T10:02:00Z",
    },
  ],
};

export default function ChatDetailPage() {
  const [messages, setMessages] = useState(sampleChat.messages);
  const [newMessage, setNewMessage] = useState("");

  const otherParticipant = sampleChat.participants.find(
    (p) => p._id !== currentUserId
  );

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const newMsg = {
      _id: `msg${Date.now()}`,
      sender: sampleChat.participants.find((p) => p._id === currentUserId)!,
      content: newMessage,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 flex justify-center items-start">
      <div className="w-full max-w-3xl bg-white dark:bg-muted rounded-2xl shadow-lg flex flex-col h-[85vh] overflow-hidden border">
        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-4 border-b">
          <Image
            src={otherParticipant?.avatar || "/default.jpg"}
            alt={otherParticipant?.name || "User"}
            width={40}
            height={40}
            className="rounded-full"
          />
          <h2 className="text-xl font-semibold">
            {otherParticipant?.name || "Chat"}
          </h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {messages.map((msg) => {
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
          })}
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t bg-white dark:bg-muted flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border rounded-full px-4 py-2 text-sm outline-none bg-background"
          />
          <button
            onClick={handleSend}
            className="bg-primary text-white px-4 py-2 rounded-full text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
