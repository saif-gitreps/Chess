import { isValidPosition } from "./boardUtil";
import { KING_MOVES, KNIGHT_MOVES } from "./constants";
import type { Board, CastlingRights, Color, Position } from "./types";

const calculateSlidingMoves = (
   board: Board,
   position: Position,
   directions: Position[],
   color: Color
): Position[] => {
   const [row, col] = position;
   const moves: Position[] = [];

   for (const [dRow, dCol] of directions) {
      for (let i = 1; i < 8; i++) {
         const newPos: Position = [row + dRow * i, col + dCol * i];
         if (!isValidPosition(newPos)) break;

         const [newRow, newCol] = newPos;
         const target = board[newRow][newCol];

         if (!target) {
            moves.push(newPos);
         } else {
            if (target.color !== color) {
               moves.push(newPos);
            }
            break;
         }
      }
   }

   return moves;
};

const calculatePawnMoves = (
   board: Board,
   position: Position,
   color: Color
): Position[] => {
   const [row, col] = position;
   const moves: Position[] = [];
   const direction = color === "w" ? -1 : 1;
   const startRow = color === "w" ? 6 : 1;

   // Move forward one square
   const oneStep: Position = [row + direction, col];
   if (isValidPosition(oneStep) && !board[oneStep[0]][oneStep[1]]) {
      moves.push(oneStep);

      // Move forward two squares from starting position
      if (row === startRow) {
         const twoStep: Position = [row + direction * 2, col];
         if (isValidPosition(twoStep) && !board[twoStep[0]][twoStep[1]]) {
            moves.push(twoStep);
         }
      }
   }

   // Capture diagonally
   for (const dCol of [-1, 1]) {
      const capturePos: Position = [row + direction, col + dCol];
      if (isValidPosition(capturePos)) {
         const target = board[capturePos[0]][capturePos[1]];
         if (target && target.color !== color) {
            moves.push(capturePos);
         }
      }
   }

   return moves;
};

const calculateKnightMoves = (
   board: Board,
   position: Position,
   color: Color
): Position[] => {
   const [row, col] = position;
   const moves: Position[] = [];

   for (const [dRow, dCol] of KNIGHT_MOVES) {
      const newPos: Position = [row + dRow, col + dCol];
      if (isValidPosition(newPos)) {
         const target = board[newPos[0]][newPos[1]];
         if (!target || target.color !== color) {
            moves.push(newPos);
         }
      }
   }

   return moves;
};

const calculateKingMoves = (
   board: Board,
   position: Position,
   color: Color,
   hasKingMoved: boolean,
   hasRookMoved: CastlingRights[Color]
): Position[] => {
   const [row, col] = position;
   const moves: Position[] = [];

   // Regular king moves
   for (const [dRow, dCol] of KING_MOVES) {
      const newPos: Position = [row + dRow, col + dCol];
      if (isValidPosition(newPos)) {
         const target = board[newPos[0]][newPos[1]];
         if (!target || target.color !== color) {
            moves.push(newPos);
         }
      }
   }

   // Castling
   const kingRow = color === "w" ? 7 : 0;
   if (!hasKingMoved && row === kingRow && col === 4) {
      // Kingside castling
      if (
         !hasRookMoved.right &&
         !board[kingRow][5] &&
         !board[kingRow][6] &&
         board[kingRow][7]?.type === "castle" &&
         board[kingRow][7]?.color === color
      ) {
         moves.push([kingRow, 6]);
      }

      // Queenside castling
      if (
         !hasRookMoved.left &&
         !board[kingRow][1] &&
         !board[kingRow][2] &&
         !board[kingRow][3] &&
         board[kingRow][0]?.type === "castle" &&
         board[kingRow][0]?.color === color
      ) {
         moves.push([kingRow, 2]);
      }
   }

   return moves;
};

export const getAllPossibleMoves = (
   board: Board,
   position: Position,
   hasKingMoved: { w: boolean; b: boolean },
   hasRookMoved: CastlingRights
): Position[] => {
   const piece = board[position[0]][position[1]];
   if (!piece) return [];

   const { type, color } = piece;

   switch (type) {
      case "pawn":
         return calculatePawnMoves(board, position, color);

      case "castle":
         return calculateSlidingMoves(
            board,
            position,
            [
               [0, 1],
               [0, -1],
               [1, 0],
               [-1, 0],
            ],
            color
         );

      case "bishop":
         return calculateSlidingMoves(
            board,
            position,
            [
               [1, 1],
               [1, -1],
               [-1, 1],
               [-1, -1],
            ],
            color
         );

      case "queen":
         return calculateSlidingMoves(
            board,
            position,
            [
               [0, 1],
               [0, -1],
               [1, 0],
               [-1, 0],
               [1, 1],
               [1, -1],
               [-1, 1],
               [-1, -1],
            ],
            color
         );

      case "horse":
         return calculateKnightMoves(board, position, color);

      case "king":
         return calculateKingMoves(
            board,
            position,
            color,
            hasKingMoved[color],
            hasRookMoved[color]
         );

      default:
         return [];
   }
};
