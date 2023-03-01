/**
 *
 * @author Kofi Boateng
 *
 * This class is purposed with creating new nodes for List data structures
 *
 */
export class Node<T> {
  next: Node<T> | null;
  prev: Node<T> | null;
  data: T;
  constructor(newData: T) {
    this.next = null;
    this.prev = null;
    this.data = newData;
  }
}
