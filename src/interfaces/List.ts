export interface List<T> {
  get(Index: number): T | null;
  add(Object: T): boolean;
  remove(Object: T): boolean;
  contains(Object: T): boolean;
  toArray(): T[];
  size(): number;
}
