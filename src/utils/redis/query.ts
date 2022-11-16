import { _closeConnection, _init } from "../../config/database/redis";
import { LinkedList } from "../../classes/linkedList";
import { CreateRoomRequest } from "../../types/Request";
import { Room } from "../../classes/roomClass";
import { parse, stringify } from "flatted";
import { CONFIG } from "../../config/config";
import { User } from "../../classes/user";
import { DataStore } from "../../classes/dataStore";
const REDIS_URL: string = `redis://${CONFIG.REDIS_HOST}:${CONFIG.REDIS_PORT}`;

const _searchForRoom: (key: string) => Promise<Room<User> | null> = async (
  key: string
) => {
  try {
    const redis = await _init(REDIS_URL);
    const r = await redis.GET(key);
    if (!r) throw new Error(`RoomID: ${key} does not exist`);
    const ref: Room<User> = await parse(r);
    const store = new DataStore<User>();
    store.copy(ref.store);
    const R = new Room<User>(ref.key, ref.name, ref.maxCapacity, store);
    _closeConnection(redis);
    return R;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const _createRoom: (
  key: string,
  room: CreateRoomRequest
) => Promise<Room<User> | null> = async (
  key: string,
  request: CreateRoomRequest
) => {
  const redis = await _init(REDIS_URL);
  const store = new DataStore<User>();
  let roomRef: Room<User> = new Room<User>(
    key,
    request.name,
    request.capacity,
    store
  );
  try {
    const r = await redis.GET(key);
    if (r) {
      throw new Error("Duplicate Hash generated");
    }
    await redis.SET(key, stringify(roomRef));
    _closeConnection(redis);
    return roomRef;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const _updateRoom: (Room: Room<User>) => void = async (Room: Room<User>) => {
  try {
    const redis = await _init(REDIS_URL);
    const r = await redis.GET(Room.key);
    if (r) {
      let ref: Room<User> = await parse(r);
      ref = Room;
      await redis.SET(ref.key, stringify(ref));
    } else {
      await redis.SET(Room.key, stringify(Room));
    }
    _closeConnection(redis);
  } catch (error) {
    console.log(error);
  }
};

const _deleteRoomFromMemory: (Room: Room<User>) => void = async (
  Room: Room<User>
) => {
  try {
    const redis = await _init(REDIS_URL);
    const r = await redis.GET(Room.key);
    if (r) {
      await redis.DEL(Room.key);
    }
    _closeConnection(redis);
  } catch (error) {
    console.log(error);
  }
};

export { _searchForRoom, _updateRoom, _deleteRoomFromMemory, _createRoom };
