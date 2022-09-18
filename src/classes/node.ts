/**
 *
 * @author Kofi Boateng
 *
 * This class is purposed with creating new nodes for List data structures
 *
 */
import { User } from "../types/User";

export class Node {
  next: Node | null;
  prev: Node | null;
  data: User;
  constructor(newData: User) {
    this.next = null;
    this.prev = null;
    this.data = newData;
  }
}
