import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

io.on("connection", (socket) => {
  console.log("user connected", socket.id);
  socket.emit("welcome", `Welcome to the server `);
  socket.broadcast.emit("welcome", `${socket.id} joined the server`);

  socket.on("message", (data) => {
    console.log(data);
    socket.to(data.room).emit("received", data.message);
  });

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`user ${socket.io} joined ${room}`);
  });
});

server.listen(3000, () => {
  console.log("server started");
});
