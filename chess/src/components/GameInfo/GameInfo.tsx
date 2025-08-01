import type { Color, Piece } from "../../utils/types";

interface GameInfoProps {
   currentPlayer: Color;
   isInCheck: Color | null;
   capturedPieces: {
      byWhite: Piece[];
      byBlack: Piece[];
   };
   undo: () => void;
   canUndo: boolean;
}

const GameInfo: React.FC<GameInfoProps> = ({
   currentPlayer,
   isInCheck,
   capturedPieces,
   undo,
   canUndo,
}) => (
   <div className="flex flex-col justify-between rounded-md py-3 px-3 bg-amber-100 font-bold w-full overflow-x-auto text-xs sm:text-sm mt-4">
      {isInCheck && (
         <div className="text-red-400 text-center font-bold mb-2 text-sm sm:text-base">
            {isInCheck === "w" ? "White" : "Black"} is in Check!
         </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
         <div className="flex items-center space-x-1">
            Turn:{" "}
            {currentPlayer === "w" ? (
               <div className="flex items-center space-x-1 ml-1">
                  P1
                  <img
                     src="/chess-pieces/castle_w.png"
                     alt="white"
                     className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 object-contain max-w-full"
                  />
               </div>
            ) : (
               <div className="flex items-center space-x-1 ml-1">
                  P2
                  <img
                     src="/chess-pieces/castle_b.png"
                     alt="black"
                     className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 object-contain max-w-full"
                  />
               </div>
            )}
         </div>

         <button
            onClick={undo}
            disabled={canUndo}
            className="bg-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer border"
         >
            Undo
         </button>
      </div>

      <div className="flex items-center flex-wrap gap-1 mt-2">
         P1 captured:{" "}
         {capturedPieces.byWhite.map((piece, index) => (
            <img
               key={`${piece.image}-${index}`}
               src={`/chess-pieces/${piece.type}_${piece.color}.png`}
               alt={`${piece.color} ${piece.type}`}
               className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 object-contain"
            />
         ))}
      </div>

      <div className="flex items-center flex-wrap gap-1 mt-1">
         P2 captured:{" "}
         {capturedPieces.byBlack.map((piece, index) => (
            <img
               key={`${piece.image}-${index}`}
               src={`/chess-pieces/${piece.type}_${piece.color}.png`}
               alt={`${piece.color} ${piece.type}`}
               className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 object-contain"
            />
         ))}
      </div>
   </div>
);

export default GameInfo;
