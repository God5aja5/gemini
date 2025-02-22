// AI Model configurations
export type AIModel = {
  id: string;
  name: string;
  provider: "gemini" | "anthropic";
  description: string;
  contextLength: string;
  strengths: string[];
};

export const AI_MODELS: AIModel[] = [
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    provider: "gemini",
    description: "Latest & Most Powerful Gemini Model",
    contextLength: "1M+ tokens",
    strengths: ["Advanced reasoning", "Long-context tasks", "Coding", "Creativity"]
  },
  {
    id: "gemini-1.0-ultra",
    name: "Gemini 1.0 Ultra",
    provider: "gemini",
    description: "High-Performance Model",
    contextLength: "32K tokens",
    strengths: ["General AI tasks", "Code generation", "Multimodal AI"]
  },
  {
    id: "gemini-1.0-pro",
    name: "Gemini 1.0 Pro",
    provider: "gemini",
    description: "Balanced Model",
    contextLength: "32K tokens",
    strengths: ["Chatbots", "Personal assistants", "Content creation"]
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    provider: "anthropic",
    description: "Most Powerful Claude Model",
    contextLength: "200K tokens",
    strengths: ["High-end AI", "Deep reasoning", "Advanced coding"]
  },
  {
    id: "claude-3-sonnet",
    name: "Claude 3 Sonnet",
    provider: "anthropic",
    description: "Balanced Performance Model",
    contextLength: "100K tokens",
    strengths: ["General-purpose AI", "Chatbot assistants", "Research"]
  },
  {
    id: "claude-3-haiku",
    name: "Claude 3 Haiku",
    provider: "anthropic",
    description: "Lightweight & Speed-Focused",
    contextLength: "50K tokens",
    strengths: ["Real-time applications", "Customer service", "Rapid responses"]
  }
];
