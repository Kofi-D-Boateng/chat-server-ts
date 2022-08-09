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

      if (!ROOM) {
        socket.emit("room-status", { msg: "error" });
        return;
      }

      const LinkedList: LinkedList = ROOM.members;
      console.log("LinkedList:");
      console.log(LinkedList);
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
      console.log("\n" + result + "\n");
      if (!result) {
        const result: boolean = LinkedList.add(USER);
        console.log("\n" + result + "\n");

        if (!result) {
          console.log("Error: Could not add member to list.");
          return;
        }
      }
      console.log("After joining");
      console.log(LinkedList);
      const roomArray = LinkedList.toArray();
      socket.emit("all-users", { users: roomArray });
      socket.join(ROOM.key);
      await _updateRoom(ROOM);
    });

    socket.on("sending-signal", (data: ReceivedSignalDatagram) => {
      io.to(data.userToSignal).emit("user-joined", {
        signal: data.signal,
        socketID: data.socketID,
      });
    });

    socket.on("returning-signal", (data: ReceivedSignalDatagram) => {
      io.to(data.socketID).emit("receiving-signal", {
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
        id: "",
        username: data.user.username,
        position: data.user.position,
      };

      const result = LinkedList.contains(findThisUser);
      console.log(result);
      if (!result) return;
      io.to(Room.key).emit("chat", { message: data.user.msg, id: socket.id });

      // for (const room in users) {
      //   for (let i = 0; i < users[room].length; i++) {
      //     if (socket.id === users[room][i]) {
      //       io.to(room).emit("chat", { message: data.message, id: socket.id });
      //     }
      //   }
      // }
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
      if (LinkedList.size() <= 0) await _deleteRoomFromMemory(Room);
      socket.broadcast.emit("users-left", {
        leaver: socket.id,
      });
    });
  }
);

server.listen(CONFIG.PORT, () =>
  console.log(`Server listening on port:${CONFIG.PORT}`)
);
