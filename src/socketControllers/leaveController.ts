import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Room } from "../classes/roomClass";
import { User } from "../classes/user";
import { DisconnectDatagram } from "../types/Disconnect";

export const LeaveController: (
  data: DisconnectDatagram,
  store: Map<string, Room<string, User>>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => void = (data, store, socket) => {
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
};
