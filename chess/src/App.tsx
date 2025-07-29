import { useState } from "react";

type Piece = {
   type: string;
   color: string;
   image: string;
} | null;

function App() {
   const [turn, setTurn] = useState<string>("w");
   const [board, setBoard] = useState<Piece[][]>([
      // Row 0 - Black major pieces
      [
         { type: "castle", color: "b", image: "chess-pieces/castle_b.png" },
         { type: "horse", color: "b", image: "chess-pieces/horse_b.png" },
         { type: "bishop", color: "b", image: "chess-pieces/bishop_b.png" },
         { type: "queen", color: "b", image: "chess-pieces/king_b.png" },
         { type: "king", color: "b", image: "chess-pieces/queen_b.png" },
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
         { type: "queen", color: "w", image: "chess-pieces/king_w.png" },
         { type: "king", color: "w", image: "chess-pieces/queen_w.png" },
         { type: "bishop", color: "w", image: "chess-pieces/bishop_w.png" },
         { type: "horse", color: "w", image: "chess-pieces/horse_w.png" },
         { type: "castle", color: "w", image: "chess-pieces/castle_w.png" },
      ],
   ]);
   const [hasKingMoved, setHasKingMoved] = useState({ w: false, b: false });
   const [hasRookMoved, setHasRookMoved] = useState({
      w: { left: false, right: false },
      b: { left: false, right: false },
   });
   const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
   const [validMoves, setValidMoves] = useState<[number, number][]>([]);
   const [capturedHistory, setCapturedHistory] = useState<
      { capturedBy: "w" | "b"; piece: Piece }[]
   >([]);
   const showValidMoves = (type: string, color: string, row: number, col: number) => {
      if (selectedCell && selectedCell[0] == row && selectedCell[1] == col) {
         setSelectedCell(null);
         setValidMoves([]);
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

      if (type === "castle") {
         // Down
         for (let i = row + 1; i < 8; i++) {
            if (!board[i][col]?.type) moves.push([i, col]);
            else {
               if (board[i][col]?.color !== color) moves.push([i, col]);
               break;
            }
         }
         // Up
         for (let i = row - 1; i >= 0; i--) {
            if (!board[i][col]?.type) moves.push([i, col]);
            else {
               if (board[i][col]?.color !== color) moves.push([i, col]);
               break;
            }
         }
         // Right
         for (let i = col + 1; i < 8; i++) {
            if (!board[row][i]?.type) moves.push([row, i]);
            else {
               if (board[row][i]?.color !== color) moves.push([row, i]);
               break;
            }
         }
         // Left
         for (let i = col - 1; i >= 0; i--) {
            if (!board[row]?.[i]?.type) moves.push([row, i]);
            else {
               if (board[row][i]?.color !== color) moves.push([row, i]);
               break;
            }
         }
      }

      if (type === "bishop") {
         // ↘
         for (let i = 1; row + i < 8 && col + i < 8; i++) {
            const target = board[row + i][col + i];
            if (!target?.type) moves.push([row + i, col + i]);
            else {
               if (target.color !== color) moves.push([row + i, col + i]);
               break;
            }
         }
         // ↙
         for (let i = 1; row + i < 8 && col - i >= 0; i++) {
            const target = board[row + i][col - i];
            if (!target?.type) moves.push([row + i, col - i]);
            else {
               if (target?.color !== color) moves.push([row + i, col - i]);
               break;
            }
         }
         // ↖
         for (let i = 1; row - i >= 0 && col - i >= 0; i++) {
            const target = board[row - i][col - i];
            if (!target?.type) moves.push([row - i, col - i]);
            else {
               if (target?.color !== color) moves.push([row - i, col - i]);
               break;
            }
         }
         // ↗
         for (let i = 1; row - i >= 0 && col + i < 8; i++) {
            const target = board[row - i][col + i];
            if (!target?.type) moves.push([row - i, col + i]);
            else {
               if (target?.color !== color) moves.push([row - i, col + i]);
               break;
            }
         }
      }

      if (type === "queen") {
         // ↘
         for (let i = 1; row + i < 8 && col + i < 8; i++) {
            const target = board[row + i][col + i];
            if (!target?.type) moves.push([row + i, col + i]);
            else {
               if (target.color !== color) moves.push([row + i, col + i]);
               break;
            }
         }
         // ↙
         for (let i = 1; row + i < 8 && col - i >= 0; i++) {
            const target = board[row + i][col - i];
            if (!target?.type) moves.push([row + i, col - i]);
            else {
               if (target?.color !== color) moves.push([row + i, col - i]);
               break;
            }
         }
         // ↖
         for (let i = 1; row - i >= 0 && col - i >= 0; i++) {
            const target = board[row - i][col - i];
            if (!target?.type) moves.push([row - i, col - i]);
            else {
               if (target?.color !== color) moves.push([row - i, col - i]);
               break;
            }
         }
         // ↗
         for (let i = 1; row - i >= 0 && col + i < 8; i++) {
            const target = board[row - i][col + i];
            if (!target?.type) moves.push([row - i, col + i]);
            else {
               if (target?.color !== color) moves.push([row - i, col + i]);
               break;
            }
         }

         // Down
         for (let i = row + 1; i < 8; i++) {
            if (!board[i][col]?.type) moves.push([i, col]);
            else {
               if (board[i][col]?.color !== color) moves.push([i, col]);
               break;
            }
         }
         // Up
         for (let i = row - 1; i >= 0; i--) {
            if (!board[i][col]?.type) moves.push([i, col]);
            else {
               if (board[i][col]?.color !== color) moves.push([i, col]);
               break;
            }
         }
         // Right
         for (let i = col + 1; i < 8; i++) {
            if (!board[row][i]?.type) moves.push([row, i]);
            else {
               if (board[row][i]?.color !== color) moves.push([row, i]);
               break;
            }
         }
         // Left
         for (let i = col - 1; i >= 0; i--) {
            if (!board[row]?.[i]?.type) moves.push([row, i]);
            else {
               if (board[row][i]?.color !== color) moves.push([row, i]);
               break;
            }
         }
      }

      if (type === "horse") {
         const blocksToJump = [
            [-2, -1],
            [-1, -2],
            [-2, 1],
            [-1, 2],
            [2, -1],
            [1, -2],
            [2, 1],
            [1, 2],
         ];

         for (const block of blocksToJump) {
            const dirX = row + block[0];
            const dirY = col + block[1];
            if (
               dirX >= 8 ||
               dirX < 0 ||
               dirY < 0 ||
               dirY >= 8 ||
               board[dirX]?.[dirY]?.color === color
            ) {
               continue;
            }

            moves.push([dirX, dirY]);
         }
      }

      if (type === "king") {
         const blocksToJump = [
            [-1, -1],
            [-1, 0],
            [-1, 1],
            [0, -1],
            [0, 1],
            [1, -1],
            [1, 0],
            [1, 1],
         ];

         for (const [dx, dy] of blocksToJump) {
            const newRow = row + dx;
            const newCol = col + dy;

            if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) continue;

            const targetPiece = board[newRow][newCol];

            if (!targetPiece?.type || targetPiece?.color !== color) {
               moves.push([newRow, newCol]);
            }
         }

         const isWhite = color === "w";
         const kingRow = isWhite ? 7 : 0;
         const colorKey = color as "w" | "b";

         // Kingside (right rook)
         if (
            !hasKingMoved[colorKey] &&
            !hasRookMoved[colorKey].right &&
            !board[kingRow][5]?.type &&
            !board[kingRow][6]?.type &&
            board[kingRow][7]?.type === "castle" &&
            board[kingRow][7]?.color === color
         ) {
            moves.push([kingRow, 6]); // King moves two steps to the right
         }

         // Queenside (left rook)
         if (
            !hasKingMoved[colorKey] &&
            !hasRookMoved[colorKey]?.left &&
            !board[kingRow][1]?.type &&
            !board[kingRow][2]?.type &&
            !board[kingRow][3]?.type &&
            board[kingRow][0]?.type === "castle" &&
            board[kingRow][0]?.color === color
         ) {
            moves.push([kingRow, 2]); // King moves two steps to the left
         }
      }

      setValidMoves(moves);
   };

   const handleNewMove = (row: number, col: number) => {
      if (!selectedCell) return;

      const [fromRow, fromCol] = selectedCell;
      const piece = board[fromRow][fromCol];
      const target = board[row][col];

      if (
         (turn === "w" && piece?.color !== "w") ||
         (turn === "b" && piece?.color !== "b")
      )
         return;

      const isValidMove = validMoves.some(([r, c]) => r === row && c === col);
      if (!isValidMove) return;

      if (
         target &&
         typeof target === "object" &&
         target.type && // or target.color if that always exists
         target.color !== piece?.color
      ) {
         setCapturedHistory((prev) => [
            ...prev,
            { capturedBy: piece?.color as "w" | "b", piece: target },
         ]);
      }

      const newBoard = board.map((r, rIndex) =>
         r.map((c, cIndex) => {
            if (rIndex === fromRow && cIndex === fromCol) return null; // clear old
            if (rIndex === row && cIndex === col) return piece; // move to new
            return c;
         })
      );

      // --- Handle Castling ---
      if (piece?.type === "king") {
         const color = piece?.color as "w" | "b";
         const isWhite = color === "w";
         const row = isWhite ? 7 : 0;

         // Kingside castling (toCol === 6)
         if (fromCol === 4 && col === 6) {
            newBoard[row][5] = newBoard[row][7]; // Move rook
            newBoard[row][7] = { type: "", color: "", image: "" }; // Clear old rook
            setHasRookMoved((prev) => ({
               ...prev,
               [color]: { ...prev[color], right: true },
            }));
         }

         // Queenside castling (toCol === 2)
         if (fromCol === 4 && col === 2) {
            newBoard[row][3] = newBoard[row][0]; // Move rook
            newBoard[row][0] = { type: "", color: "", image: "" }; // Clear old rook
            setHasRookMoved((prev) => ({
               ...prev,
               [color]: { ...prev[color], left: true },
            }));
         }

         setHasKingMoved((prev) => ({ ...prev, [color]: true }));
      }

      // 🟩 Optionally update rookMoved when a rook moves (not castling)
      if (piece?.type === "caslte") {
         const rookColor = piece?.color as "w" | "b";
         if (fromCol === 0) {
            setHasRookMoved((prev) => ({
               ...prev,
               [rookColor]: { ...prev[rookColor], left: true },
            }));
         }
         if (fromCol === 7) {
            setHasRookMoved((prev) => ({
               ...prev,
               [rookColor]: { ...prev[rookColor], right: true },
            }));
         }
      }

      setBoard(newBoard);
      setSelectedCell(null);
      setValidMoves([]);
      setTurn((prev) => (prev === "w" ? "b" : "w"));
   };

   const piecesTakenFromWhite = capturedHistory
      .filter((entry) => entry.capturedBy === "b")
      .map((entry) => entry.piece);

   const piecesTakenFromBlack = capturedHistory
      .filter((entry) => entry.capturedBy === "w")
      .map((entry) => entry.piece);

   const updateAndDrawBoard = () => {
      return (
         <div className="flex justify-center">
            <div className="border-4">
               {board.map((row, rowIndex) => (
                  <div className="flex" key={rowIndex}>
                     {row.map((piece, colIndex) => {
                        const isLight = (rowIndex + colIndex) % 2 === 0;

                        return (
                           <div
                              key={colIndex}
                              onClick={() => {
                                 const isValidTarget = validMoves.some(
                                    ([r, c]) => r === rowIndex && c === colIndex
                                 );

                                 if (isValidTarget) {
                                    handleNewMove(rowIndex, colIndex);
                                 } else {
                                    showValidMoves(
                                       piece?.type as string,
                                       piece?.color as string,
                                       rowIndex,
                                       colIndex
                                    );
                                 }
                              }}
                              className={`w-16 h-16 border-2 flex items-center justify-center rounded-md
                           ${
                              selectedCell &&
                              rowIndex == selectedCell[0] &&
                              colIndex === selectedCell[1] &&
                              "opacity-60"
                           }
                           ${isLight ? "bg-amber-100" : "bg-amber-600"}
                            ${
                               validMoves.some(
                                  ([r, c]) => r === rowIndex && c === colIndex
                               )
                                  ? "opacity-80"
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
         </div>
      );
   };

   return (
      <div className="bg-black h-screen">
         <div className="items-center max-w-lg mx-auto">
            {/* Board */}

            {updateAndDrawBoard()}

            <div className="flex flex-col justify-between rounded-md py-1 px-3 bg-amber-100 font-bold w-full">
               <div className="flex items-center space-x-1 ">
                  Turn:{" "}
                  {turn === "w" ? (
                     <div className="flex items-center space-x-1 ml-1">
                        P1
                        <img
                           src={"chess-pieces/castle_w.png"}
                           alt={`white`}
                           className="w-8 h-8 object-contain"
                        />
                     </div>
                  ) : (
                     <div className="flex items-center space-x-1 ml-1">
                        P2
                        <img
                           src={"chess-pieces/castle_b.png"}
                           alt={`black`}
                           className="w-8 h-8 object-contain"
                        />
                     </div>
                  )}
               </div>
               <div className="flex items-center">
                  P1:
                  {piecesTakenFromWhite.length > 0 &&
                     piecesTakenFromWhite.map((piece, index) => (
                        <img
                           key={piece?.image + " " + index}
                           src={piece?.image}
                           alt={`${piece?.color} ${piece?.type}`}
                           className="w-8 h-8 object-contain"
                        />
                     ))}
               </div>

               <div className="flex items-center">
                  P2:
                  {piecesTakenFromBlack.length > 0 &&
                     piecesTakenFromBlack.map((piece, index) => (
                        <img
                           key={piece?.image + " " + index}
                           src={piece?.image}
                           alt={`${piece?.color} ${piece?.type}`}
                           className="w-8 h-8 object-contain"
                        />
                     ))}
               </div>
            </div>
         </div>
      </div>
   );
}

export default App;
