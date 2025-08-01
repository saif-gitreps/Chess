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

const gameStates = {};

const INITIAL_BOARD = [
   [
      { type: "castle", color: "b" },
      { type: "horse", color: "b" },
      { type: "bishop", color: "b" },
      { type: "queen", color: "b" },
      { type: "king", color: "b" },
      { type: "bishop", color: "b" },
      { type: "horse", color: "b" },
      { type: "castle", color: "b" },
   ],
   // Row 1 - Black pawns
   Array(8)
      .fill(null)
      .map(() => ({
         type: "pawn",
         color: "b",
      })),
   // Rows 2–5 - Empty
   Array(8).fill(null),
   Array(8).fill(null),
   Array(8).fill(null),
   Array(8).fill(null),
   // Row 6 - White pawns
   Array(8)
      .fill(null)
      .map(() => ({
         type: "pawn",
         color: "w",
      })),
   // Row 7 - White major pieces
   [
      { type: "castle", color: "w" },
      { type: "horse", color: "w" },
      { type: "bishop", color: "w" },
      { type: "queen", color: "w" },
      { type: "king", color: "w" },
      { type: "bishop", color: "w" },
      { type: "horse", color: "w" },
      { type: "castle", color: "w" },
   ],
];

const createInitialGameState = () => ({
   gameState: {
      board: INITIAL_BOARD,
      currentPlayer: "w",
      isInCheck: null,
   },
   hasKingMoved: { w: false, b: false },
   hasRookMoved: {
      w: { left: false, right: false },
      b: { left: false, right: false },
   },
   capturedHistory: [],
   gameHistory: [],
});

io.on("connection", (socket) => {
   console.log(`User connected: ${socket.id}`);

   socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);

      const roomSockets = io.sockets.adapter.rooms.get(roomId);
      const playerCount = roomSockets ? roomSockets.size : 0;

      // Check if room is full BEFORE joining
      if (playerCount > 2) {
         socket.leave(roomId);
         socket.emit("room_full");
         return;
      }

      if (!gameStates[roomId]) {
         gameStates[roomId] = createInitialGameState();
      }

      const color = playerCount === 1 ? "w" : "b";

      socket.emit("color", color);

      // Send current game state to the joining player
      socket.emit("game_state", gameStates[roomId]);

      // Notify room about player count
      io.to(roomId).emit("player_count", playerCount);
   });

   socket.on("move", (data) => {
      const { roomId, from, to, gameState, hasKingMoved, hasRookMoved, capturedHistory } =
         data;

      console.log(`User ${socket.id} made move from ${from} to ${to} in room ${roomId}`);

      // Update server game state
      if (gameStates[roomId]) {
         // Save current state to history for undo
         gameStates[roomId].gameHistory.push({
            gameState: gameStates[roomId].gameState,
            hasKingMoved: gameStates[roomId].hasKingMoved,
            hasRookMoved: gameStates[roomId].hasRookMoved,
            capturedHistory: gameStates[roomId].capturedHistory,
         });

         // Update current state
         gameStates[roomId].gameState = gameState;
         gameStates[roomId].hasKingMoved = hasKingMoved;
         gameStates[roomId].hasRookMoved = hasRookMoved;
         gameStates[roomId].capturedHistory = capturedHistory;
      }

      // Broadcast the complete move data to all OTHER players in the room
      socket.to(roomId).emit("opponent_move", {
         from,
         to,
         gameState,
         hasKingMoved,
         hasRookMoved,
         capturedHistory,
      });
   });

   socket.on("undo", (roomId) => {
      console.log(`User ${socket.id} requested undo in room ${roomId}`);

      if (gameStates[roomId] && gameStates[roomId].gameHistory.length > 0) {
         // Get the previous state
         const previousState = gameStates[roomId].gameHistory.pop();

         // Update current state
         gameStates[roomId].gameState = previousState.gameState;
         gameStates[roomId].hasKingMoved = previousState.hasKingMoved;
         gameStates[roomId].hasRookMoved = previousState.hasRookMoved;
         gameStates[roomId].capturedHistory = previousState.capturedHistory;

         // Broadcast undo to all players in the room
         io.to(roomId).emit("game_undone", {
            gameState: previousState.gameState,
            hasKingMoved: previousState.hasKingMoved,
            hasRookMoved: previousState.hasRookMoved,
            capturedHistory: previousState.capturedHistory,
            canUndo: gameStates[roomId].gameHistory.length > 0,
         });
      }
   });

   socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
   });
});

server.listen(3001, () => {
   console.log("Server running on http://localhost:3001");
});
