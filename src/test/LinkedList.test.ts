import "jest";
import { randomBytes } from "crypto";
import { User } from "../classes/user";
import { Message } from "../types/Message";
import { LinkedList } from "../classes/linkedList";

describe("Linked List suite", () => {
  test("Instantiates a empty list", () => {
    const LL = new LinkedList<number>();
    expect(LL.isEmpty()).toBe(true);
    expect(LL.size()).toBe(0);
  });
  test("Add elements to list", () => {
    const U1 = new User(
      randomBytes(8).toString("hex"),
      "John Doe",
      new Set<Message>()
    );
    const U2 = new User(
      randomBytes(8).toString("hex"),
      "Mike Jones",
      new Set<Message>()
    );
    const U3 = new User(
      randomBytes(8).toString("hex"),
      "James Gatlin",
      new Set<Message>()
    );
    const LL = new LinkedList<User>();
    LL.add(U1);
    LL.add(U2);
    LL.add(U3);
    expect(LL.isEmpty()).toBe(false);
    expect(LL.size()).toBe(3);
    expect(LL.get(U2)).toBe(U2);
  });
  test("Copy L1 to L2", () => {
    const L1 = new LinkedList();
    const size = 10;
    for (let i = 0; i < size; i++) {
      const U1 = new User(
        randomBytes(8).toString("hex"),
        "John Doe",
        new Set<Message>()
      );
      L1.add(U1);
    }
    const L2 = new LinkedList();
    L2.copy(L1);
    expect(L1.isEmpty()).toBe(false);
    expect(L1.size()).toBe(size);
    expect(L1.size()).toBe(L2.size());
    expect(L1.getTail()).toBe(L2.getTail());
  });
  test("Removal of an element from the list", () => {
    const U1 = new User(
      randomBytes(8).toString("hex"),
      "John Doe",
      new Set<Message>()
    );
    const U2 = new User(
      randomBytes(8).toString("hex"),
      "Mike Jones",
      new Set<Message>()
    );
    const U3 = new User(
      randomBytes(8).toString("hex"),
      "James Gatlin",
      new Set<Message>()
    );
    const U4 = new User(
      randomBytes(8).toString("hex"),
      "Dustin Buddly",
      new Set<Message>()
    );
    const LL = new LinkedList<User>();
    LL.add(U1);
    LL.add(U2);
    LL.add(U3);
    LL.add(U4);
    LL.remove(U2);
    expect(LL.size()).toBe(3);
    expect(LL.contains(U2)).toBe(false);
    expect(LL.get(U3)?.getUsername()).toBe(U3.getUsername());
  });
  test("Return an array of User", () => {
    const L1 = new LinkedList();
    const size = 10;
    for (let i = 0; i < size; i++) {
      const U1 = new User(
        randomBytes(8).toString("hex"),
        "John Doe",
        new Set<Message>()
      );
      L1.add(U1);
    }
    const Array = L1.toArray();
    const ArraySpot2 = Array[1];
    expect(L1.isEmpty()).toBe(false);
    expect(L1.size()).toBe(Array.length);
    expect(L1.get(Array[1])).toEqual(ArraySpot2);
  });
});
