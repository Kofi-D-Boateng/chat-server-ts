import { List } from "../../interfaces/List";
import { Node } from "../../types/LinkedList";
import { User } from "../../types/User";

// CREATE DOUBLYLINKEDLIST SO WE CAN QUERY FOR THE HEAD
export class LinkedList implements List<any> {
  head: Node;
  length: number;
  constructor(Node: Node, size: number) {
    this.head = Node;
    this.length = size;
  }
  add(member: User): boolean {
    console.log(member);
    member.position = this.length + 1;
    const Node: Node = { val: member, next: null };
    const lastNode: Node | null = this.findNodeByIndex(
      Node.val.position
    ) as Node;
    lastNode.next = Node;
    this.length++;
    return true;
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
  remove(Object: User): boolean {
    const parentNode: Node | null = this.findNodeByIndex(Object.position);
    console.log(parentNode);
    if (parentNode) {
      if (parentNode.next?.val === Object)
        parentNode.next = parentNode.next.next;
      this.length--;
      return true;
    }
    return false;
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
  contains(Object: User): boolean {
    const User: User = Object;
    console.log(User);
    if (!User.position) {
      const parentNode: Node | null = this.findNodeByObject(User);
      console.log(parentNode);
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
    }
  }
  size(): number {
    return this.length;
  }
  update(Object: User): boolean {
    const User: User = Object;
    const parentNode: Node | null = this.findNodeByIndex(User.position);
    if (!parentNode) return false;
    if (!parentNode.next) {
      if (parentNode.val.id.trim().length == 0) {
        parentNode.val.id = Object.id;
      }
      return true;
    }
    if (
      parentNode.next?.val.id.trim().length == 0 &&
      parentNode.next.val.position == Object.position
    ) {
      parentNode.next.val.id = Object.id;
    }
    return true;
  }
  private findNodeByIndex(Index: number): Node | null {
    const parentIndex = Index - 1;
    let currNode: Node | null = this.head;
    let count = 0;
    if (!currNode.next) return currNode;
    while (count != parentIndex) {
      if (currNode.next) currNode = currNode?.next;
      count++;
    }
    return currNode;
  }
  private findNodeByObject(Object: User): Node | null {
    console.log(Object);
    let currNode: Node | null = this.head;
    console.log(currNode);
    if (!currNode.next) return currNode;
    while (currNode && currNode.next) {
      if (currNode.next.val.id === Object.id) break;
      else currNode = currNode.next;
    }
    return currNode.next?.val.id === Object.id ? currNode : null;
  }
}
