import { LinkedList } from "./linkedList";

export class Room {
  key: string;
  name: string;
  maxCapacity: number;
  members: LinkedList;
  constructor(
    key: string,
    name: string,
    maxCapacity: number,
    members: LinkedList
  ) {
    this.key = key;
    this.name = name;
    this.maxCapacity = maxCapacity;
    this.members = members;
  }
}
// export class Room implements HashTableFunctionality {
//   key: string;
//   name: string;
//   maxCapacity: number;
//   members: {
//     table: HashTable<User>;
//     count: number;
//   };
//   constructor(
//     key: string,
//     name: string,
//     maxCapacity: number,
//     hashTable: {
//       table: HashTable<User>;
//       count: number;
//     }
//   ) {
//     this.key = key;
//     this.name = name;
//     this.maxCapacity = maxCapacity;
//     this.members = hashTable;
//   }
//   add(User: User) {
//     this.members.table[User.id] = User;
//     this.members.count++;
//     return 0;
//   }
//   exist(User: User) {
//     return this.members.table[User.id].username == User.username;
//   }
//   remove(User: User) {
//     if (this.members.table[User.id].username == User.username) {
//       delete this.members.table[User.id];
//     }
//     return 0;
//   }
// }
