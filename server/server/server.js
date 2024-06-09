import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

app.use(cors());

let rooms = {};

io.on("connection", (socket) => {
  socket.on("loginDetails", ({ pseudo, room }) => {
    // Check if the room exists, if not, create it
    if (!rooms[room]) {
      rooms[room] = [];
    }

    // If room has less than 2 users, allow user to join
    if (rooms[room].length < 2) {
      rooms[room].push({ id: socket.id, pseudo });
      socket.room = room; // Storing room ID in socket object
      socket.emit("myConnexion", pseudo, room);
      socket.join(room);

      // Notify other user in the room about new user
      socket.broadcast.to(room).emit("newUser", socket.id, pseudo);
    } else {
      // Notify user that the room is full
      socket.emit("roomFull", room);
    }

    if (rooms[room].length === 1) {
      socket.broadcast.to(room).emit("waiting", room);
    }
  });

  socket.on("sendMessage", (message) => {
    const room = socket.room; // Get the room ID directly
    const sender = socket.id[0]; // Using only the first letter of socket ID

    // Emit the message to the other user in the room
    socket.to(room).emit("message", { sender, message });
  });

  socket.on("disconnect", () => {
    // Remove the disconnected user from the room
    for (const room in rooms) {
      rooms[room] = rooms[room].filter((user) => user.id !== socket.id);
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
