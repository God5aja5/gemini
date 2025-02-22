import { Navbar } from "@/components/layout/navbar";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ChatInterface } from "@/components/chat/chat-interface";
import { useState } from "react";
import { Chat } from "@shared/schema";

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        <ChatSidebar
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
        />
        <ChatInterface selectedChat={selectedChat} />
      </div>
    </div>
  );
}
