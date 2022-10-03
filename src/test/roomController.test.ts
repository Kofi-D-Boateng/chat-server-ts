import * as cache from "../utils/redis/query";
import { randomBytes } from "crypto";
import { CreateRoomRequest } from "../types/Request";
import { Room } from "../classes/roomClass";
let roomID: string, data: CreateRoomRequest;
jest.mock("../utils/redis/query");

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
    // const result: Room | null = await cache._createRoom(roomID, data);
    // expect(result).not.toBe(null);
    // expect(result?.key).toBe(roomID);
    // expect(result?.members).not.toBe(null);
  });

  test("_searchRoomFunction", async () => {
    // const resultOne: Room | null = await cache._searchForRoom(roomID);
    // expect(resultOne).toBe(null);
    // await cache._createRoom(roomID, data);
    // const resultTwo: Room | null = await cache._searchForRoom(roomID);
    // expect(resultTwo).toEqual(data);
  });
});
