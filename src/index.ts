import { Server, Socket } from "socket.io";
import { Client } from "socket.io/dist/client";

const EVENTS = {
  CONNECTION: "connection",
  CLIENT: {
    REQUEST_TO_JOIN: "requestToJoin",
    SEND_MSG: "sendMsg",
  },
  SERVER: {
    NEW_ROOM: "newRoom",
    JOINED_ROOM: "joinedRoom",
    JOIN_REJECT: "joinReject",
    NEW_MSG: "newMsg",
  },
};

const io = new Server({
  cors: {
    origin: process.env.APP_URL,
    credentials: true,
  },
});

io.on(EVENTS.CONNECTION, (socket: Socket) => {
  console.log(`connection from usr: ${socket.id}`);

  socket.on(EVENTS.CLIENT.REQUEST_TO_JOIN, (roomId: string) => {
    const roomSize = io.sockets.adapter.rooms.get(roomId)?.size || 0;

    if (!roomSize) {
      console.log(`created room with id: ${roomId}`);
      socket.emit(EVENTS.SERVER.NEW_ROOM);
    }

    if (roomSize > 2) {
      socket.emit(EVENTS.SERVER.JOIN_REJECT, roomSize);
      return;
    }

    socket.join(roomId);
    socket.emit(EVENTS.SERVER.JOINED_ROOM);
  });

  socket.on(EVENTS.CLIENT.SEND_MSG, (msg) => {
    const { roomId, author, body } = JSON.parse(msg);
    io.to(roomId).emit(EVENTS.SERVER.NEW_MSG, { author, body });
  });
});

io.listen(4000);
console.log("connected on port 4000");
