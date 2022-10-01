import { LinkedList } from "./linkedList";

export class Room {
  key: string;
  name: string;
  maxCapacity: number;
  members: LinkedList;
  constructor(
    key: string,
    name: string,
    maxCapacity: number,
    members: LinkedList
  ) {
    this.key = key;
    this.name = name;
    this.maxCapacity = maxCapacity;
    this.members = members;
  }
}
