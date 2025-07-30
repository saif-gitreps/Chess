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
   <div className="flex flex-col justify-between rounded-md py-1 px-3 bg-amber-100 font-bold w-full">
      {isInCheck && (
         <div className="text-red-400 text-xl text-center font-bold mb-2">
            {isInCheck === "w" ? "White" : "Black"} is in Check!
         </div>
      )}

      <div className="flex justify-between ">
         <div className="flex items-center space-x-1">
            Turn:{" "}
            {currentPlayer === "w" ? (
               <div className="flex items-center space-x-1 ml-1">
                  P1
                  <img
                     src="chess-pieces/castle_w.png"
                     alt="white"
                     className="w-8 h-8 object-contain"
                  />
               </div>
            ) : (
               <div className="flex items-center space-x-1 ml-1">
                  P2
                  <img
                     src="chess-pieces/castle_b.png"
                     alt="black"
                     className="w-8 h-8 object-contain"
                  />
               </div>
            )}
         </div>

         <div>
            <button
               onClick={undo}
               disabled={canUndo}
               className="bg-white px-4 py-2 rounded-md mt-2 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer border"
            >
               Undo
            </button>

            <button
               onClick={() => {
                  window.location.reload();
               }}
               disabled={canUndo}
               className="bg-white px-4 py-2 rounded-md mt-2 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer border"
            >
               Reset
            </button>
         </div>
      </div>

      <div className="flex items-center flex-wrap">
         P1 captured:{" "}
         {capturedPieces.byWhite.map((piece, index) => (
            <img
               key={`${piece.image}-${index}`}
               src={piece.image}
               alt={`${piece.color} ${piece.type}`}
               className="w-8 h-8 object-contain"
            />
         ))}
      </div>

      <div className="flex items-center flex-wrap">
         P2 captured:{" "}
         {capturedPieces.byBlack.map((piece, index) => (
            <img
               key={`${piece.image}-${index}`}
               src={piece.image}
               alt={`${piece.color} ${piece.type}`}
               className="w-8 h-8 object-contain"
            />
         ))}
      </div>
   </div>
);

export default GameInfo;
