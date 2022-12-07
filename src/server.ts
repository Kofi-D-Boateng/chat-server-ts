import "dotenv/config";
import cors, { CorsOptions } from "cors";
import express, { Express } from "express";
import { createServer, Server } from "http";
import logger from "morgan";
import { API_VERSION, CONFIG } from "./config/config";
import { Server as Srv, Socket } from "socket.io";
import { JoinRoomDatagram } from "./types/JoinRoom";
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
import { DataStore } from "./classes/dataStore";
import router from "./routes/room";

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

app.use(`/${API_VERSION}/rooms`, router);

const server: Server = createServer(app);
const io = new Srv(server, { cors: whitelist, path: CONFIG.PATH });

// MAIN WORK
io.on(
  "connection",
  (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) => {
    io.to(socket.id).emit("connected", true);

    socket.emit("myID", { ID: socket.id });

    socket.on("join-room", async (data: JoinRoomDatagram) => {
      const Room = await _searchForRoom(data.roomId);
      if (!Room) {
        io.to(socket.id).emit("room-status", { msg: "error" });
        return;
      }

      const DataStore: DataStore<User> = Room.store;
      const USER: User = new User(socket.id, data.username);
      DataStore.insert(USER);
      const roomArray = DataStore.toArray().filter((User: User) => {
        return User.id != USER.id;
      });
      socket.join(Room.key);
      socket.emit("all-users", { users: roomArray });
      _updateRoom(Room);
    });

    socket.on("sending-signal", async (data: ReceivedSignalDatagram) => {
      const Room = await _searchForRoom(data.roomID);
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
      const Room = await _searchForRoom(data.room);
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
      const Room = await _searchForRoom(data.room);
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
        _deleteRoomFromMemory(Room);
        return;
      }
      const arr = DataStore.toArray();
      socket.broadcast.emit("users-left", {
        leaver: socket.id,
        updatedList: arr,
      });
      _updateRoom(Room);
      socket.disconnect(true);
    });
  }
);

server.listen(CONFIG.PORT, () =>
  console.log(`Server listening on port:${CONFIG.PORT}`)
);
