/**
 * @author Kofi Boateng
 * This is an implementation of a priority queue. The queue takes in a
 * a comparator lambda expression to configure it either to a min heap
 * or a max heap
 */

export class PriorityQueue<T> {
  private heap: T[] = [];
  private comparator: (a: T, b: T) => number;
  private isMinHeap: boolean;

  constructor(comparator?: (a: T, b: T) => number) {
    this.comparator =
      comparator ||
      ((a: T, b: T) => (a as unknown as number) - (b as unknown as number));
    this.isMinHeap = this.comparator(1 as unknown as T, 2 as unknown as T) < 0;
  }
  /**
   *
   * @param element T
   * @returns void
   * @description Takes in an element and stores it in the correct asorted order
   */
  offer(element: T): void {
    this.heap.push(element);
    this.heapifyUp(this.heap.length - 1);
  }
  /**
   *
   * @returns T
   * @description The poll function will return the min or max element of the heap
   *
   */
  poll(): T | null {
    if (this.isEmpty()) return null;
    const item = this.heap[0];
    this.heap[0] = this.heap[this.heap.length - 1];
    this.heap.pop();
    this.heapifyDown(0);
    return item;
  }
  /**
   *
   * @returns Boolean
   * @description Returns whether the heap is empty or not.
   */
  isEmpty(): boolean {
    return this.heap.length <= 0;
  }
  /**
   *
   * @returns number
   * @description Returns the size of the heap.
   */
  size(): number {
    return this.heap.length;
  }
  /**
   *
   * @param index number
   * @returns void
   * @description This helper function is called after all insertions in order to maintain the heap invariant.
   */
  print(): void {
    console.log(this.heap);
  }
  private heapifyUp(index: number): void {
    if (index > 0) {
      const parentIndex = this.getParent(index);
      if (this.isMinHeap) {
        if (this.comparator(this.heap[index], this.heap[parentIndex]) < 0) {
          this.swap(parentIndex, index);
          this.heapifyUp(parentIndex);
        }
      } else {
        if (this.comparator(this.heap[parentIndex], this.heap[index]) > 0) {
          this.swap(parentIndex, index);
          this.heapifyUp(parentIndex);
        }
      }
    }
  }

  /**
   *
   * @param index number
   * @returns void
   * @description This helper function is called after all poll calls to maintain the heap invariant.
   */
  private heapifyDown(index: number): void {
    if (!this.isLeafNode(index)) {
      if (this.isMinHeap) {
        const smallestChildIndex = this.minChild(index);
        if (
          this.comparator(this.heap[index], this.heap[smallestChildIndex]) > 0
        ) {
          this.swap(smallestChildIndex, index);
          this.heapifyDown(smallestChildIndex);
        }
      } else {
        const biggestChildIndex = this.maxChild(index);
        if (
          this.comparator(this.heap[index], this.heap[biggestChildIndex]) > 0
        ) {
          this.swap(biggestChildIndex, index);
          this.heapifyDown(biggestChildIndex);
        }
      }
    }
  }

  /**
   *
   * @param index number
   * @returns number
   * @description Returns the parent index of the index passed in.
   */
  private getParent(index: number): number {
    return Math.floor((index - 1) / 2);
  }
  /**
   *
   * @param index number
   * @returns boolean
   * @description Returns true if the index passed is a leaf node of the heap tree
   */
  private isLeafNode(index: number): boolean {
    return index == this.heap.length - 1 || index == this.heap.length - 2;
  }
  /**
   *
   * @param index number
   * @returns number
   * @description Returns the index of the minimum child between the index passed. This node will never be a leaf node as it is called after the isLeaf check.
   */
  private minChild(index: number): number {
    const leftChild = 2 * index + 1;
    const rightChild = 2 * index + 2;
    if (this.comparator(this.heap[leftChild], this.heap[rightChild]) < 0) {
      return leftChild;
    }
    return rightChild;
  }

  /**
   *
   * @param index number
   * @returns number
   * @description Returns the index of the max child between the index passed. This node will never be a leaf node as it is called after the isLeaf check.
   */
  private maxChild(index: number): number {
    const leftChild = 2 * index + 1;
    const rightChild = 2 * index + 2;
    if (this.comparator(this.heap[leftChild], this.heap[rightChild]) < 0) {
      return leftChild;
    }
    return rightChild;
  }
  /**
   *
   * @param indexToSwap number
   * @param currIndex number
   * @returns void
   * @description Swaps the elements into the correct ordering
   */
  private swap(indexToSwap: number, currIndex: number): void {
    const temp = this.heap[currIndex];
    this.heap[currIndex] = this.heap[indexToSwap];
    this.heap[indexToSwap] = temp;
  }
}
