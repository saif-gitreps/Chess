import { useCallback, useEffect, useMemo, useState } from "react";
import { INITIAL_BOARD } from "./utils/constants";
import type { CastlingRights, Color, GameState, Piece, Position } from "./utils/types";
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
   const { canUndo, addToHistory, undo } = useGameHistory();
   const { getLegalMoves } = useMoveValidation(hasKingMoved, hasRookMoved);

   useEffect(() => {
      if (mode === "online" && roomId) {
         socket.emit("join_room", roomId);

         socket.on("color", (color: Color) => {
            setPlayerColor(color);
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
               setGameState(data.gameState);
               setHasKingMoved(data.hasKingMoved);
               setHasRookMoved(data.hasRookMoved);
               setCapturedHistory(data.capturedHistory);
               setSelectedSquare(null);
            }
         );

         return () => {
            socket.off("color");
            socket.off("opponent_move");
         };
      }
   }, [mode, roomId]);

   const legalMoves = useMemo(() => {
      return selectedSquare ? getLegalMoves(gameState.board, selectedSquare) : [];
   }, [selectedSquare, gameState.board, getLegalMoves]);

   const handleSquareClick = useCallback(
      (position: Position) => {
         // if (mode === "online" && playerColor !== gameState.currentPlayer) return;

         const [row, col] = position;
         const piece = gameState.board[row][col];

         // If clicking on a legal move, make the move
         if (selectedSquare && legalMoves.some(([r, c]) => r === row && c === col)) {
            const [fromRow, fromCol] = selectedSquare;
            const movingPiece = gameState.board[fromRow][fromCol]!;
            const capturedPiece = gameState.board[row][col];

            // Save to history
            addToHistory(gameState, hasKingMoved, hasRookMoved, capturedHistory);

            // Handle capture
            if (capturedPiece) {
               setCapturedHistory((prev) => [
                  ...prev,
                  { capturedBy: movingPiece.color, piece: capturedPiece },
               ]);
            }

            // Apply move
            const newBoard = applyMove(gameState.board, selectedSquare, position);

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

               setHasKingMoved((prev) => ({ ...prev, [movingPiece.color]: true }));
            }

            // Handle rook movement (for castling rights)
            if (movingPiece.type === "castle") {
               const rookColor = movingPiece.color;
               if (fromCol === 0) {
                  setHasRookMoved((prev) => ({
                     ...prev,
                     [rookColor]: { ...prev[rookColor], left: true },
                  }));
               } else if (fromCol === 7) {
                  setHasRookMoved((prev) => ({
                     ...prev,
                     [rookColor]: { ...prev[rookColor], right: true },
                  }));
               }
            }

            const nextPlayer = getOppositeColor(gameState.currentPlayer);
            const newIsInCheck = isKingInCheck(
               newBoard,
               nextPlayer,
               hasKingMoved,
               hasRookMoved
            )
               ? nextPlayer
               : null;

            setGameState({
               board: newBoard,
               currentPlayer: nextPlayer,
               isInCheck: newIsInCheck,
            });

            if (mode === "online" && roomId) {
               socket.emit("move", {
                  roomId,
                  from: selectedSquare,
                  to: position,
                  gameState: {
                     board: newBoard,
                     currentPlayer: nextPlayer,
                     isInCheck: newIsInCheck,
                  },
                  hasKingMoved,
                  hasRookMoved,
                  capturedHistory,
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
      const previousState = undo();
      if (previousState) {
         setGameState(previousState.gameState);
         setHasKingMoved(previousState.hasKingMoved);
         setHasRookMoved(previousState.hasRookMoved);
         setCapturedHistory(previousState.capturedHistory);
         setSelectedSquare(null);
      }
   }, [undo]);

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
      <div className="bg-black h-screen">
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
               canUndo={!canUndo}
            />
         </div>
      </div>
   );
}

export default App;
