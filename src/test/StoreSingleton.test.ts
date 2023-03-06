import "jest";
import { LinkedList } from "../classes/linkedList";
import { Room } from "../classes/roomClass";
import { StoreCacheSingleton } from "../classes/storeSingleton";
import { User } from "../classes/user";
import { Message } from "../types/Message";

describe("Singleton Test Suite", () => {
  test("Singleton instantiation", () => {
    const singleton1 = StoreCacheSingleton.getInstance();
    const singleton2 = StoreCacheSingleton.getInstance();

    expect(singleton1).toStrictEqual(singleton2);
  });

  test("Cache is shared mutatible object", () => {
    const singleton1 = StoreCacheSingleton.getStore();
    singleton1.set(
      "1",
      new Room<string, User>(
        "5",
        "myRoom",
        10,
        new Map<string, User>(),
        new LinkedList<Message>()
      )
    );
    const singleton2 = StoreCacheSingleton.getStore();
    expect(singleton2.get("1")).not.toBeNull();
  });
});
