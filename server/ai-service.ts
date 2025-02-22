import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";
import { AIModel, AI_MODELS } from "../shared/ai-models";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyAgswygqTmVvhQ28oZUvjVQVMLdbka4-Jc");
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "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"
});

export async function generateChatResponse(
  messages: { role: string; content: string }[],
  modelId: string = "gemini-1.0-pro"
) {
  const model = AI_MODELS.find(m => m.id === modelId);
  if (!model) throw new Error("Invalid model selected");

  if (model.provider === "gemini") {
    const geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chat = geminiModel.startChat({
      history: messages.map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
    });

    const result = await chat.sendMessage(messages[messages.length - 1].content);
    const response = await result.response;
    return response.text();
  } else {
    const response = await anthropic.messages.create({
      model: model.id,
      max_tokens: 1024,
      messages: messages.map(msg => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content
      }))
    });

    return response.content[0].text;
  }
}