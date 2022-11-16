import "dotenv/config";
import cors, { CorsOptions } from "cors";
import express, { Express } from "express";
import { createServer, Server } from "http";
import logger from "morgan";
import { CONFIG } from "./config/config";
import { Server as Srv, Socket } from "socket.io";
import { JoinRoomDatagram } from "./types/JoinRoom";

const app: Express = express();

const whitelist: CorsOptions = {
  origin: [CONFIG.ORIGINS],
  credentials: true,
  optionsSuccessStatus: 204,
  methods: [CONFIG.METHODS],
};
app.use(logger(CONFIG.LOGGER_TYPE));
app.use(cors(whitelist));
app.use(express.json());

const server: Server = createServer(app);
const io = new Srv(server, { cors: whitelist });

// ROUTE DEPENDENCIES

import {
  _createRoom,
  _deleteRoomFromMemory,
  _searchForRoom,
  _updateRoom,
} from "./utils/redis/query";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ReceivedSignalDatagram } from "./types/ReceivedSignal";
import { MessageDatagram } from "./types/Message";
import { DisconnectDatagram } from "./types/Disconnect";
import { User } from "./classes/user";
import { Room } from "./classes/roomClass";
import { DataStore } from "./classes/dataStore";
import { CreateRoomRequest } from "./types/Request";
import { randomBytes } from "crypto";

const MainDataStore: Map<string, Room<User>> = new Map();

// MAIN WORK
io.on(
  "connection",
  (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) => {
    socket.emit("myID", { ID: socket.id });

    socket.on("find-room", async (data: { roomKey: string }) => {
      if (MainDataStore.has(data.roomKey)) {
        io.to(socket.id).emit("room-name", {
          roomName: MainDataStore.get(data.roomKey)?.name,
        });
      } else {
        io.to(socket.id).emit("room-name", { roomName: undefined });
      }
    });

    socket.on("create-room", async (data: CreateRoomRequest) => {
      let isGenerated: boolean = false;
      while (!isGenerated) {
        isGenerated = true;
        const ROOMID: string = randomBytes(
          CONFIG.ROOM_CONFIG.LENGTH_OF_ID
        ).toString(CONFIG.ROOM_CONFIG.ROOM_ID_FORMAT as BufferEncoding);
        if (!MainDataStore.has(ROOMID)) {
          const ROOM: Room<User> = new Room(
            ROOMID,
            data.name,
            data.capacity,
            new DataStore()
          );
          MainDataStore.set(ROOMID, ROOM);
          io.to(socket.id).emit("room-id", ROOMID);
        } else {
          isGenerated = false;
        }
      }
    });

    socket.on("join-room", async (data: JoinRoomDatagram) => {
      const Room = MainDataStore.get(data.roomID);
      if (!Room) {
        socket.emit("room-status", { msg: "error" });
        return;
      }

      const DataStore: DataStore<User> = Room.store;
      if (DataStore.size() > Room.maxCapacity) {
        socket.emit("room-status", { msg: "full" });
        return;
      }
      const USER: User = new User(socket.id, data.username);
      DataStore.insert(USER);
      const roomArray = DataStore.toArray().filter((User: User) => {
        return User.id != USER.id;
      });
      socket.join(Room.key);
      socket.emit("all-users", { users: roomArray });
      MainDataStore.set(data.roomID, Room);
    });

    socket.on("sending-signal", async (data: ReceivedSignalDatagram) => {
      const Room = MainDataStore.get(data.roomID);
      if (!Room) {
        socket.emit("room-status", { msg: "error" });
        return;
      }
      const roomArr = Room.store.toArray();
      io.to(data.userToSignal).emit("user-joined", {
        signal: data.signal,
        callerID: data.callerID,
        updatedUserList: roomArr,
      });
    });

    socket.on("returning-signal", (data: ReceivedSignalDatagram) => {
      io.to(data.callerID).emit("receiving-signal", {
        signal: data.signal,
        id: socket.id,
      });
    });

    socket.on("message", async (data: MessageDatagram) => {
      const Room = MainDataStore.get(data.room);
      if (!Room) {
        socket.emit("room-status", { msg: "error" });
        return;
      }
      const DataStore = Room.store;
      const USER: User = { id: socket.id, username: data.user.username };
      const result = DataStore.contains(USER);
      if (!result) return;
      io.to(Room.key).emit("chat", {
        message: data.user.message,
        id: socket.id,
        sender: USER.username,
      });
    });

    socket.on("leave", async (data: DisconnectDatagram) => {
      const Room = MainDataStore.get(data.room);
      if (!Room) {
        socket.emit("room-status", { msg: "error" });
        return;
      }
      const DataStore = Room.store;
      if (data.user.id !== socket.id) {
        socket.emit("room-status", { msg: "error" });
        return;
      }
      DataStore.remove(data.user);

      if (DataStore.size() <= 0) {
        MainDataStore.delete(data.room);
        return;
      }
      const arr = DataStore.toArray();
      socket.broadcast.emit("users-left", {
        leaver: socket.id,
        updatedList: arr,
      });
      MainDataStore.set(data.room, Room);
      socket.disconnect(true);
    });
  }
);

server.listen(CONFIG.PORT, () =>
  console.log(`Server listening on port:${CONFIG.PORT}`)
);
