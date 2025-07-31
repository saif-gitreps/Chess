const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
   cors: {
      origin: "*", // for testing; later restrict to your frontend URL
   },
});

const rooms = {};

io.on("connection", (socket) => {
   console.log(`User connected: ${socket.id}`);

   socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);

      const roomSockets = io.sockets.adapter.rooms.get(roomId);
      const playerCount = roomSockets ? roomSockets.size : 0;

      // Assign colors
      const color = playerCount === 1 ? "white" : "black";
      socket.emit("color", color);

      if (playerCount > 2) {
         socket.leave(roomId);
         socket.emit("room_full");
      }
   });

   socket.on("move", ({ roomId, move }) => {
      // Broadcast move to the opponent
      console.log(`User ${socket.id} move: ${move}`);
      socket.to(roomId).emit("opponent_move", move);
   });

   socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
   });
});

server.listen(3001, () => {
   console.log("Server running on http://localhost:3001");
});
