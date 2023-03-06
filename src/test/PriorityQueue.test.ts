import "jest";
import { PriorityQueue } from "../classes/priorityQueue";

describe("PriorityQueue Test Suite", () => {
  test("Min Heap Queue", () => {
    const minHeap: PriorityQueue<number> = new PriorityQueue();
    const minHeap2: PriorityQueue<number> = new PriorityQueue();
    const arr = new Array<number>();
    for (let i = 0; i < 10; i++) arr.push(Math.floor(Math.random() * 100));
    for (const n of arr) minHeap.offer(n), minHeap2.offer(n);
    for (const n of arr) {
      expect(minHeap.poll()).toEqual(minHeap2.poll());
    }
  });
  test("Max Heap Queue", () => {
    const maxHeap: PriorityQueue<number> = new PriorityQueue((a, b) => b - a);
    const maxHeap2: PriorityQueue<number> = new PriorityQueue((a, b) => b - a);
    const arr = new Array<number>();
    for (let i = 0; i < 10; i++) arr.push(Math.floor(Math.random() * 100));
    for (const n of arr) maxHeap.offer(n), maxHeap2.offer(n);
    for (const n of arr) {
      expect(maxHeap.poll()).toEqual(maxHeap2.poll());
    }
  });
  test("Size is incrementing correcting", () => {
    const minHeap: PriorityQueue<number> = new PriorityQueue();
    expect(minHeap.size()).toBe(0);
    for (let i = 0; i < 10; i++) {
      minHeap.offer(i);
    }
    expect(minHeap.size()).toBe(10);
  });

  test("Whether heap is empty or not", () => {
    const minHeap: PriorityQueue<number> = new PriorityQueue();
    expect(minHeap.isEmpty()).toBeTruthy();
    for (let i = 0; i < 10; i++) {
      minHeap.offer(i);
    }
    expect(minHeap.isEmpty()).toBeFalsy();
  });
});
