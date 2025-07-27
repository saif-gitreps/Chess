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
   const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
   const [validMoves, setValidMoves] = useState<[number, number][]>([]);

   const showValidMoves = (type: string, color: string, row: number, col: number) => {
      if (selectedCell && selectedCell[0] == row && selectedCell[1] == col) {
         setSelectedCell(null);
         return;
      }

      setSelectedCell([row, col]);
      const moves: [number, number][] = [];

      if (type === "pawn") {
         const direction = color === "w" ? -1 : 1;
         const startRow = color === "w" ? 6 : 1;

         // Move 1 step forward if empty
         if (board[row + direction]?.[col]?.type === undefined) {
            moves.push([row + direction, col]);

            // Move 2 steps forward from starting row
            if (
               row === startRow &&
               board[row + direction * 2]?.[col]?.type === undefined
            ) {
               moves.push([row + direction * 2, col]);
            }
         }

         // Captures diagonally
         for (const dCol of [-1, 1]) {
            const target = board[row + direction]?.[col + dCol];
            if (target && target.color && target.color !== color) {
               moves.push([row + direction, col + dCol]);
            }
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

                     return (
                        <div
                           key={colIndex}
                           onClick={() =>
                              showValidMoves(piece.type, piece.color, rowIndex, colIndex)
                           }
                           className={`w-16 h-16 border flex items-center justify-center ${
                              isLight ? "bg-amber-100" : "bg-amber-600"
                           }
                            ${
                               validMoves.some(
                                  ([r, c]) => r === rowIndex && c === colIndex
                               )
                                  ? "border-4 border-green-400"
                                  : ""
                            }`}
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

         <div>{/* Pices taken from p1 and p2 */}</div>
      </div>
   );
}

export default App;
