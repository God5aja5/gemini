import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Chat, Message } from "@shared/schema";
import { AI_MODELS } from "@shared/ai-models";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ChatMessage } from "./chat-message";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ChatInterface({ selectedChat }: { selectedChat: Chat | null }) {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: selectedChat ? ["/api/chats", selectedChat.id, "messages"] : [],
    enabled: !!selectedChat,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      if (!selectedChat) throw new Error("No chat selected");
      const res = await apiRequest("POST", `/api/chats/${selectedChat.id}/messages`, {
        content,
        role: "user",
      });
      return res.json();
    },
    onSuccess: (newMessages) => {
      setIsTyping(true);
      setTimeout(() => {
        queryClient.setQueryData(
          ["/api/chats", selectedChat!.id, "messages"],
          (old: Message[] = []) => [...old, ...newMessages]
        );
        setIsTyping(false);
      }, 500 + Math.random() * 1000); // Random delay between 500ms and 1.5s
      setInput("");
    },
    onError: (error) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage.mutate(input);
  };

  const updateModel = useMutation({
    mutationFn: async (modelId: string) => {
      if (!selectedChat) throw new Error("No chat selected");
      const res = await apiRequest("PATCH", `/api/chats/${selectedChat.id}`, {
        modelId,
      });
      return res.json();
    },
    onSuccess: (updatedChat) => {
      queryClient.setQueryData(
        ["/api/chats"],
        (old: Chat[] = []) =>
          old.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat))
      );
    },
    onError: (error) => {
      toast({
        title: "Failed to update model",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Welcome to SUKUNA CHAT BOT</h2>
          <p className="text-muted-foreground">
            Select or create a chat to get started
          </p>
          <p className="text-sm text-red-600 mt-4">
            Powered by SUKUNA DEVELOPER
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="border-b p-4 flex items-center justify-between">
        <h2 className="font-semibold">Chat Settings</h2>
        <Select
          value={selectedChat.modelId}
          onValueChange={(value) => updateModel.mutate(value)}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select AI Model" />
          </SelectTrigger>
          <SelectContent>
            {AI_MODELS.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                <div className="flex flex-col">
                  <span>{model.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {model.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {(sendMessage.isPending || isTyping) && (
          <div className="animate-pulse text-muted-foreground text-sm">
            AI is thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message AI..."
            className="min-h-[60px] max-h-[200px]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={sendMessage.isPending || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}