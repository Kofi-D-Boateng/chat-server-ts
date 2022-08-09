export type MessageDatagram = {
  room: string;
  user: {
    position: number;
    username: string;
    msg: string;
  };
};
