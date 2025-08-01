import { useCallback, useEffect, useMemo, useState } from "react";
import { INITIAL_BOARD } from "./utils/constants";
import type {
   CastlingRights,
   Color,
   GameState,
   Piece,
   Position,
   ServerGameState,
} from "./utils/types";
import useGameHistory from "./hooks/useGameHistory";
import useMoveValidation from "./hooks/useMoveValidation";
import { applyMove, isKingInCheck } from "./utils/gameValidators";
import { getOppositeColor } from "./utils/boardUtil";
import GameInfo from "./components/GameInfo/GameInfo";
import BoardComponent from "./components/Board/Board";
import socket from "./utils/socket";

interface AppProps {
   mode: "local" | "online";
   roomId?: string;
}

function App({ mode, roomId }: AppProps) {
   const [gameState, setGameState] = useState<GameState>({
      board: INITIAL_BOARD,
      currentPlayer: "w",
      isInCheck: null,
   });

   const [hasKingMoved, setHasKingMoved] = useState({ w: false, b: false });
   const [hasRookMoved, setHasRookMoved] = useState<CastlingRights>({
      w: { left: false, right: false },
      b: { left: false, right: false },
   });

   const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
   const [capturedHistory, setCapturedHistory] = useState<
      { capturedBy: Color; piece: Piece }[]
   >([]);
   const [playerColor, setPlayerColor] = useState<Color | null>(null);

   // Only use local history for local mode
   const { canUndo, addToHistory, undo } = useGameHistory();
   const { getLegalMoves } = useMoveValidation(hasKingMoved, hasRookMoved);

   useEffect(() => {
      if (mode === "online" && roomId) {
         socket.emit("join_room", roomId);

         socket.on("color", (color: Color) => {
            console.log("Received color:", color);
            setPlayerColor(color);
         });

         // Handle receiving the current game state when joining
         socket.on("game_state", (serverGameState: ServerGameState) => {
            setGameState(serverGameState.gameState);
            setHasKingMoved(serverGameState.hasKingMoved);
            setHasRookMoved(serverGameState.hasRookMoved);
            setCapturedHistory(serverGameState.capturedHistory);
         });

         socket.on(
            "opponent_move",
            (data: {
               from: Position;
               to: Position;
               gameState: GameState;
               hasKingMoved: typeof hasKingMoved;
               hasRookMoved: typeof hasRookMoved;
               capturedHistory: typeof capturedHistory;
            }) => {
               console.log("Received opponent move:", data);
               setGameState(data.gameState);
               setHasKingMoved(data.hasKingMoved);
               setHasRookMoved(data.hasRookMoved);
               setCapturedHistory(data.capturedHistory);
               setSelectedSquare(null);
            }
         );

         // Handle undo from server
         socket.on(
            "game_undone",
            (data: {
               gameState: GameState;
               hasKingMoved: typeof hasKingMoved;
               hasRookMoved: typeof hasRookMoved;
               capturedHistory: typeof capturedHistory;
               canUndo: boolean;
            }) => {
               console.log("Game undone:", data);
               setGameState(data.gameState);
               setHasKingMoved(data.hasKingMoved);
               setHasRookMoved(data.hasRookMoved);
               setCapturedHistory(data.capturedHistory);
               setSelectedSquare(null);
            }
         );

         socket.on("room_full", () => {
            alert("Room is full!");
         });

         return () => {
            socket.off("color");
            socket.off("game_state");
            socket.off("opponent_move");
            socket.off("game_undone");
            socket.off("room_full");
         };
      }
   }, [mode, roomId]);

   const legalMoves = useMemo(() => {
      return selectedSquare ? getLegalMoves(gameState.board, selectedSquare) : [];
   }, [selectedSquare, gameState.board, getLegalMoves]);

   const handleSquareClick = useCallback(
      (position: Position) => {
         if (mode === "online" && playerColor !== gameState.currentPlayer) {
            console.log(
               "Not your turn! Player color:",
               playerColor,
               "Current player:",
               gameState.currentPlayer
            );
            return;
         }

         const [row, col] = position;
         const piece = gameState.board[row][col];

         // If clicking on a legal move, make the move
         if (selectedSquare && legalMoves.some(([r, c]) => r === row && c === col)) {
            const [fromRow, fromCol] = selectedSquare;
            const movingPiece = gameState.board[fromRow][fromCol]!;
            const capturedPiece = gameState.board[row][col];

            // Save to history (only for local mode)
            if (mode === "local") {
               addToHistory(gameState, hasKingMoved, hasRookMoved, capturedHistory);
            }

            // Handle capture - calculate NEW captured history
            const newCapturedHistory = capturedPiece
               ? [
                    ...capturedHistory,
                    { capturedBy: movingPiece.color, piece: capturedPiece },
                 ]
               : capturedHistory;

            // Apply move
            const newBoard = applyMove(gameState.board, selectedSquare, position);

            // Calculate NEW king and rook states
            let newHasKingMoved = { ...hasKingMoved };
            let newHasRookMoved = { ...hasRookMoved };

            // Handle castling
            if (movingPiece.type === "king") {
               const kingRow = movingPiece.color === "w" ? 7 : 0;

               // Kingside castling
               if (fromCol === 4 && col === 6) {
                  newBoard[kingRow][5] = newBoard[kingRow][7];
                  newBoard[kingRow][7] = null;
               }
               // Queenside castling
               else if (fromCol === 4 && col === 2) {
                  newBoard[kingRow][3] = newBoard[kingRow][0];
                  newBoard[kingRow][0] = null;
               }

               newHasKingMoved = { ...newHasKingMoved, [movingPiece.color]: true };
            }

            // Handle rook movement (for castling rights)
            if (movingPiece.type === "castle") {
               const rookColor = movingPiece.color;
               if (fromCol === 0) {
                  newHasRookMoved = {
                     ...newHasRookMoved,
                     [rookColor]: { ...newHasRookMoved[rookColor], left: true },
                  };
               } else if (fromCol === 7) {
                  newHasRookMoved = {
                     ...newHasRookMoved,
                     [rookColor]: { ...newHasRookMoved[rookColor], right: true },
                  };
               }
            }

            const nextPlayer = getOppositeColor(gameState.currentPlayer);
            const newIsInCheck = isKingInCheck(
               newBoard,
               nextPlayer,
               newHasKingMoved,
               newHasRookMoved
            )
               ? nextPlayer
               : null;

            const newGameState = {
               board: newBoard,
               currentPlayer: nextPlayer,
               isInCheck: newIsInCheck,
            };

            // Update local state
            setGameState(newGameState);
            setHasKingMoved(newHasKingMoved);
            setHasRookMoved(newHasRookMoved);
            setCapturedHistory(newCapturedHistory);

            // Send the UPDATED states to other players (only for online mode)
            if (mode === "online" && roomId) {
               socket.emit("move", {
                  roomId,
                  from: selectedSquare,
                  to: position,
                  gameState: newGameState,
                  hasKingMoved: newHasKingMoved,
                  hasRookMoved: newHasRookMoved,
                  capturedHistory: newCapturedHistory,
               });
            }

            setSelectedSquare(null);
         }
         // If clicking on own piece, select it
         else if (piece && piece.color === gameState.currentPlayer) {
            setSelectedSquare(position);
         }
         // Otherwise, deselect
         else {
            setSelectedSquare(null);
         }
      },
      [
         gameState,
         selectedSquare,
         legalMoves,
         hasKingMoved,
         hasRookMoved,
         capturedHistory,
         addToHistory,
         mode,
         playerColor,
         roomId,
      ]
   );

   const handleUndo = useCallback(() => {
      if (mode === "online" && roomId) {
         // For online mode, request undo from server
         socket.emit("undo", roomId);
      } else {
         // For local mode, handle undo locally
         const previousState = undo();
         if (previousState) {
            setGameState(previousState.gameState);
            setHasKingMoved(previousState.hasKingMoved);
            setHasRookMoved(previousState.hasRookMoved);
            setCapturedHistory(previousState.capturedHistory);
            setSelectedSquare(null);
         }
      }
   }, [undo, mode, roomId]);

   const capturedPieces = useMemo(
      () => ({
         byWhite: capturedHistory
            .filter((entry) => entry.capturedBy === "w")
            .map((entry) => entry.piece),
         byBlack: capturedHistory
            .filter((entry) => entry.capturedBy === "b")
            .map((entry) => entry.piece),
      }),
      [capturedHistory]
   );

   return (
      <div className="p-4">
         <div className="items-center max-w-lg mx-auto">
            <BoardComponent
               board={gameState.board}
               selectedSquare={selectedSquare}
               legalMoves={legalMoves}
               onSquareClick={handleSquareClick}
            />

            <GameInfo
               currentPlayer={gameState.currentPlayer}
               isInCheck={gameState.isInCheck}
               capturedPieces={capturedPieces}
               undo={handleUndo}
               canUndo={mode === "online" ? canUndo : !canUndo}
            />
         </div>
      </div>
   );
}

export default App;
