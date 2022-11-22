import { DataStore } from "./DataStore";
import { LinkedList } from "./linkedList";

export class Room<T> {
  key: string;
  name: string;
  maxCapacity: number;
  store: DataStore<T>;
  constructor(
    key: string,
    name: string,
    maxCapacity: number,
    store: DataStore<T>
  ) {
    this.key = key;
    this.name = name;
    this.maxCapacity = maxCapacity;
    this.store = store;
  }
}
