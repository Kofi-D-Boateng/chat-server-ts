import "jest";
import { DataStore } from "../classes/DataStore";

describe("Data Store suite", () => {
  test("Instantiates an empty list", () => {
    const DS: DataStore<number> = new DataStore();
    expect(DS.size()).toBe(0);
    expect(DS.isEmpty()).toBe(true);
  });

  test("Adds multiple elements into the store.", () => {
    const DS: DataStore<number> = new DataStore();
    let n = 10;
    const currSize = DS.size();
    while (n > currSize) {
      DS.insert(n--);
    }
    expect(DS.size()).toBe(10);
    expect(DS.contains(5)).toBe(true);
    expect(DS.find(3)).toBe(3);
  });
  test("Copy a DataStore into a new DataStore", () => {
    const DS1: DataStore<number> = new DataStore();
    let n = 10;
    const currSize = DS1.size();
    while (n >= currSize) {
      DS1.insert(n--);
    }
    const DS2: DataStore<number> = new DataStore();
    DS2.copy(DS1);
    expect(DS2).toEqual(DS1);
  });
  test("Remove an element from the store", () => {
    const DS1: DataStore<number> = new DataStore();
    let n = 10;
    const currSize = DS1.size();
    while (n > currSize) {
      DS1.insert(n--);
    }
    expect(DS1.size()).toBe(10);
    const size = DS1.size();
    let count = 1;
    while (count < size) {
      DS1.remove(count);
      expect(DS1.size()).toBe(size - count);
      expect(DS1.contains(count)).toBe(false);
      count++;
    }
  });
  test("Correct Finds and returns element", () => {
    const DS1: DataStore<number> = new DataStore();
    let n = 10;
    const currSize = DS1.size();
    while (n > currSize) {
      DS1.insert(n--);
    }
    expect(DS1.size()).toBe(10);
    expect(DS1.find(5)).not.toBe(null);
    expect(DS1.find(5)).toBe(5);
  });
  test("Returns correct boolean in contains", () => {
    const DS: DataStore<number> = new DataStore();
    expect(DS.contains(1)).toBe(false);
    DS.insert(5);
    expect(DS.contains(5)).toBe(true);
  });
});
