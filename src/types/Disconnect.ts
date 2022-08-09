import { User } from "./User";

export type DisconnectDatagram = {
  user: User;
  room: string;
};
