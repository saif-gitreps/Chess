import { useCallback, useState } from "react";
import type { CastlingRights, Color, GameState, Piece } from "../utils/types";

const useGameHistory = () => {
   const [history, setHistory] = useState<
      {
         gameState: GameState;
         hasKingMoved: { w: boolean; b: boolean };
         hasRookMoved: CastlingRights;
         capturedHistory: { capturedBy: Color; piece: Piece }[];
      }[]
   >([]);

   const addToHistory = useCallback(
      (
         gameState: GameState,
         hasKingMoved: { w: boolean; b: boolean },
         hasRookMoved: CastlingRights,
         capturedHistory: { capturedBy: Color; piece: Piece }[]
      ) => {
         setHistory((prev) => [
            ...prev,
            { gameState, hasKingMoved, hasRookMoved, capturedHistory },
         ]);
      },
      []
   );

   const undo = useCallback(() => {
      if (history.length === 0) return null;
      const lastState = history[history.length - 1];
      setHistory((prev) => prev.slice(0, -1));
      return lastState;
   }, [history]);

   return {
      canUndo: history.length > 0,
      addToHistory,
      undo,
   };
};

export default useGameHistory;
