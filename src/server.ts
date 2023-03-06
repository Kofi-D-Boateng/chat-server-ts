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
import { StoreCacheSingleton } from "./classes/storeSingleton";
import router from "./routes/room";
import { JoinRoomController } from "./socketControllers/joinRoomController";
import { sendingSignalController } from "./socketControllers/sendingSignalController";
import { returningSignalController } from "./socketControllers/returningSignalController";
import { MessageController } from "./socketControllers/messageController";
import { LeaveController } from "./socketControllers/leaveController";

const app: Express = express();
const store = StoreCacheSingleton.getStore();

const whitelist: CorsOptions = {
  origin: CONFIG.ORIGINS,
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

    socket.on("join-room", async (data: JoinRoomDatagram) =>
      JoinRoomController(data, io, store, socket)
    );

    socket.on("sending-signal", async (data: ReceivedSignalDatagram) =>
      sendingSignalController(data, io, store, socket)
    );

    socket.on("returning-signal", (data: ReceivedSignalDatagram) =>
      returningSignalController(data, io, socket)
    );

    socket.on("message", async (data: MessageDatagram) =>
      MessageController(data, io, store, socket)
    );

    socket.on("leave", async (data: DisconnectDatagram) =>
      LeaveController(data, store, socket)
    );
  }
);

server.listen(CONFIG.PORT, () =>
  console.log(`Server listening on port:${CONFIG.PORT}`)
);
