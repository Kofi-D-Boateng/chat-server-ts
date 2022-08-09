import { List } from "../../interfaces/List";
import { Node, Tail } from "../../types/LinkedList";
import { User } from "../../types/User";

export class LinkedList implements List<User> {
  head: Node;
  private tail: Tail;
  private length: number;
  constructor(Node: Node) {
    this.head = Node;
    this.tail = this.head;
    this.length = 1;
  }
  add(member: User): boolean {
    if (member.position === undefined) member.position = this.length + 1;
    const Node: Node = { val: member, next: null };
    this.tail!.next = Node;
    this.tail = Node;
    this.length++;
    return true;
  }
  toArray(): Array<User> {
    let arr: Array<User> = [],
      i = 0;
    while (i < this.length) {
      if (this.head.val != null) {
        const USER: User = {
          id: this.head.val.id,
          position: this.head.val.position,
          username: this.head.val.username,
        };
        arr.push(USER);
      }
      i++;
    }
    return arr;
  }
  remove(User: User): boolean {
    const parentNode: Node = this.findNode(User.position);
    if (parentNode) {
      if (parentNode.next?.val === User) parentNode.next = parentNode.next.next;
      this.length--;
      return true;
    }
    return false;
  }
  get(Index: number): User | null {
    const parentNode: Node = this.findNode(Index);
    if (!parentNode) return null;
    if (!parentNode.next) return null;
    return parentNode.next?.val;
  }
  contains(Object: User): boolean {
    console.log("Object");
    console.log(Object);
    const User: User = Object;
    const parentNode: Node = this.findNode(User.position);
    console.log("parent node");
    console.log(parentNode);
    if (!parentNode) return false;
    // PARENTNODE IS TOP OF THE LIST
    if (!parentNode.next && this.head === this.tail) {
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
  size(): number {
    return this.length;
  }
  private findNode(Index: number): Node {
    const parentIndex = Index - 1;
    let currNode: Node | null = this.head;
    let count = 0;
    if (!currNode.next) return currNode;
    while (count != parentIndex) {
      if (currNode.next) currNode = currNode?.next;
    }
    return currNode;
  }
}
