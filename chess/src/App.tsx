import { useState } from "react";

type Piece = {
   type: string;
   color: string;
   image: string;
};

function App() {
   const [board, setBoard] = useState<Piece[][]>([
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
         .fill({})
         .map(() => ({
            type: "pawn",
            color: "b",
            image: "chess-pieces/pawn_b.png",
         })),

      // Rows 2–5 - Empty
      Array(8).fill({}),
      Array(8).fill({}),
      Array(8).fill({}),
      Array(8).fill({}),

      // Row 6 - White pawns
      Array(8)
         .fill({})
         .map(() => ({
            type: "pawn",
            color: "w",
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
   ]);
   const [selectedPiece, setSelectedPiece] = useState<{
      type: string;
      color: string;
      row: number;
      col: number;
   } | null>(null);
   const [validMoves, setValidMoves] = useState<{ row: number; col: number }[]>([]);

   const showValidMoves = () => {
      const moves: { row: number; col: number }[] = [];
      if (!selectedPiece) {
         setValidMoves([]);
         return;
      }
      const { type, color, row, col } = selectedPiece;

      if (type === "pawn") {
         const dir = color === "w" ? -1 : 1;
         const nextRow = row + dir;

         // One step forward if empty
         if (!board[nextRow]?.[col]?.type) {
            moves.push({ row: nextRow, col });
            if (
               ((row == 6 && color == "w") || (row == 1 && color == "b")) &&
               !board[nextRow]?.[col]?.type
            ) {
               // checking if it is the first ever move for this particular pawn, then it can move another step,
               // given no obstacle.
               moves.push({ row: nextRow + dir, col });
            }
         }

         // diagonal kill
         const leftCorner = col - 1;
         const rightCorner = col + 1;
         if (
            leftCorner >= 0 &&
            board[nextRow]?.[leftCorner]?.type &&
            board[nextRow]?.[leftCorner]?.type !== "pawn"
         ) {
            moves.push({ row: nextRow + dir, col: leftCorner });
         }
         if (
            rightCorner < 8 &&
            board[nextRow]?.[rightCorner]?.type &&
            board[nextRow]?.[rightCorner]?.type !== "pawn"
         ) {
            moves.push({ row: nextRow + dir, col: rightCorner });
         }
      }

      setValidMoves(moves);
   };

   const updateAndDrawBoard = () => {
      return (
         <div className="border relative">
            {board.map((row, rowIndex) => (
               <div className="flex" key={rowIndex}>
                  {row.map((piece, colIndex) => {
                     const isLight = (rowIndex + colIndex) % 2 === 0;
                     const isValidMove = validMoves.find(
                        (move) => move.row === rowIndex && move.col === colIndex
                     );

                     return (
                        <div
                           key={colIndex}
                           className={`w-16 h-16 border flex items-center justify-center ${
                              isLight ? "bg-amber-100" : "bg-amber-600"
                           } ${isValidMove && "border-green-500 border-4"}`}
                           onClick={() => {
                              showValidMoves();
                              setSelectedPiece((prev) => {
                                 if ((prev && prev.col !== colIndex) || prev === null) {
                                    return {
                                       type: piece.type,
                                       color: piece.color,
                                       row: rowIndex,
                                       col: colIndex,
                                    };
                                 } else {
                                    return null;
                                 }
                              });
                           }}
                        >
                           {piece?.image && (
                              <img
                                 src={piece.image}
                                 alt={`${piece.color} ${piece.type}`}
                                 className="w-12 h-12 object-contain"
                              />
                           )}
                        </div>
                     );
                  })}
               </div>
            ))}
         </div>
      );
   };

   return (
      <div>
         <div>
            {/* Turn div */}
            Turn: <div></div>
         </div>

         <div className="flex items-center justify-between relative">
            {/* Board */}
            {updateAndDrawBoard()}
         </div>

         <div className="flex items-center justify-between">
            {/* Board second style, still yet to decide if this is the correct format*/}
            {/* <div className="border">
               <div className="flex">
                  <div className="border w-16 h-16 bg-amber-100"></div>
                  <div className="border w-16 h-16 bg-amber-600"></div>
                  <div className="border w-16 h-16 bg-amber-100"></div>
                  <div className="border w-16 h-16 bg-amber-600"></div>
                  <div className="border w-16 h-16 bg-amber-100"></div>
                  <div className="border w-16 h-16 bg-amber-600"></div>
                  <div className="border w-16 h-16 bg-amber-100"></div>
                  <div className="border w-16 h-16 bg-amber-600"></div>
               </div>
               <div className="flex">
                  <div className="border w-16 h-16 bg-amber-600"></div>
                  <div className="border w-16 h-16 bg-amber-100"></div>
                  <div className="border w-16 h-16 bg-amber-600"></div>
                  <div className="border w-16 h-16 bg-amber-100"></div>
                  <div className="border w-16 h-16 bg-amber-600"></div>
                  <div className="border w-16 h-16 bg-amber-100"></div>
                  <div className="border w-16 h-16 bg-amber-600"></div>
                  <div className="border w-16 h-16 bg-amber-100"></div>
               </div>
               <div className="flex">
                  <div className="border w-16 h-16 bg-amber-100"></div>
                  <div className="border w-16 h-16 bg-amber-600"></div>
                  <div className="border w-16 h-16 bg-amber-100"></div>
                  <div className="border w-16 h-16 bg-amber-600"></div>
                  <div className="border w-16 h-16 bg-amber-100"></div>
                  <div className="border w-16 h-16 bg-amber-600"></div>
                  <div className="border w-16 h-16 bg-amber-100"></div>
                  <div className="border w-16 h-16 bg-amber-600"></div>
               </div>
               <div className="flex">
                  <div className="border w-16 h-16 bg-amber-600"></div>
                  <div className="border w-16 h-16 bg-amber-100"></div>
                  <div className="border w-16 h-16 bg-amber-600"></div>
                  <div className="border w-16 h-16 bg-amber-100"></div>
                  <div className="border w-16 h-16 bg-amber-600"></div>
                  <div className="border w-16 h-16 bg-amber-100"></div>
                  <div className="border w-16 h-16 bg-amber-600"></div>
                  <div className="border w-16 h-16 bg-amber-100"></div>
               </div>
               <div className="flex">
                  <div className="border w-16 h-16 bg-amber-100"></div>
                  <div className="border w-16 h-16 bg-amber-600"></div>
                  <div className="border w-16 h-16 bg-amber-100"></div>
                  <div className="border w-16 h-16 bg-amber-600"></div>
                  <div className="border w-16 h-16 bg-amber-100"></div>
                  <div className="border w-16 h-16 bg-amber-600"></div>
                  <div className="border w-16 h-16 bg-amber-100"></div>
                  <div className="border w-16 h-16 bg-amber-600"></div>
               </div>
               <div className="flex">
                  <div className="border w-16 h-16 bg-amber-600"></div>
                  <div className="border w-16 h-16 bg-amber-100"></div>
                  <div className="border w-16 h-16 bg-amber-600"></div>
                  <div className="border w-16 h-16 bg-amber-100"></div>
                  <div className="border w-16 h-16 bg-amber-600"></div>
                  <div className="border w-16 h-16 bg-amber-100"></div>
                  <div className="border w-16 h-16 bg-amber-600"></div>
                  <div className="border w-16 h-16 bg-amber-100"></div>
               </div>
               <div className="flex">
                  <div className="border w-16 h-16 bg-amber-100"></div>
                  <div className="border w-16 h-16 bg-amber-600"></div>
                  <div className="border w-16 h-16 bg-amber-100"></div>
                  <div className="border w-16 h-16 bg-amber-600"></div>
                  <div className="border w-16 h-16 bg-amber-100"></div>
                  <div className="border w-16 h-16 bg-amber-600"></div>
                  <div className="border w-16 h-16 bg-amber-100"></div>
                  <div className="border w-16 h-16 bg-amber-600"></div>
               </div>
               <div className="flex">
                  <div className="border w-16 h-16 bg-amber-600"></div>
                  <div className="border w-16 h-16 bg-amber-100"></div>
                  <div className="border w-16 h-16 bg-amber-600"></div>
                  <div className="border w-16 h-16 bg-amber-100"></div>
                  <div className="border w-16 h-16 bg-amber-600"></div>
                  <div className="border w-16 h-16 bg-amber-100"></div>
                  <div className="border w-16 h-16 bg-amber-600"></div>
                  <div className="border w-16 h-16 bg-amber-100"></div>
               </div>
            </div> */}
         </div>

         <div>{/* Pices taken from p1 and p2 */}</div>
      </div>
   );
}

export default App;
