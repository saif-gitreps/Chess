import type { Color, Position } from "./types";

export const isValidPosition = (position: Position): boolean => {
   const [row, col] = position;
   return row >= 0 && row < 8 && col >= 0 && col < 8;
};

export const getOppositeColor = (color: Color): Color => (color === "w" ? "b" : "w");
