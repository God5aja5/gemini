import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { generateChatResponse } from "./ai-service";
import { insertChatSchema, insertMessageSchema } from "@shared/schema";
import { ZodError } from "zod";
import { isAdmin } from "./admin-middleware";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Admin routes
  app.get("/api/admin/users", isAdmin, async (req, res) => {
    const users = await storage.getAllUsers();
    res.json(users);
  });

  app.get("/api/admin/chats", isAdmin, async (req, res) => {
    const chats = await storage.getAllChats();
    res.json(chats);
  });

  app.get("/api/admin/messages", isAdmin, async (req, res) => {
    const messages = await storage.getAllMessages();
    res.json(messages);
  });

  // Existing routes
  app.get("/api/chats", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const chats = await storage.getChats(req.user.id);
    res.json(chats);
  });

  app.post("/api/chats", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    try {
      const data = insertChatSchema.parse(req.body);
      const chat = await storage.createChat(req.user.id, data.title, data.modelId);
      res.json(chat);
    } catch (e) {
      if (e instanceof ZodError) {
        res.status(400).json(e.errors);
      } else {
        throw e;
      }
    }
  });

  app.patch("/api/chats/:chatId", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const chat = await storage.getChat(parseInt(req.params.chatId));
    if (!chat || chat.userId !== req.user.id) {
      return res.sendStatus(404);
    }
    const updatedChat = await storage.updateChat(chat.id, req.body);
    res.json(updatedChat);
  });

  app.get("/api/chats/:chatId/messages", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const chat = await storage.getChat(parseInt(req.params.chatId));
    if (!chat || chat.userId !== req.user.id) {
      return res.sendStatus(404);
    }
    const messages = await storage.getMessages(chat.id);
    res.json(messages);
  });

  app.post("/api/chats/:chatId/messages", async (req, res) => {
    if (!req.user) return res.sendStatus(401);

    try {
      const chat = await storage.getChat(parseInt(req.params.chatId));
      if (!chat || chat.userId !== req.user.id) {
        return res.sendStatus(404);
      }

      const data = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(
        chat.id,
        data.content,
        data.role
      );

      if (data.role === "user") {
        const messages = await storage.getMessages(chat.id);
        const aiResponse = await generateChatResponse(
          messages.map(m => ({ role: m.role, content: m.content })),
          chat.modelId
        );
        const aiMessage = await storage.createMessage(
          chat.id,
          aiResponse,
          "assistant"
        );
        res.json([message, aiMessage]);
      } else {
        res.json([message]);
      }
    } catch (e) {
      if (e instanceof ZodError) {
        res.status(400).json(e.errors);
      } else {
        throw e;
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}