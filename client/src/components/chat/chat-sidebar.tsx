import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Chat } from "@shared/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageSquarePlus } from "lucide-react";

export function ChatSidebar({
  selectedChat,
  onSelectChat,
}: {
  selectedChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: chats = [] } = useQuery<Chat[]>({
    queryKey: ["/api/chats"],
  });

  const createChat = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/chats", {
        title: "New Chat",
      });
      return res.json();
    },
    onSuccess: (newChat) => {
      queryClient.setQueryData(["/api/chats"], (old: Chat[] = []) => [
        newChat,
        ...old,
      ]);
      onSelectChat(newChat);
    },
    onError: (error) => {
      toast({
        title: "Failed to create chat",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="w-64 border-r bg-muted/50 flex flex-col">
      <div className="p-4">
        <Button
          onClick={() => createChat.mutate()}
          disabled={createChat.isPending}
          className="w-full"
        >
          <MessageSquarePlus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          {chats.map((chat) => (
            <Button
              key={chat.id}
              variant={selectedChat?.id === chat.id ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => onSelectChat(chat)}
            >
              {chat.title}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
