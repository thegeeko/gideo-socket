import { Server, Socket } from "socket.io";

const EVENTS = {
  connection: "connection",
};

const io = new Server({
  cors: {
    origin: process.env.APP_URL,
    credentials: true,
  },
});

io.on(EVENTS.connection, (socket: Socket) => {
  console.log(`connection from usr: ${socket.id}`);
});

io.listen(4000);
console.log("connected on port 4000");
