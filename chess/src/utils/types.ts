export type PieceType = "pawn" | "castle" | "horse" | "bishop" | "queen" | "king";
export type Color = "w" | "b";
export type Position = readonly [number, number];

export interface Piece {
   readonly type: PieceType;
   readonly color: Color;
   readonly image: string;
}

export type Square = Piece | null;
export type Board = Square[][];

export interface GameState {
   board: Board;
   currentPlayer: Color;
   isInCheck: Color | null;
}

export interface CastlingRights {
   w: { left: boolean; right: boolean };
   b: { left: boolean; right: boolean };
}
