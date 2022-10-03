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
    if (this.length == 0) {
      this.pushFront(N);
      return;
    }
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
    else {
      const foundNode = this.findNodeByIndex(User.position);
      return (
        foundNode?.data.position === User.position &&
        foundNode.data.id === User.id
      );
    }
  }
  get(Object: User): User | null {
    if (this.length <= 0) return null;
    else if (Object.position == 1 && this.head) return this.head.data;
    else if (Object.position == this.length && this.tail) return this.tail.data;
    else if (Object.position > 0) {
      const foundNode = this.findNodeByIndex(Object.position);
      if (!foundNode) return null;
      return foundNode.data;
    }
    const foundNode = this.findNodeByObject(Object);
    if (!foundNode) return null;
    return foundNode.data;
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
    let foundNode: Node | null = this.findNodeByIndex(Object.position);
    if (this.length == 1) {
      this.head = null;
      this.tail = null;
      this.length = 0;
    } else if (foundNode) {
      if (!foundNode.prev && foundNode.next) {
        // Reposition head node
        let prevHeadNext = foundNode.next;
        prevHeadNext.prev = null;
        this.head = prevHeadNext;
        this.updatePosition();
      } else if (!foundNode.next && foundNode.prev) {
        // Update tail;
        let TailPrev = foundNode.prev;
        TailPrev.next = null;
        this.tail = TailPrev;
        this.updatePosition();
      } else {
        let foundNodePrev = foundNode.prev;
        let foundNodeNext = foundNode.next;
        foundNodePrev!.next = foundNodeNext;
        foundNodeNext!.prev = foundNodePrev;
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
    const midpoint = this.length / 2;
    if (Index >= midpoint) {
      let currNode: Node | null = this.tail;
      let count = this.length;
      while (count != Index) {
        if (currNode?.prev) currNode = currNode.prev;
        count--;
      }
      return currNode;
    }
    let currNode: Node | null = this.head;
    let count = 1;
    while (count != Index) {
      if (currNode?.next) currNode = currNode?.next;
      count++;
    }
    return currNode;
  }
  private findNodeByObject(Object: User): Node | null {
    let currNode: Node | null = this.head;
    if (!currNode?.next) return currNode;
    while (currNode && currNode.data.id != Object.id && currNode.next) {
      currNode = currNode.next;
    }
    return currNode;
  }
  private pushFront(Node: Node): void {
    Node.data.position = this.length + 1;
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
    this.length = count;
  }
}
