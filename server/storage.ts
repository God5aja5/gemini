import { User, InsertUser, Chat, Message } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import fs from "fs/promises";
import path from "path";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createChat(userId: number, title: string): Promise<Chat>;
  getChats(userId: number): Promise<Chat[]>;
  getChat(id: number): Promise<Chat | undefined>;
  
  createMessage(chatId: number, content: string, role: "user" | "assistant"): Promise<Message>;
  getMessages(chatId: number): Promise<Message[]>;
  
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private chats: Map<number, Chat>;
  private messages: Map<number, Message>;
  private nextUserId: number;
  private nextChatId: number;
  private nextMessageId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.chats = new Map();
    this.messages = new Map();
    this.nextUserId = 1;
    this.nextChatId = 1;
    this.nextMessageId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });

    // Create data directory if it doesn't exist
    fs.mkdir(path.join(process.cwd(), "data"), { recursive: true });
  }

  private async persistData(type: string, data: any) {
    await fs.writeFile(
      path.join(process.cwd(), "data", `${type}.json`),
      JSON.stringify(Array.from(data.entries())),
      "utf-8"
    );
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.nextUserId++;
    const user: User = { ...insertUser, id, settings: {} };
    this.users.set(id, user);
    await this.persistData("users", this.users);
    return user;
  }

  async createChat(userId: number, title: string): Promise<Chat> {
    const id = this.nextChatId++;
    const chat: Chat = {
      id,
      userId,
      title,
      createdAt: new Date(),
    };
    this.chats.set(id, chat);
    await this.persistData("chats", this.chats);
    return chat;
  }

  async getChats(userId: number): Promise<Chat[]> {
    return Array.from(this.chats.values()).filter(
      (chat) => chat.userId === userId
    );
  }

  async getChat(id: number): Promise<Chat | undefined> {
    return this.chats.get(id);
  }

  async createMessage(
    chatId: number,
    content: string,
    role: "user" | "assistant"
  ): Promise<Message> {
    const id = this.nextMessageId++;
    const message: Message = {
      id,
      chatId,
      content,
      role,
      createdAt: new Date(),
    };
    this.messages.set(id, message);
    await this.persistData("messages", this.messages);
    return message;
  }

  async getMessages(chatId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter((msg) => msg.chatId === chatId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
}

export const storage = new MemStorage();
