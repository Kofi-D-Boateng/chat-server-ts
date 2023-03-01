import { _closeConnection, _init } from "../../config/database/redis";
import { Room } from "../../classes/roomClass";
import { parse, stringify } from "flatted";
import { CONFIG } from "../../config/config";
import { User } from "../../classes/user";
import { DataStore } from "../../classes/dataStore";

const REDIS_URL: string = `redis://${CONFIG.REDIS_HOST}:${CONFIG.REDIS_PORT}`;

const _searchForRoom: (
  key: string
) => Promise<Room<string, User> | null> = async (key: string) => {
  try {
    const redis = await _init(REDIS_URL);
    const r = await redis.GET(key);
    if (!r) throw new Error(`RoomID: ${key} does not exist`);
    const ref: Room<string, User> = await parse(r);
    const store = new DataStore<User>();
    store.copy(ref.getStore());
    const R = new Room<string, User>(
      ref.getKey(),
      ref.getName(),
      ref.getMaxCapcity(),
      null,
      null
    );
    _closeConnection(redis);
    return R;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const _createRoom: (room: Room<string, User>) => void = async (room) => {
  const redis = await _init(REDIS_URL);
  try {
    await redis.SET(room.getKey(), stringify(room));
    _closeConnection(redis);
  } catch (error) {
    console.log(error);
  }
};

const _updateRoom: (Room: Room<string, User>) => void = async (
  Room: Room<string, User>
) => {
  try {
    const redis = await _init(REDIS_URL);
    const r = await redis.GET(Room.getKey());
    if (r) {
      let ref: Room<string, User> = await parse(r);
      ref = Room;
      await redis.SET(ref.getKey(), stringify(ref));
    } else {
      await redis.SET(Room.getKey(), stringify(Room));
    }
    _closeConnection(redis);
  } catch (error) {
    console.log(error);
  }
};

const _deleteRoomFromMemory: (Room: Room<string, User>) => void = async (
  Room: Room<string, User>
) => {
  try {
    const redis = await _init(REDIS_URL);
    const r = await redis.GET(Room.getKey());
    if (r) {
      await redis.DEL(Room.getKey());
    }
    _closeConnection(redis);
  } catch (error) {
    console.log(error);
  }
};

export { _searchForRoom, _updateRoom, _deleteRoomFromMemory, _createRoom };
