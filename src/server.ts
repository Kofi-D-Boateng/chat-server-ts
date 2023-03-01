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
import { Message, MessageDatagram } from "./types/Message";
import { DisconnectDatagram } from "./types/Disconnect";
import { User } from "./classes/user";
import { StoreCacheSingleton } from "./classes/storeSingleton";
import router from "./routes/room";

const app: Express = express();
const store = StoreCacheSingleton.getStore();

const whitelist: CorsOptions = {
  origin: [CONFIG.ORIGINS],
  credentials: true,
  optionsSuccessStatus: 204,
  methods: ["GET", "POST"],
};
app.use(logger(CONFIG.LOGGER_TYPE));
app.use(cors(whitelist));
app.use(express.json());

app.use(`/${API_VERSION}/rooms`, router);

const server: Server = createServer(app);
const io = new Srv(server, {
  cors: whitelist,
  path: CONFIG.PATH,
  transports: ["websocket", "polling"],
});

// MAIN WORK
io.on(
  "connection",
  (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) => {
    io.to(socket.id).emit("connected", true);

    socket.emit("myID", { ID: socket.id });

    socket.on("join-room", async (data: JoinRoomDatagram) => {
      const Room = store.get(data.roomId);
      if (!Room) {
        io.to(socket.id).emit("room-status", { msg: "error" });
        return;
      }

      const DataStore = Room.getStore();
      const USER: User = new User(socket.id, data.username, new Set<Message>());
      DataStore.set(socket.id, USER);
      const userIter: IterableIterator<User> = DataStore.values();
      const roomArray: Array<User> = new Array();
      while (true) {
        const iterRes = userIter.next();
        if (iterRes.done) {
          break;
        }
        if (iterRes.value.getId() != USER.getId())
          roomArray.push(iterRes.value);
      }
      socket.join(Room.getKey());
      socket.emit("all-users", { users: roomArray });
      store.set(data.roomId, Room);
    });

    socket.on("sending-signal", async (data: ReceivedSignalDatagram) => {
      const Room = store.get(data.roomId);
      if (!Room) {
        socket.emit("room-status", { msg: "error" });
        return;
      }
      const iter = Room.getStore().values();
      const roomArr: Array<User> = new Array();
      while (true) {
        const res = iter.next();
        if (res.done) break;
        roomArr.push(iter.next().value);
      }
      io.to(data.userToSignal).emit("user-joined", {
        signal: data.signal,
        callerID: data.callerId,
        updatedUserList: roomArr,
      });
    });

    socket.on("returning-signal", (data: ReceivedSignalDatagram) => {
      io.to(data.callerId).emit("receiving-signal", {
        signal: data.signal,
        id: socket.id,
      });
    });

    socket.on("message", async (data: MessageDatagram) => {
      const Room = store.get(data.roomId);
      if (!Room) {
        socket.emit("room-status", { msg: "error" });
        return;
      }

      if (!Room.getStore().has(socket.id)) return;

      Room.getMessages().add({
        id: socket.id,
        sender: data.user.username,
        text: data.user.message,
        createdAt: new Date().toISOString(),
      });
      store.set(data.roomId, Room);

      io.to(Room.getKey()).emit("chat", {
        message: data.user.message,
        id: socket.id,
        sender: data.user.username,
      });
    });

    socket.on("leave", async (data: DisconnectDatagram) => {
      const Room = store.get(data.roomId);
      if (!Room) {
        socket.emit("room-status", { msg: "error" });
        return;
      }

      if (data.user.id !== socket.id) {
        socket.emit("room-status", { msg: "error" });
        return;
      }
      Room.getStore().delete(socket.id);

      if (Room.getStore().size <= 0) {
        store.delete(data.roomId);
        return;
      }

      const iter = Room.getStore().values();
      const roomArr: Array<User> = new Array();

      while (true) {
        const res = iter.next();
        if (res.done) break;
        roomArr.push(iter.next().value);
      }
      socket.broadcast.emit("users-left", {
        leaver: socket.id,
        updatedList: roomArr,
      });

      store.set(data.roomId, Room);
      socket.disconnect(true);
    });
  }
);

server.listen(CONFIG.PORT, () =>
  console.log(`Server listening on port:${CONFIG.PORT}`)
);
