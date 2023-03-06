import { List } from "../interfaces/List";
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
export class LinkedList<T> implements List<T> {
  private head: Node<T> | null;
  private tail: Node<T> | null;
  private length: number;
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
  getHead(): Node<T> | null {
    return this.head;
  }
  getTail(): Node<T> | null {
    return this.tail;
  }
  add(member: T): void {
    const N: Node<T> = new Node(member);
    if (this.length == 0) {
      this.pushFront(N);
      return;
    }
    this.pushBack(N);
  }
  copy(LinkedList: LinkedList<T>): void {
    this.head = LinkedList.head;
    this.tail = LinkedList.tail;
    this.length = LinkedList.length;
  }
  contains(Object: T): boolean {
    if (!this.head && !this.tail) return false;
    else if (this.head?.data == Object) return true;
    else if (this.tail?.data == Object) return true;
    else {
      const foundNode = this.findNode(Object);
      return foundNode != null;
    }
  }
  get(Object: T): T | null {
    const src: Node<T> = new Node(Object);
    if (this.length <= 0) return null;
    else if (this.head?.data == src.data) return this.head.data;
    else if (this.tail?.data == src.data) return this.tail.data;
    else {
      const foundNode = this.findNode(Object);
      if (!foundNode) return null;
      return foundNode.data;
    }
  }
  isEmpty(): boolean {
    return this.length <= 0;
  }
  remove(Object: T): void {
    if (this.length == 1) {
      this.head = null;
      this.tail = null;
      this.length = 0;
      return;
    }

    let foundNode: Node<T> | null = this.findNode(Object);
    if (foundNode) {
      if (!foundNode.prev && foundNode.next) {
        // Reposition head node
        let prevHeadNext = foundNode.next;
        prevHeadNext.prev = null;
        this.head = prevHeadNext;
      } else if (!foundNode.next && foundNode.prev) {
        // Update tail;
        let TailPrev = foundNode.prev;
        TailPrev.next = null;
        this.tail = TailPrev;
      } else {
        let foundNodePrev = foundNode.prev;
        let foundNodeNext = foundNode.next;
        foundNodePrev!.next = foundNodeNext;
        foundNodeNext!.prev = foundNodePrev;
      }
      this.length--;
    }
  }
  size(): number {
    return this.length;
  }
  toArray(): Array<T> {
    let arr: Array<T> = [],
      i = 0,
      currNode = this.head;
    while (i < this.length) {
      if (currNode?.data != null) {
        arr.push(currNode.data);
        currNode = currNode.next;
      }
      i++;
    }
    return arr;
  }
  private findNode(Object: T): Node<T> | null {
    let currNode = this.head;
    while (currNode) {
      if (currNode.data == Object) return currNode;
      else currNode = currNode.next;
    }
    return null;
  }
  private pushFront(Node: Node<T>): void {
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
  private pushBack(Node: Node<T>): void {
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
  *[Symbol.iterator]() {
    let curr = this.head;
    while (curr) {
      yield curr.data;
      curr = curr.next;
    }
  }
}
