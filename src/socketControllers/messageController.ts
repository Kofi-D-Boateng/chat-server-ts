import "dotenv/config";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Room } from "../classes/roomClass";
import { User } from "../classes/user";
import { Message, MessageDatagram } from "../types/Message";
import { Worker } from "worker_threads";

export const MessageController: (
  data: MessageDatagram,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  store: Map<string, Room<string, User>>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => void = (data, io, store, socket) => {
  const Room = store.get(data.roomId);
  if (!Room) {
    socket.emit("room-status", { msg: "error" });
    return;
  }

  if (!Room.getStore().has(socket.id)) return;
  const processedMessage: Message = {
    id: socket.id,
    sender: data.user.username,
    text: data.user.message,
    createdAt: Date.now(),
  };
  Room.insertMessage(processedMessage);
  store.set(data.roomId, Room);
  io.to(Room.getKey()).emit("chat", processedMessage);
};

const processMessages: (message: Message) => Message | null = (message) => {
  console.log(message);
  const worker = new Worker(
    "C:/Users/kdboa/OneDrive/Desktop/chat-server-ts/src/workerThreadScripts/processMessage.ts",
    {
      workerData: message,
    }
  );
  let returnMessage: Message | null = null;
  worker.on("message", (data: Message) => (returnMessage = data));
  worker.on("error", (err) => console.log(err.message));
  worker.on("exit", (code) =>
    console.log(`Worker Thread exited with code ${code}`)
  );
  return returnMessage;
};
