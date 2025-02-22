import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyAgswygqTmVvhQ28oZUvjVQVMLdbka4-Jc");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function generateChatResponse(messages: { role: string; content: string }[]) {
  const chat = model.startChat({
    history: messages.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: msg.content,
    })),
  });

  const result = await chat.sendMessage(messages[messages.length - 1].content);
  const response = await result.response;
  return response.text();
}
