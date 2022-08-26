import { List } from "../interfaces/List";
import { Node } from "../types/LinkedList";
import { User } from "../types/User";

// SINGLY LINKEDLIST
export class LinkedList implements List<User> {
  head: Node;
  length: number;
  constructor(Node: Node, size: number) {
    this.head = Node;
    this.length = size;
  }
  add(member: User): boolean {
    member.position = this.length + 1;
    const Node: Node = { val: member, next: null };
    const lastNode: Node | null = this.findNodeByIndex(
      Node.val.position
    ) as Node;
    lastNode.next = Node;
    this.length++;
    return true;
  }
  contains(Object: User): boolean {
    const User: User = Object;
    if (!User.position) {
      const parentNode: Node | null = this.findNodeByObject(User);
      // CHECKS IF HEAD EXIST
      if (!parentNode) return false;
      // FAIL-SAFE TO CHECK FOR HEAD SINCE THIS IS A SINGLY-LL
      else if (parentNode.val.position === 1 && User.position === 1)
        return true;
      else if (!parentNode.next) {
        return (
          User.position === parentNode.val.position &&
          User.username === parentNode.val.username
        );
      }
      return (
        User.position === parentNode.next?.val.position &&
        User.username === parentNode.next.val.username
      );
    } else {
      const parentNode: Node | null = this.findNodeByIndex(User.position);
      // CHECKS IF HEAD EXIST
      if (!parentNode) return false;
      // FAIL-SAFE TO CHECK FOR HEAD SINCE THIS IS A SINGLY-LL
      else if (parentNode.val.position === 1 && User.position === 1)
        return true;
      return (
        User.position === parentNode.next?.val.position &&
        User.username === parentNode.next.val.username
      );
    }
  }
  getByIndex(Index: number): User | null {
    const parentNode: Node | null = this.findNodeByIndex(Index);
    if (!parentNode) return null;
    if (!parentNode.next) return null;
    return parentNode.next?.val;
  }
  getByObject(Object: User): User | null {
    const parentNode = this.findNodeByObject(Object);
    if (!parentNode) return null;
    if (!parentNode.next) return null;
    return parentNode.next?.val;
  }
  remove(Object: User): boolean {
    let parentNode: Node | null = this.findNodeByIndex(Object.position);
    if (parentNode) {
      if (
        parentNode.next?.val &&
        parentNode.next.val.position === Object.position
      ) {
        parentNode.next = parentNode.next.next;
        this.length -= 1;
        this.updatePosition(this.head, this.length);
        return true;
      } else if (Object.position === 1) {
        const temp: Node | null = parentNode.next;
        this.head = temp as Node;
        this.length -= 1;
        this.updatePosition(this.head, this.length);
        return true;
      }
    }
    return false;
  }
  size(): number {
    return this.length;
  }
  toArray(): Array<User> {
    let arr: Array<User> = [],
      i = 0,
      currNode: Node = this.head;
    while (i < this.length) {
      if (currNode.val != null) {
        const USER: User = {
          id: currNode.val.id,
          position: currNode.val.position,
          username: currNode.val.username,
        };
        arr.push(USER);
        currNode = currNode.next as Node;
      }
      i++;
    }
    return arr;
  }
  update(Object: User): void {
    const User: User = Object;
    const parentNode: Node | null = this.findNodeByIndex(User.position);
    if (!parentNode) return;
    if (!parentNode.next) {
      if (parentNode.val.id.trim().length == 0) {
        parentNode.val.id = Object.id;
      }
      return;
    }
    if (
      parentNode.next?.val.id.trim().length == 0 &&
      parentNode.next.val.position == Object.position
    ) {
      parentNode.next.val.id = Object.id;
    }
    return;
  }
  private findNodeByIndex(Index: number): Node | null {
    const parentIndex = Index - 1;
    let currNode: Node | null = this.head;
    let count = 1;
    if (!currNode.next) return currNode;
    if (parentIndex === 0) return currNode;
    while (count != parentIndex) {
      if (currNode.next) currNode = currNode?.next;
      count++;
    }
    return currNode;
  }
  private findNodeByObject(Object: User): Node | null {
    let currNode: Node | null = this.head;
    if (!currNode.next) return currNode;
    while (currNode && currNode.next) {
      if (currNode.next.val.id === Object.id) break;
      else currNode = currNode.next;
    }
    return currNode;
  }
  private updatePosition(node: Node, listLength: number): void {
    const head: Node = node;
    let dummy: Node | null = head;
    let count = 0;
    while (count <= listLength && dummy) {
      dummy.val.position = count + 1;
      dummy = dummy.next;
      ++count;
    }
    this.head = head;
  }
}
