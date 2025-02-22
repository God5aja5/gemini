import { Card } from "@/components/ui/card";
import { Message } from "@shared/schema";
import { Bot, User } from "lucide-react";

export function ChatMessage({ message }: { message: Message }) {
  return (
    <Card className={`p-4 ${message.role === "assistant" ? "bg-muted" : ""}`}>
      <div className="flex gap-4">
        <div className="shrink-0">
          {message.role === "assistant" ? (
            <Bot className="h-6 w-6 text-primary" />
          ) : (
            <User className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 prose prose-sm dark:prose-invert">
          <div dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, "<br/>") }} />
        </div>
      </div>
    </Card>
  );
}
