import { randomBytes } from "crypto";
import express, { Response, Request } from "express";
import { DataStore } from "../classes/dataStore";
import { Room } from "../classes/roomClass";
import { User } from "../classes/user";
import { CONFIG } from "../config/config";
import { CreateRoomRequest } from "../types/Request";
import { _createRoom, _searchForRoom } from "../utils/redis/query";
const router = express.Router();

router.get("/find-room", async (Req: Request, Res: Response) => {
  const key = Req.query["key"] as string;
  const result = await _searchForRoom(key);
  if (result) {
    if (result.store.size() + 1 > result.maxCapacity) {
      Res.status(400).json({ message: "full" });
    } else {
      Res.status(200).json({ message: "found", roomName: result.name });
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
    const result = await _searchForRoom(ROOMID);
    if (!result) {
      const ROOM: Room<User> = new Room(
        ROOMID,
        data.name,
        data.capacity,
        new DataStore()
      );
      _createRoom(ROOM);
    } else {
      isGenerated = false;
    }
  }
  Res.status(200).json({ roomID: ROOMID });
});

export default router;
