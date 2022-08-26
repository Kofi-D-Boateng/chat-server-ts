export type MessageDatagram = {
  room: string;
  user: {
    position: number;
    username: string;
    message: string;
  };
};
