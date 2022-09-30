import { List } from "../interfaces/List";
import { User } from "../types/User";
import { Node } from "./node";

/**
 * Doubly Linked List
 * @author Kofi Boateng
 *
 * This class is tasked with implementing a doubly linked list to keep
 * track of members to a room
 *
 *
 */

type Tail = Node | null;
type Head = Node | null;

export class LinkedList implements List<User> {
  head: Head;
  tail: Tail;
  length: number;
  constructor(Node: Head = null, size: number = 0) {
    this.head = Node;
    this.tail = Node;
    this.length = size;
  }
  add(member: User): void {
    const N: Node = new Node(member);
    this.pushBack(N);
  }
  copy(LinkedList: LinkedList): void {
    this.head = LinkedList.head;
    this.tail = LinkedList.tail;
    this.length = LinkedList.length;
  }
  contains(Object: User): boolean {
    const User: User = Object;
    if (User.position == 1) return User.id == this.head?.data.id;
    else if (User.position == this.length) return User.id == this.tail?.data.id;
    else if (User.position > 0) {
      const parentNode = this.findNodeByIndex(User.position);
      return (
        User.position === parentNode?.next?.data.position &&
        User.id == parentNode.next.data.id
      );
    }
    return false;
  }
  get(Object: User): User | null {
    if (Object.position == 1 && this.head) return this.head.data;
    else if (Object.position == this.length && this.tail) return this.tail.data;
    else if (Object.position > 0) {
      const parentNode = this.findNodeByIndex(Object.position);
      if (!parentNode) return null;
      if (!parentNode.next) return null;
      return parentNode.next?.data;
    }
    const parentNode = this.findNodeByObject(Object);
    if (!parentNode) return null;
    if (!parentNode.next) return null;
    return parentNode.next?.data;
  }
  isEmpty(): boolean {
    return this.length <= 0;
  }
  remove(Object: User): void {
    if (this.length == 1) {
      this.head = null;
      this.tail = null;
      this.length = 0;
      return;
    }
    let parentNode: Node | null = this.findNodeByIndex(Object.position);
    if (parentNode) {
      if (
        parentNode.next &&
        parentNode.next.data.position === Object.position
      ) {
        parentNode.next = parentNode.next.next;
        this.length -= 1;
        this.updatePosition();
      } else if (Object.position === 1) {
        const temp: Node | null = parentNode.next;
        temp!.prev = null;
        this.head = temp as Node;
        this.length -= 1;
        this.updatePosition();
      }
    }
  }
  size(): number {
    return this.length;
  }
  toArray(): Array<User> {
    let arr: Array<User> = [],
      i = 0,
      currNode: Head = this.head;
    while (i < this.length) {
      if (currNode?.data != null) {
        const USER: User = {
          id: currNode.data.id,
          position: currNode.data.position,
          username: currNode.data.username,
        };
        arr.push(USER);
        currNode = currNode.next as Node;
      }
      i++;
    }
    return arr;
  }
  private findNodeByIndex(Index: number): Node | null {
    const parentIndex = Index - 1,
      midpoint = this.length / 2;
    if (Index >= midpoint) {
      let currNode: Node | null = this.tail;
      let count = this.length;
      while (count != parentIndex) {
        if (currNode?.prev) currNode = currNode.prev;
        count--;
      }
      return currNode;
    }
    let currNode: Node | null = this.head;
    let count = 1;
    while (count != parentIndex) {
      if (currNode?.next) currNode = currNode?.next;
      count++;
    }
    return currNode;
  }
  private findNodeByObject(Object: User): Node | null {
    let currNode: Node | null = this.head;
    if (!currNode?.next) return currNode;
    while (currNode && currNode.next) {
      if (currNode.next.data.id === Object.id) break;
      else currNode = currNode.next;
    }
    return currNode;
  }
  private pushFront(Node: Node): void {
    if (!this.head) {
      this.head = Node;
      this.tail = Node;
    } else {
      let oldHead = this.head;
      oldHead!.prev = Node;
      Node.next = oldHead;
      oldHead = Node;
    }
    this.length++;
  }
  private pushBack(Node: Node): void {
    Node.data.position = this.length + 1;
    if (!this.head) {
      this.head = Node;
      this.tail = Node;
    } else {
      this.tail!.next = Node;
      Node.prev = this.tail;
      this.tail = Node;
    }
    this.length++;
  }
  private updatePosition(): void {
    const head: Head = this.head;
    let dummy: Node | null = head;
    let count = 0;
    while (count <= this.length && dummy) {
      dummy.data.position = count + 1;
      dummy = dummy.next;
      ++count;
    }
    this.head = head;
  }
}
