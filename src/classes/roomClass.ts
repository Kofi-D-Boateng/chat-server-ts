import { Message } from "../types/Message";
import { LinkedList } from "./linkedList";
import { PriorityQueue } from "./priorityQueue";

export class Room<K extends string | number | symbol, V> {
  private key: K;
  private name: string;
  private maxCapacity: number;
  private store: Map<K, V>;
  private messages: LinkedList<Message>;
  constructor(
    key: K,
    name: string,
    maxCapacity: number,
    store: Map<K, V>,
    list: LinkedList<Message>
  ) {
    this.key = key;
    this.name = name;
    this.maxCapacity = maxCapacity;
    this.store = store;
    this.messages = list;
  }

  getKey(): K {
    return this.key;
  }
  getName(): string {
    return this.name;
  }
  getMaxCapcity(): number {
    return this.maxCapacity;
  }
  getStore(): Map<K, V> {
    return this.store;
  }
  getMessages(): LinkedList<Message> {
    return this.messages;
  }

  insertMessage(message: Message): void {
    const minHeap: PriorityQueue<Message> = new PriorityQueue(
      (a: Message, b: Message) => a?.createdAt - b?.createdAt
    );
    const oldMessages = this.messages;
    for (const message of oldMessages) minHeap.offer(message);
    minHeap.offer(message);
    const newMessageList: LinkedList<Message> = new LinkedList();
    while (!minHeap.isEmpty()) {
      const m = minHeap.poll();
      if (m) newMessageList.add(m);
    }
    this.messages.copy(newMessageList);
  }
}
