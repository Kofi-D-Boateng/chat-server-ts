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
  const processedMessage = process_messages({
    id: socket.id,
    sender: data.user.username,
    text: data.user.message,
    createdAt: new Date().getUTCMilliseconds(),
  });
  if (processedMessage) {
    Room.getMessages().add(processedMessage);
    store.set(data.roomId, Room);

    io.to(Room.getKey()).emit("chat", {
      message: data.user.message,
      id: socket.id,
      sender: data.user.username,
    });
  }
};

const process_messages: (message: Message) => Message | null = (message) => {
  return message;
};
