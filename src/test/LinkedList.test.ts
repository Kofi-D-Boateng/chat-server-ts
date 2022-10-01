import { randomBytes } from "crypto";
import "jest";
import { LinkedList } from "../classes/linkedList";
import { User } from "../classes/user";

describe("Linked List suite", () => {
  test("Instantiates a empty list", () => {
    const LL = new LinkedList();
    expect(LL.isEmpty()).toBe(true);
    expect(LL.length).toBe(0);
  });
  test("Add elements to list", () => {
    const U1 = new User(randomBytes(8).toString("hex"), undefined, "John Doe");
    const U2 = new User(
      randomBytes(8).toString("hex"),
      undefined,
      "Mike Jones"
    );
    const U3 = new User(
      randomBytes(8).toString("hex"),
      undefined,
      "James Gatlin"
    );
    const LL = new LinkedList();
    LL.add(U1);
    LL.add(U2);
    LL.add(U3);
    expect(LL.isEmpty()).toBe(false);
    expect(LL.size()).toBe(3);
    expect(LL.get(U2)).toBe(U2);
    expect(LL.get(U2)?.position).toBe(2);
  });
  test("Copy L1 to L2", () => {
    const L1 = new LinkedList();
    const size = 10;
    for (let i = 0; i < size; i++) {
      const U1 = new User(
        randomBytes(8).toString("hex"),
        undefined,
        "John Doe"
      );
      L1.add(U1);
    }
    const L2 = new LinkedList();
    L2.copy(L1);
    expect(L1.isEmpty()).toBe(false);
    expect(L1.size()).toBe(size);
    expect(L1.size()).toBe(L2.size());
    expect(L1.tail).toBe(L2.tail);
  });
  test("Removal of an element from the list", () => {
    const U1 = new User(randomBytes(8).toString("hex"), undefined, "John Doe");
    const U2 = new User(
      randomBytes(8).toString("hex"),
      undefined,
      "Mike Jones"
    );
    const U3 = new User(
      randomBytes(8).toString("hex"),
      undefined,
      "James Gatlin"
    );
    const U4 = new User(
      randomBytes(8).toString("hex"),
      undefined,
      "Dustin Buddly"
    );
    const LL = new LinkedList();
    LL.add(U1);
    LL.add(U2);
    LL.add(U3);
    LL.add(U4);
    LL.remove(U2);
    expect(LL.size()).toBe(3);
    expect(LL.contains(U2)).toBe(false);
    expect(LL.get(U3)?.username).toBe(U3.username);
    expect(LL.get(U3)?.position).toBe(2);
  });
  test("Return an array of User", () => {
    const L1 = new LinkedList();
    const size = 10;
    for (let i = 0; i < size; i++) {
      const U1 = new User(
        randomBytes(8).toString("hex"),
        undefined,
        "John Doe"
      );
      L1.add(U1);
    }
    const Array = L1.toArray();
    expect(L1.isEmpty()).toBe(false);
    expect(L1.size()).toBe(Array.length);
    expect(L1.get(Array[0])?.position).toBe(Array[0].position);
  });
});
