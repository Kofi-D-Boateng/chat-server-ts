import { Room } from "./roomClass";
import { User } from "./user";

export class StoreCacheSingleton {
  private static instance: StoreCacheSingleton;
  private static readonly cache: Map<string, Room<string, User>> = new Map();

  constructor() {
    if (!StoreCacheSingleton.instance) {
      StoreCacheSingleton.instance = this;
      return this;
    }
    return StoreCacheSingleton.instance;
  }

  public static getInstance(): StoreCacheSingleton {
    if (!StoreCacheSingleton.instance) {
      StoreCacheSingleton.instance = new StoreCacheSingleton();
    }
    return StoreCacheSingleton.instance;
  }

  public static getStore(): Map<string, Room<string, User>> {
    if (!StoreCacheSingleton.instance) {
      StoreCacheSingleton.instance = new StoreCacheSingleton();
    }
    return StoreCacheSingleton.cache;
  }
}
