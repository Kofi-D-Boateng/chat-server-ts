export interface List<T> {
  getByIndex(Index: number): T | null;
  getByObject(Object: T): T | null;
  add(Object: T): boolean;
  remove(Object: T): boolean;
  contains(Object: T): boolean;
  toArray(): T[];
  size(): number;
}
