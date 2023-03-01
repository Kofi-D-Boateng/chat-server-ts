export type MessageDatagram = {
  roomId: string;
  user: {
    position: number;
    username: string;
    message: string;
  };
};

export type Message = {
  id: string;
  sender: string;
  text: string;
  createdAt: string;
};
