import { User } from "../types/User";

export interface HashTableFunctionality {
  add: (User: User) => Promise<number>;
  exist: (User: User) => Promise<boolean>;
  remove: (User: User) => Promise<number>;
}
