import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ReceivedSignalDatagram } from "../types/ReceivedSignal";

export const returningSignalController: (
  data: ReceivedSignalDatagram,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => void = (data, io, socket) => {
  io.to(data.callerId).emit("received-signal", {
    signal: data.signal,
    id: socket.id,
  });
};
