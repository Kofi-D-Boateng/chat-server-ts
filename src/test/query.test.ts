import { randomBytes } from "crypto";
import { CreateRoomRequest } from "../types/Request";
import { Room } from "../classes/roomClass";
import { User } from "../classes/user";
import { DataStore } from "../classes/dataStore";
let roomID: string, data: CreateRoomRequest;
const _createRoom = jest.fn();
const _searchForRoom = jest.fn();
const _updateRoom = jest.fn();
const _deleteRoomFromMemory = jest.fn();
describe("Redis Caching suite", () => {
  beforeAll(() => {
    roomID = randomBytes(12).toString("hex");
    data = {
      name: "Team Meeting",
      capacity: 5,
      username: "Kofi Boateng",
    };
  });

  test("_createRoomFunction", async () => {
    // const fakeInMemoryRedis: Map<string, Room<User>> = new Map();
    // _createRoom.mockImplementation((key: string, data: CreateRoomRequest) => {
    //   if (!fakeInMemoryRedis.has(key)) {
    //     return new Room<User>(key, data.name, data.capacity, new DataStore());
    //   }
    //   return null;
    // });
    // const result: Room<User> | null = await _createRoom(roomID, data);
    // expect(_createRoom).toHaveBeenCalledWith(roomID, data);
    // expect(result).not.toBe(null);
    // expect(result?.key).toBe(roomID);
    // expect(result?.store.size()).toBe(0);
  });

  // test("_searchRoomFunction", async () => {
  //   const fakeInMemoryRedis: Map<string, Room<User>> = new Map();
  //   _searchForRoom.mockImplementation((key: string) => {
  //     if (!fakeInMemoryRedis.has(key)) {
  //       return null;
  //     }
  //     return fakeInMemoryRedis.get(key);
  //   });
  //   const resultOne: Room<User> | null = await _searchForRoom(roomID);
  //   expect(resultOne).toBe(null);
  //   const R = new Room<User>(roomID, data.name, data.capacity, new DataStore());
  //   fakeInMemoryRedis.set(R.key, R);
  //   const resultTwo: Room<User> | null = await _searchForRoom(roomID);
  //   expect(resultTwo?.key).toEqual(roomID);
  // });

  // test("_updateRoomFunction", async () => {
  //   const fakeInMemoryRedis: Map<string, Room<User>> = new Map();
  //   const R: Room<User> = new Room(
  //     roomID,
  //     data.name,
  //     data.capacity,
  //     new DataStore()
  //   );
  //   fakeInMemoryRedis.set(R.key, R);
  //   const USER = new User(randomBytes(6).toString("hex"), data.username);
  //   R.store.insert(USER);
  //   const result = await _updateRoom(R);
  //   _updateRoom.mockImplementation((arg: Room<User>) => {
  //     if (fakeInMemoryRedis.has(arg.key)) {
  //       const oldRoom = fakeInMemoryRedis.get(arg.key);
  //       expect(oldRoom?.store).not.toEqual(arg.store);
  //       fakeInMemoryRedis.set(arg.key, arg);
  //       return;
  //     }
  //     fakeInMemoryRedis.set(arg.key, arg);
  //   });
  //   expect(_updateRoom).toBeCalledWith(R);
  //   expect(result).toBe(undefined);
  //   expect(fakeInMemoryRedis.get(R.key)?.store.size()).toBe(1);
  // });
  // test("_deleteRoomFromMemoryFunction", async () => {
  //   const fakeInMemoryRedis: Map<string, Room<User>> = new Map();
  //   const R: Room<User> = new Room(
  //     roomID,
  //     data.name,
  //     data.capacity,
  //     new DataStore()
  //   );
  //   fakeInMemoryRedis.set(R.key, R);

  //   _deleteRoomFromMemory.mockImplementation((arg: Room<User>) => {
  //     if (fakeInMemoryRedis.has(arg.key)) {
  //       fakeInMemoryRedis.delete(arg.key);
  //       expect(fakeInMemoryRedis.get(arg.key)).toBe(undefined);
  //       return;
  //     }
  //     expect(fakeInMemoryRedis.has(arg.key)).toBe(false);
  //   });
  //   const result = await _deleteRoomFromMemory(R);
  //   expect(_deleteRoomFromMemory).toBeCalledWith(R);
  //   expect(result).toBe(undefined);
  // });
});
