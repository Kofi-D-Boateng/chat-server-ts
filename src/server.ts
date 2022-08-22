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
import login from "./routes/login";
import signup from "./routes/signup";
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
import { LinkedList } from "./classes/redis/linkedList";

app.use(`/${API_VERSION.VERSION}/login`, login);
app.use(`/${API_VERSION.VERSION}/signup`, signup);
app.use(`/${API_VERSION.VERSION}/rooms`, room);

// MAIN WORK
io.on(
  "connection",
  (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) => {
    socket.emit("myID", { ID: socket.id });

    socket.on("join-room", async (data: JoinRoomDatagram) => {
      console.log(data);
      const ROOM = await _searchForRoom(data.roomID);
      console.log(ROOM);
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
        id: data.id,
        position: data.position,
        username: data.username,
      };
      const result: boolean = LinkedList.contains(USER);
      if (!result) {
        const result: boolean = LinkedList.add(USER);
        if (!result) {
          console.log("Error: Could not add member to list.");
          return;
        }
      }
      if (result) LinkedList.update(USER);
      console.log("\nAfter joining\n");
      console.log(LinkedList);
      const roomArray = LinkedList.toArray().filter((User: User) => {
        return User.id != USER.id;
      });
      const position = LinkedList.getByObject(USER)?.position;
      socket.join(ROOM.key);
      socket.emit("all-users", { users: roomArray, position: position });
      _updateRoom(ROOM);
    });

    socket.on("sending-signal", async (data: ReceivedSignalDatagram) => {
      console.log(data);
      const Room = await _searchForRoom(data.roomID);
      const roomArr = Room?.members.toArray();
      io.to(data.userToSignal).emit("user-joined", {
        signal: data.signal,
        callerID: data.callerID,
        updatedUserList: roomArr,
      });
    });

    socket.on("returning-signal", (data: ReceivedSignalDatagram) => {
      console.log(data);
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
      console.log(LinkedList);
      const findThisUser: User = {
        id: socket.id,
        username: data.user.username,
        position: data.user.position,
      };
      const result = LinkedList.contains(findThisUser);
      console.log(result);
      if (!result) return;
      io.to(Room.key).emit("chat", { message: data.user.msg, id: socket.id });
    });
    // WORK ON LEAVE!!!!
    socket.on("leave", async (data: DisconnectDatagram) => {
      console.log(data);
      const Room = await _searchForRoom(data.room);
      if (!Room) {
        socket.emit("room-status", { msg: "error" });
        return;
      }
      const LinkedList = Room.members;
      if (data.user.id !== socket.id) return;
      LinkedList.remove(data.user);
      console.log(LinkedList);
      if (LinkedList.size() <= 0) await _deleteRoomFromMemory(Room);
      socket.broadcast.emit("users-left", {
        leaver: socket.id,
      });
    });

    socket.on("disconnect", () => {});
  }
);

server.listen(CONFIG.PORT, () =>
  console.log(`Server listening on port:${CONFIG.PORT}`)
);
