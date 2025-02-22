import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";
import { AIModel, AI_MODELS } from "../shared/ai-models";
import { generateImage } from "./image-service";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyAgswygqTmVvhQ28oZUvjVQVMLdbka4-Jc");
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "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"
});

export async function generateChatResponse(
  messages: { role: string; content: string; type?: string }[],
  modelId: string = "gemini-1.0-pro"
) {
  const model = AI_MODELS.find(m => m.id === modelId);
  if (!model) throw new Error("Invalid model selected");

  // Check if the last message is requesting image generation
  const lastMessage = messages[messages.length - 1];
  if (lastMessage.content.toLowerCase().includes("/imagine") || 
      lastMessage.content.toLowerCase().includes("generate image") ||
      lastMessage.content.toLowerCase().includes("create image")) {
    try {
      const imagePrompt = lastMessage.content.replace(/^\/imagine\s+|generate image\s+|create image\s+/i, '');
      const imageBase64 = await generateImage(imagePrompt);
      return {
        content: `Here's your generated image:\n![Generated Image](data:image/png;base64,${imageBase64})`,
        type: "image"
      };
    } catch (error) {
      return {
        content: "Sorry, I encountered an error while generating the image. Please try again later.",
        type: "text"
      };
    }
  }

  // Handle regular text chat with context
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
    return {
      content: response.text(),
      type: "text"
    };
  } else {
    const response = await anthropic.messages.create({
      model: model.id,
      max_tokens: 1024,
      messages: messages.map(msg => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content
      }))
    });

    return {
      content: response.content[0].text,
      type: "text"
    };
  }
}