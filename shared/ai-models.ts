// AI Model configurations
export type AIModel = {
  id: string;
  name: string;
  provider: "gemini" | "anthropic" | "groq";
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
  },
  // Groq Production Models
  {
    id: "gemma2-9b-it",
    name: "Gemma 2 9B IT",
    provider: "groq",
    description: "Fast & Efficient Model",
    contextLength: "8K tokens",
    strengths: ["Fast inference", "Code generation", "General tasks"]
  },
  {
    id: "llama-3.3-70b-versatile",
    name: "LLaMA 3.3 70B Versatile",
    provider: "groq",
    description: "Large Versatile Model",
    contextLength: "4K tokens",
    strengths: ["Versatile tasks", "Complex reasoning", "Knowledge"]
  },
  {
    id: "llama-3.1-8b-instant",
    name: "LLaMA 3.1 8B Instant",
    provider: "groq",
    description: "Fast Response Model",
    contextLength: "4K tokens",
    strengths: ["Quick responses", "Basic tasks", "Efficiency"]
  },
  {
    id: "llama-guard-3-8b",
    name: "LLAMA Guard 3 8B",
    provider: "groq",
    description: "Safety-Focused Model",
    contextLength: "4K tokens",
    strengths: ["Content safety", "Moderation", "Guidelines compliance"]
  },
  {
    id: "llama3-70b-8192",
    name: "LLaMA 3 70B",
    provider: "groq",
    description: "Large Context Model",
    contextLength: "8K tokens",
    strengths: ["Long context", "Complex tasks", "Detailed responses"]
  },
  {
    id: "llama3-8b-8192",
    name: "LLaMA 3 8B",
    provider: "groq",
    description: "Efficient Large Context",
    contextLength: "8K tokens",
    strengths: ["Fast processing", "Long context", "Balanced performance"]
  },
  {
    id: "mixtral-8x7b-32768",
    name: "Mixtral 8x7B",
    provider: "groq",
    description: "Large Context MoE Model",
    contextLength: "32K tokens",
    strengths: ["Very long context", "Mixture of experts", "Advanced reasoning"]
  },
  // Groq Preview Models
  {
    id: "qwen-2.5-32b",
    name: "Qwen 2.5 32B",
    provider: "groq",
    description: "Preview: Advanced Chinese-English Model",
    contextLength: "8K tokens",
    strengths: ["Multilingual", "General knowledge", "Creative tasks"]
  },
  {
    id: "deepseek-r1-distill-qwen-32b",
    name: "DeepSeek R1 Qwen 32B",
    provider: "groq",
    description: "Preview: Distilled Knowledge Model",
    contextLength: "8K tokens",
    strengths: ["Efficient reasoning", "Knowledge distillation", "Fast inference"]
  },
  {
    id: "deepseek-r1-distill-llama-70b",
    name: "DeepSeek R1 LLaMA 70B",
    provider: "groq",
    description: "Preview: Large Distilled Model",
    contextLength: "8K tokens",
    strengths: ["Complex reasoning", "Knowledge compression", "Efficient processing"]
  },
  {
    id: "llama-3.2-1b-preview",
    name: "LLaMA 3.2 1B",
    provider: "groq",
    description: "Preview: Tiny Fast Model",
    contextLength: "4K tokens",
    strengths: ["Ultra-fast responses", "Basic tasks", "Minimal resource usage"]
  },
  {
    id: "llama-3.2-3b-preview",
    name: "LLaMA 3.2 3B",
    provider: "groq",
    description: "Preview: Small Efficient Model",
    contextLength: "4K tokens",
    strengths: ["Fast processing", "General tasks", "Resource efficiency"]
  }
];