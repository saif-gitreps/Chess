import { useCallback } from "react";
import type { Board, CastlingRights, Color, Position } from "../utils/types";
import { getAllPossibleMoves } from "../utils/moveCalculator";
import { applyMove, isKingInCheck } from "../utils/gameValidators";

const useMoveValidation = (
   hasKingMoved: { w: boolean; b: boolean },
   hasRookMoved: CastlingRights
) => {
   const getLegalMoves = useCallback(
      (board: Board, position: Position): Position[] => {
         const piece = board[position[0]][position[1]];
         if (!piece) return [];

         const possibleMoves = getAllPossibleMoves(
            board,
            position,
            hasKingMoved,
            hasRookMoved
         );

         // Filter out moves that would put own king in check
         return possibleMoves.filter((to) => {
            const testBoard = applyMove(board, position, to);
            return !isKingInCheck(testBoard, piece.color, hasKingMoved, hasRookMoved);
         });
      },
      [hasKingMoved, hasRookMoved]
   );

   const isValidMove = useCallback(
      (board: Board, from: Position, to: Position, currentPlayer: Color): boolean => {
         const piece = board[from[0]][from[1]];
         if (!piece || piece.color !== currentPlayer) return false;

         const legalMoves = getLegalMoves(board, from);
         return legalMoves.some(([r, c]) => r === to[0] && c === to[1]);
      },
      [getLegalMoves]
   );

   return { getLegalMoves, isValidMove };
};

export default useMoveValidation;
