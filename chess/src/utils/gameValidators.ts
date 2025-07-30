import { getOppositeColor } from "./boardUtil";
import { getAllPossibleMoves } from "./moveCalculator";
import type { Board, CastlingRights, Color, Position } from "./types";

export const findKing = (board: Board, color: Color): Position | null => {
   for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
         const piece = board[row][col];
         if (piece?.type === "king" && piece.color === color) {
            return [row, col];
         }
      }
   }
   return null;
};

export const isKingInCheck = (
   board: Board,
   color: Color,
   hasKingMoved: { w: boolean; b: boolean },
   hasRookMoved: CastlingRights
): boolean => {
   const kingPos = findKing(board, color);
   if (!kingPos) return true;

   const enemyColor = getOppositeColor(color);

   // Check if any enemy piece can attack the king
   for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
         const piece = board[row][col];
         if (piece && piece.color === enemyColor) {
            const moves = getAllPossibleMoves(
               board,
               [row, col],
               hasKingMoved,
               hasRookMoved
            );
            if (moves.some(([r, c]) => r === kingPos[0] && c === kingPos[1])) {
               return true;
            }
         }
      }
   }

   return false;
};

export const applyMove = (board: Board, from: Position, to: Position): Board => {
   const newBoard = board.map((row) => [...row]);
   const piece = newBoard[from[0]][from[1]];

   newBoard[to[0]][to[1]] = piece;
   newBoard[from[0]][from[1]] = null;

   // Handle pawn promotion
   if (piece?.type === "pawn" && (to[0] === 0 || to[0] === 7)) {
      newBoard[to[0]][to[1]] = {
         type: "queen",
         color: piece.color,
         image: `chess-pieces/queen_${piece.color}.png`,
      };
   }

   return newBoard;
};
