import type { Board, Position } from "./types";

export const INITIAL_BOARD: Board = [
   // Row 0 - Black major pieces
   [
      { type: "castle", color: "b", image: "chess-pieces/castle_b.png" },
      { type: "horse", color: "b", image: "chess-pieces/horse_b.png" },
      { type: "bishop", color: "b", image: "chess-pieces/bishop_b.png" },
      { type: "queen", color: "b", image: "chess-pieces/queen_b.png" },
      { type: "king", color: "b", image: "chess-pieces/king_b.png" },
      { type: "bishop", color: "b", image: "chess-pieces/bishop_b.png" },
      { type: "horse", color: "b", image: "chess-pieces/horse_b.png" },
      { type: "castle", color: "b", image: "chess-pieces/castle_b.png" },
   ],
   // Row 1 - Black pawns
   Array(8)
      .fill(null)
      .map(() => ({
         type: "pawn" as const,
         color: "b" as const,
         image: "chess-pieces/pawn_b.png",
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
         image: "chess-pieces/pawn_w.png",
      })),
   // Row 7 - White major pieces
   [
      { type: "castle", color: "w", image: "chess-pieces/castle_w.png" },
      { type: "horse", color: "w", image: "chess-pieces/horse_w.png" },
      { type: "bishop", color: "w", image: "chess-pieces/bishop_w.png" },
      { type: "queen", color: "w", image: "chess-pieces/queen_w.png" },
      { type: "king", color: "w", image: "chess-pieces/king_w.png" },
      { type: "bishop", color: "w", image: "chess-pieces/bishop_w.png" },
      { type: "horse", color: "w", image: "chess-pieces/horse_w.png" },
      { type: "castle", color: "w", image: "chess-pieces/castle_w.png" },
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
