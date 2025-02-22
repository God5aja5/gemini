import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Chat, Message } from "@shared/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { useState } from "react";
import { ChatMessage } from "./chat-message";

export function ChatInterface({ selectedChat }: { selectedChat: Chat | null }) {
  const [input, setInput] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: selectedChat ? ["/api/chats", selectedChat.id, "messages"] : [],
    enabled: !!selectedChat,
  });

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
      queryClient.setQueryData(
        ["/api/chats", selectedChat!.id, "messages"],
        (old: Message[] = []) => [...old, ...newMessages]
      );
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

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Welcome to Gemini Chat</h2>
          <p className="text-muted-foreground">
            Select or create a chat to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {sendMessage.isPending && (
          <div className="animate-pulse text-muted-foreground text-sm">
            Gemini is thinking...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message Gemini..."
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
