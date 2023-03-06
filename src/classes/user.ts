import { Message } from "../types/Message";

export class User {
  private id: string;
  private username: string;
  private messages: Set<Message>;
  constructor(id: string, username: string, messages: Set<Message>) {
    this.id = id;
    this.username = username;
    this.messages = messages;
  }

  getId(): string {
    return this.id;
  }
  getUsername(): string {
    return this.username;
  }
  getMessages(): Set<Message> {
    return this.messages;
  }
}
