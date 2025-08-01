import type { Board, Position } from "./types";
export const INITIAL_BOARD: Board = [
   // Row 0 - Black major pieces
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
         type: "pawn" as const,
         color: "b" as const,
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
         type: "pawn" as const,
         color: "w" as const,
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

export const KNIGHT_MOVES: readonly Position[] = [
   [-2, -1],
   [-1, -2],
   [-2, 1],
   [-1, 2],
   [2, -1],
   [1, -2],
   [2, 1],
   [1, 2],
];

export const KING_MOVES: readonly Position[] = [
   [-1, -1],
   [-1, 0],
   [-1, 1],
   [0, -1],
   [0, 1],
   [1, -1],
   [1, 0],
   [1, 1],
];
