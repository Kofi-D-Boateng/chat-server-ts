import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Room } from "../classes/roomClass";
import { User } from "../classes/user";
import { ReceivedSignalDatagram } from "../types/ReceivedSignal";

export const sendingSignalController: (
  data: ReceivedSignalDatagram,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  store: Map<string, Room<string, User>>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => void = (data, io, store, socket) => {
  const Room = store.get(data.roomId);
  if (!Room) {
    socket.emit("room-status", { msg: "error" });
    return;
  }

  const roomArr: Array<User> = new Array();
  Room.getStore().forEach((user: User, key: string) => roomArr.push(user));
  io.to(data.userToSignal).emit("user-joined", {
    signal: data.signal,
    callerId: data.callerId,
    updatedUserList: roomArr,
  });
};
