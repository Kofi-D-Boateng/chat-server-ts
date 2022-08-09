import { User } from "./User";

export type Node = { val: User; next: Node | null };
export type Tail = Node | null;

export type LinkedList = {
  head: Node;
  tail: Tail;
  length: number;
  add(member: User): Promise<number>;
  toArray(): Promise<User[]>;
  remove(User: User): Promise<number>;
  get(Index: number): Promise<Node>;
  exist(User: User): Promise<boolean>;
};
