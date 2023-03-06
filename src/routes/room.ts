import { randomBytes } from "crypto";
import express, { Response, Request } from "express";
import { Room } from "../classes/roomClass";
import { User } from "../classes/user";
import { CONFIG } from "../config/config";
import { CreateRoomRequest } from "../types/Request";
import { _createRoom, _searchForRoom } from "../utils/redis/query";
import { StoreCacheSingleton } from "../classes/storeSingleton";
import { LinkedList } from "../classes/linkedList";
import { Message } from "../types/Message";
const router = express.Router();
const cache = StoreCacheSingleton.getStore();

router.get("/find-room", async (Req: Request, Res: Response) => {
  const key = Req.query["key"] as string;
  const room = cache.get(key);
  if (room) {
    if (room.getStore().size + 1 > room.getMaxCapcity()) {
      Res.status(400).json({ message: "full" });
    } else {
      Res.status(200).json({ message: "found", roomName: room.getName() });
    }
  } else {
    Res.status(400).json({ message: "not found" });
  }
});

router.post("/create-room", async (Req: Request, Res: Response) => {
  const data: CreateRoomRequest = Req.body;
  const ROOMID: string = randomBytes(CONFIG.ROOM_CONFIG.LENGTH_OF_ID).toString(
    CONFIG.ROOM_CONFIG.ROOM_ID_FORMAT as BufferEncoding
  );
  let isGenerated: boolean = false;
  while (!isGenerated) {
    isGenerated = true;
    const result = cache.get(ROOMID);
    if (!result) {
      const ROOM: Room<string, User> = new Room(
        ROOMID,
        data.name,
        data.capacity,
        new Map<string, User>(),
        new LinkedList<Message>()
      );
      cache.set(ROOMID, ROOM);
    } else {
      isGenerated = false;
    }
  }
  Res.status(200).json({ roomID: ROOMID });
});

export default router;
