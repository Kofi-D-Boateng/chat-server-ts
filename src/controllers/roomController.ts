import { _searchForRoom, _createRoom } from "../utils/redis/query";
import { randomBytes } from "crypto";
import { CONFIG } from "../config/config";
import { Request, Response } from "express";
import { CreateRoomRequest } from "../types/Request";

const findRoom: (Req: Request, Res: Response) => void = async (
  Req: Request,
  Res: Response
) => {
  const PARAM = Req.query["key"];
  const ROOM = await _searchForRoom(PARAM as string);
  if (ROOM) {
    Res.status(200).json({ roomName: ROOM.name });
  } else {
    Res.status(400).json();
  }
};

let maxTries: number = CONFIG.RECURSIVE_ATTEMPTS.CREATE_ROOM;
const createRoom: (Req: Request, Res: Response) => void = async (
  Req: Request,
  Res: Response
) => {
  if (maxTries <= 0) {
    Res.status(400).json();
    return;
  }
  const { name, creator, capacity } = Req.body;
  const roomRequest: CreateRoomRequest = {
    name: name,
    username: creator,
    capacity: parseInt(capacity),
  };
  const ROOMID: string = randomBytes(16).toString(
    CONFIG.ROOM_CONFIG.ROOM_ID_FORMAT as BufferEncoding
  );
  const ROOM = await _createRoom(ROOMID, roomRequest);
  if (ROOM) {
    Res.status(200).json({
      roomID: ROOM.key,
      roomName: ROOM.name,
      username: roomRequest.username,
    });
    maxTries = CONFIG.RECURSIVE_ATTEMPTS.CREATE_ROOM;
    return;
  }
  maxTries--;
  createRoom(Req, Res);
};

export { findRoom, createRoom };
