import { Card } from "@/components/ui/card";
import { Message } from "@shared/schema";
import { Bot, User, Copy, Share, Download, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

// Function to detect code blocks in text
function extractCodeBlocks(content: string) {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const blocks = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      blocks.push({
        type: 'text',
        content: content.slice(lastIndex, match.index)
      });
    }

    // Add code block
    blocks.push({
      type: 'code',
      language: match[1] || 'plaintext',
      content: match[2].trim()
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    blocks.push({
      type: 'text',
      content: content.slice(lastIndex)
    });
  }

  return blocks;
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [expanded, setExpanded] = useState(false);
  const { toast } = useToast();
  const maxLines = 15;
  const lines = code.split('\n').length;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    toast({
      description: "Code copied to clipboard",
    });
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${language || 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative mt-4 mb-4">
      <div className="absolute right-2 top-2 flex gap-2">
        <Button variant="ghost" size="icon" onClick={handleCopy}>
          <Copy className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleDownload}>
          <Download className="h-4 w-4" />
        </Button>
      </div>
      <div className={`relative ${!expanded && lines > maxLines ? 'max-h-[24rem] overflow-hidden' : ''}`}>
        <SyntaxHighlighter
          language={language}
          style={atomOneDark}
          customStyle={{
            margin: 0,
            borderRadius: '0.5rem',
            padding: '2.5rem 1rem 1rem 1rem',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
      {lines > maxLines && (
        <Button
          variant="ghost"
          className="w-full mt-2 flex items-center justify-center gap-2"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              Show more
            </>
          )}
        </Button>
      )}
    </div>
  );
}

export function ChatMessage({ message }: { message: Message }) {
  const blocks = message?.content ? extractCodeBlocks(message.content) : [];

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
          {blocks.map((block, index) => (
            block.type === 'code' ? (
              <CodeBlock key={index} code={block.content} language={block.language} />
            ) : (
              <div key={index} className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: block.content.replace(/\n/g, "<br/>") }} />
            )
          ))}
        </div>
      </div>
    </Card>
  );
}