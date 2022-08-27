import "dotenv/config";
import cors, { CorsOptions } from "cors";
import express, { Express } from "express";
import { createServer, Server } from "http";
import logger from "morgan";
import { API_VERSION, CONFIG } from "./config/config";
import { Server as Srv, Socket } from "socket.io";
import { User } from "./types/User";
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

import room from "./routes/room";
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
import { LinkedList } from "./classes/linkedList";

app.use(`/${API_VERSION.VERSION}/rooms`, room);

// MAIN WORK
io.on(
  "connection",
  (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) => {
    socket.emit("myID", { ID: socket.id });

    socket.on("join-room", async (data: JoinRoomDatagram) => {
      const ROOM = await _searchForRoom(data.roomID);
      if (!ROOM) {
        socket.emit("room-status", { msg: "error" });
        return;
      }

      const LinkedList: LinkedList = ROOM.members;
      if (LinkedList.size() > ROOM.maxCapacity) {
        socket.emit("room-status", { msg: "full" });
        return;
      }

      const USER: User = {
        id: socket.id,
        position: data.position,
        username: data.username,
      };
      const result: boolean = LinkedList.contains(USER);
      if (!result) {
        const result: boolean = LinkedList.add(USER);
        if (!result) {
          socket.emit("room-status", { msg: "error" });
          console.log("Error: Could not add member to list.");
          return;
        }
      }
      if (result) LinkedList.update(USER);
      const roomArray = LinkedList.toArray().filter((User: User) => {
        return User.id != USER.id;
      });
      const position = LinkedList.getByObject(USER)?.position;
      socket.join(ROOM.key);
      socket.emit("all-users", { users: roomArray, position: position });
      _updateRoom(ROOM);
    });

    socket.on("sending-signal", async (data: ReceivedSignalDatagram) => {
      const Room = await _searchForRoom(data.roomID);
      const roomArr = Room?.members.toArray();
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
      const Room = await _searchForRoom(data.room);
      if (!Room) {
        socket.emit("room-status", { msg: "error" });
        return;
      }
      const LinkedList = Room.members;
      const findThisUser: User = {
        id: socket.id,
        username: data.user.username,
        position: data.user.position,
      };
      const result = LinkedList.contains(findThisUser);
      if (!result) return;
      io.to(Room.key).emit("chat", {
        message: data.user.message,
        id: socket.id,
        sender: findThisUser.username,
      });
    });
    // WORK ON LEAVE!!!!
    socket.on("leave", async (data: DisconnectDatagram) => {
      const Room = await _searchForRoom(data.room);
      if (!Room) {
        socket.emit("room-status", { msg: "error" });
        return;
      }
      const LinkedList = Room.members;
      if (data.user.id !== socket.id) return;
      LinkedList.remove(data.user);
      const roomArr = LinkedList.toArray();
      if (LinkedList.size() <= 0) {
        _deleteRoomFromMemory(Room);
        return;
      }
      socket.broadcast.emit("users-left", {
        leaver: socket.id,
        updatedList: roomArr,
      });
      _updateRoom(Room);
    });
  }
);

server.listen(CONFIG.PORT, () =>
  console.log(`Server listening on port:${CONFIG.PORT}`)
);
