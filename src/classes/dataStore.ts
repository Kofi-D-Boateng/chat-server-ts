/**
 *
 * Room Store Structure
 * @author Kofi Boateng
 * This class is tasks with store members of a room
 *
 */

// The DataStore Data Structure created here infuse two fundamental data structures, the hashtable and array.
// We will use the map to store the element-type T and its corresponding index in the array, while storing
// the actual elements in the array. I decided to go further with this structure in sure constant time lookup,
// inserts and deletes, in exchange for extra space. This data structure also guards against the off chance
// the hash table suffers from clustering and or other insertion collision that might turn the insert and
// look ups from constant to O(dependant), where dependant is the time complexity of the underlying data
// store (e.g array:n, Linked-List:n, Red-Black Tree:Log(n), etc).

export class DataStore<T> {
  _map: Map<string, number>;
  _array: Array<T>;
  constructor() {
    this._map = new Map<string, number>();
    this._array = new Array<T>();
  }
  // Creates a string hash and inserts element into the map and array.
  // Also guards against duplicate hashing.
  insert(Object: T): void {
    const stringifiedObj = JSON.stringify(Object);
    if (this._map.has(stringifiedObj)) {
      return;
    }

    this._array.push(Object);
    this._map.set(stringifiedObj, this._array.length - 1);
  }
  // Removes an element from the store.
  remove(Object: T): void {
    const stringifiedObj = JSON.stringify(Object);
    if (!this._map.has(stringifiedObj)) {
      return;
    }

    const lastElement: T = this._array[this._array.length - 1];
    const elementToRemoveIndex: number = this._map.get(stringifiedObj)!;
    this._array[this._array.length - 1] = Object;
    this._array[elementToRemoveIndex] = lastElement;

    const newStringifiedObj = JSON.stringify(lastElement);
    this._map.set(newStringifiedObj, elementToRemoveIndex);

    this._array.pop();
  }
  // Returns size of the array instead of keys, since the array houses
  // the actual elements. This implies that both array and map are
  // maintained properly in insertions and removals.
  size(): number {
    return this._array.length;
  }
  // Returns whether a object is in the array or not by checking for its
  // hash equivalent.
  contains(Object: T): boolean {
    const stringifiedObj = JSON.stringify(Object);
    return this._map.has(stringifiedObj);
  }
  // Takes in a DataStore and copies its values. This function is necessary
  // in JavaScript when parsing a stringified class to return its functionality.
  copy(Object: DataStore<T>): void {
    this._array = Object._array;
    this._map = Object._map;
  }
  // Checks whether the store is empty.
  isEmpty(): boolean {
    return this._array.length == 0 && this._map.size == 0;
  }
  // Takes in an Object and will either return the object if it exists or
  // return null, signifying it is absent from the store.
  find(Object: T): T | null {
    return this.get(Object);
  }
  // De-stringifies the object and prints it and its corresponding array index.
  print() {
    console.log("Printing store.......");
    console.log("[");
    for (const [key, val] of this._map) {
      const actualObj = JSON.parse(key);
      console.log(`Object: ${actualObj} --> Position in Array: ${val}`);
    }
    console.log("]");
  }
  // Returns the array of objects.
  toArray(): Array<T> {
    return this._array;
  }
  // Helper function for find (Reference comments on this.find)
  private get(Object: T): T | null {
    const stringifiedObj = JSON.stringify(Object);
    if (!this._map.get(stringifiedObj)) {
      return null;
    }
    return this._array[this._map.get(stringifiedObj) as number];
  }
}
