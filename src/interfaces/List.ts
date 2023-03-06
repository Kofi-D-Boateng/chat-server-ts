export interface List<T> {
  get(Object: T): T | null;
  add(Object: T): void;
  remove(Object: T): void;
  contains(Object: T): boolean;
  toArray(): Array<T>;
  size(): number;
  isEmpty(): boolean;
  [Symbol.iterator](): Iterator<T>;
}
