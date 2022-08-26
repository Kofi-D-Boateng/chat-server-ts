import redis from "../../config/database/redis";
import { LinkedList } from "../../classes/linkedList";
import { User } from "../../types/User";
import { CreateRoomRequest } from "../../types/Request";
import { Node } from "../../types/LinkedList";
import { Room } from "../../classes/roomClass";

const _searchForRoom: (key: string) => Promise<Room | null> = async (
  key: string
) => {
  try {
    const r = await redis.GET(key);
    if (!r) throw new Error("Does not exist");
    const ref: Room = await JSON.parse(r);
    const LL: LinkedList = new LinkedList(ref.members.head, ref.members.length);
    const R = new Room(ref.key, ref.name, ref.maxCapacity, LL);
    return R;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const _createRoom: (
  key: string,
  room: CreateRoomRequest
) => Promise<Room | null> = async (key: string, request: CreateRoomRequest) => {
  const USER: User = { id: "", position: 1, username: request.username };
  const Node: Node = { val: USER, next: null };
  const LL: LinkedList = new LinkedList(Node, 1);
  let roomRef: Room = new Room(key, request.name, request.capacity, LL);
  try {
    const r = await redis.GET(key);
    if (r) {
      throw new Error("Duplicate Hash generated");
    }
    await redis.SET(key, JSON.stringify(roomRef));
    return roomRef;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const _updateRoom: (Room: Room) => void = async (Room: Room) => {
  try {
    const r = await redis.GET(Room.key);
    if (r) {
      let ref: Room = await JSON.parse(r);
      ref = Room;
      await redis.SET(ref.key, JSON.stringify(ref));
    } else {
      await redis.SET(Room.key, JSON.stringify(Room));
    }
  } catch (error) {
    console.log(error);
  }
};

const _deleteRoomFromMemory: (Room: Room) => void = async (Room: Room) => {
  try {
    const r = await redis.GET(Room.key);
    if (r) {
      await redis.DEL(Room.key);
    }
  } catch (error) {
    console.log(error);
  }
};

export { _searchForRoom, _updateRoom, _deleteRoomFromMemory, _createRoom };
