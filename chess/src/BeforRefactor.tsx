import { useState } from "react";

type Piece = {
   type: string;
   color: string;
   image: string;
} | null;

function App() {
   const [turn, setTurn] = useState<"w" | "b">("w");
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
      Array(8).fill(null),
      Array(8).fill(null),
      Array(8).fill(null),
      Array(8).fill(null),

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
   const [hasKingMoved, setHasKingMoved] = useState({ w: false, b: false });
   const [hasRookMoved, setHasRookMoved] = useState({
      w: { left: false, right: false },
      b: { left: false, right: false },
   });
   const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
   const [isInCheck, setIsInCheck] = useState<"w" | "b" | null>(null);
   const [validMoves, setValidMoves] = useState<[number, number][]>([]);
   const [capturedHistory, setCapturedHistory] = useState<
      { capturedBy: "w" | "b"; piece: Piece }[]
   >([]);
   const [history, setHistory] = useState<{
      board: Piece[][][];
      captured: { capturedBy: "w" | "b"; piece: Piece }[][];
      kingMoved: { w: boolean; b: boolean }[];
      rookMoved: {
         w: { left: boolean; right: boolean };
         b: { left: boolean; right: boolean };
      }[];
   }>({
      board: [],
      captured: [],
      kingMoved: [],
      rookMoved: [],
   });

   // Get all possible moves for a piece at given position
   const getPossibleMoves = (
      type: string,
      color: string,
      row: number,
      col: number,
      boardToCheck: Piece[][]
   ): [number, number][] => {
      const moves: [number, number][] = [];

      if (type === "pawn") {
         const direction = color === "w" ? -1 : 1;
         const startRow = color === "w" ? 6 : 1;

         // Move 1 step forward if empty
         if (boardToCheck[row + direction]?.[col] === null) {
            moves.push([row + direction, col]);

            // Move 2 steps forward from starting row
            if (row === startRow && boardToCheck[row + direction * 2]?.[col] === null) {
               moves.push([row + direction * 2, col]);
            }
         }

         // Captures diagonally
         for (const dCol of [-1, 1]) {
            const target = boardToCheck[row + direction]?.[col + dCol];
            if (target && target.color && target.color !== color) {
               moves.push([row + direction, col + dCol]);
            }
         }
      }

      if (type === "castle") {
         // Down
         for (let i = row + 1; i < 8; i++) {
            if (!boardToCheck[i][col]) moves.push([i, col]);
            else {
               if (boardToCheck[i][col]?.color !== color) moves.push([i, col]);
               break;
            }
         }
         // Up
         for (let i = row - 1; i >= 0; i--) {
            if (!boardToCheck[i][col]) moves.push([i, col]);
            else {
               if (boardToCheck[i][col]?.color !== color) moves.push([i, col]);
               break;
            }
         }
         // Right
         for (let i = col + 1; i < 8; i++) {
            if (!boardToCheck[row][i]) moves.push([row, i]);
            else {
               if (boardToCheck[row][i]?.color !== color) moves.push([row, i]);
               break;
            }
         }
         // Left
         for (let i = col - 1; i >= 0; i--) {
            if (!boardToCheck[row]?.[i]) moves.push([row, i]);
            else {
               if (boardToCheck[row][i]?.color !== color) moves.push([row, i]);
               break;
            }
         }
      }

      if (type === "bishop") {
         // ↘
         for (let i = 1; row + i < 8 && col + i < 8; i++) {
            const target = boardToCheck[row + i][col + i];
            if (!target) moves.push([row + i, col + i]);
            else {
               if (target.color !== color) moves.push([row + i, col + i]);
               break;
            }
         }
         // ↙
         for (let i = 1; row + i < 8 && col - i >= 0; i++) {
            const target = boardToCheck[row + i][col - i];
            if (!target) moves.push([row + i, col - i]);
            else {
               if (target?.color !== color) moves.push([row + i, col - i]);
               break;
            }
         }
         // ↖
         for (let i = 1; row - i >= 0 && col - i >= 0; i++) {
            const target = boardToCheck[row - i][col - i];
            if (!target) moves.push([row - i, col - i]);
            else {
               if (target?.color !== color) moves.push([row - i, col - i]);
               break;
            }
         }
         // ↗
         for (let i = 1; row - i >= 0 && col + i < 8; i++) {
            const target = boardToCheck[row - i][col + i];
            if (!target) moves.push([row - i, col + i]);
            else {
               if (target?.color !== color) moves.push([row - i, col + i]);
               break;
            }
         }
      }

      if (type === "queen") {
         // Combine rook and bishop moves
         const rookMoves = getPossibleMoves("castle", color, row, col, boardToCheck);
         const bishopMoves = getPossibleMoves("bishop", color, row, col, boardToCheck);
         moves.push(...rookMoves, ...bishopMoves);
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
               boardToCheck[dirX]?.[dirY]?.color === color
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

            const targetPiece = boardToCheck[newRow][newCol];

            if (!targetPiece || targetPiece?.color !== color) {
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
            !boardToCheck[kingRow][5] &&
            !boardToCheck[kingRow][6] &&
            boardToCheck[kingRow][7]?.type === "castle" &&
            boardToCheck[kingRow][7]?.color === color
         ) {
            moves.push([kingRow, 6]); // King moves two steps to the right
         }

         // Queenside (left rook)
         if (
            !hasKingMoved[colorKey] &&
            !hasRookMoved[colorKey]?.left &&
            !boardToCheck[kingRow][1] &&
            !boardToCheck[kingRow][2] &&
            !boardToCheck[kingRow][3] &&
            boardToCheck[kingRow][0]?.type === "castle" &&
            boardToCheck[kingRow][0]?.color === color
         ) {
            moves.push([kingRow, 2]); // King moves two steps to the left
         }
      }

      return moves;
   };

   const showValidMoves = (type: string, color: "w" | "b", row: number, col: number) => {
      if (selectedCell && selectedCell[0] === row && selectedCell[1] === col) {
         setSelectedCell(null);
         setValidMoves([]);
         return;
      }

      setSelectedCell([row, col]);
      const allMoves = getPossibleMoves(type, color, row, col, board);

      // Filter out moves that would put own king in check
      const legalMoves = allMoves.filter(([toRow, toCol]) => {
         const testBoard = board.map((r) => [...r]);
         testBoard[toRow][toCol] = testBoard[row][col];
         testBoard[row][col] = null;
         return !isKingInCheck(color, testBoard);
      });

      setValidMoves(legalMoves);
   };

   const isKingInCheck = (color: "w" | "b", boardToCheck: Piece[][]): boolean => {
      let kingPos: [number, number] | null = null;

      // Find king
      for (let r = 0; r < 8; r++) {
         for (let c = 0; c < 8; c++) {
            const p = boardToCheck[r][c];
            if (p?.type === "king" && p.color === color) {
               kingPos = [r, c];
               break;
            }
         }
      }

      if (!kingPos) return true; // King missing? Game over!

      const enemyColor = color === "w" ? "b" : "w";

      // Check if any enemy piece can attack the king
      for (let r = 0; r < 8; r++) {
         for (let c = 0; c < 8; c++) {
            const piece = boardToCheck[r][c];
            if (piece && piece.color === enemyColor) {
               const attackMoves = getPossibleMoves(
                  piece.type,
                  piece.color,
                  r,
                  c,
                  boardToCheck
               );
               if (
                  attackMoves.some(([mr, mc]) => mr === kingPos![0] && mc === kingPos![1])
               ) {
                  return true;
               }
            }
         }
      }

      return false;
   };

   const hasLegalMove = (color: "w" | "b", boardToCheck: Piece[][]): boolean => {
      for (let r = 0; r < 8; r++) {
         for (let c = 0; c < 8; c++) {
            const piece = boardToCheck[r][c];
            if (piece && piece.color === color) {
               const allMoves = getPossibleMoves(piece.type, color, r, c, boardToCheck);

               // Check if any move would get the king out of check
               for (const [toRow, toCol] of allMoves) {
                  const testBoard = boardToCheck.map((row) => [...row]);
                  testBoard[toRow][toCol] = testBoard[r][c];
                  testBoard[r][c] = null;

                  if (!isKingInCheck(color, testBoard)) {
                     return true;
                  }
               }
            }
         }
      }
      return false;
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

      // Save current state to history
      setHistory((prev) => ({
         board: [...prev.board, board.map((row) => [...row])],
         captured: [...prev.captured, [...capturedHistory]],
         kingMoved: [...prev.kingMoved, { ...hasKingMoved }],
         rookMoved: [
            ...prev.rookMoved,
            {
               w: { ...hasRookMoved.w },
               b: { ...hasRookMoved.b },
            },
         ],
      }));

      if (target && target.type && target.color !== piece?.color) {
         setCapturedHistory((prev) => [
            ...prev,
            { capturedBy: piece?.color as "w" | "b", piece: target },
         ]);
      }

      const newBoard = board.map((r, rIndex) =>
         r.map((c, cIndex) => {
            if (rIndex === fromRow && cIndex === fromCol) return null;
            if (rIndex === row && cIndex === col) return piece;
            return c;
         })
      );

      if (piece?.type === "pawn" && (row === 0 || row === 7)) {
         newBoard[row][col] = {
            type: "queen",
            color: piece.color,
            image: `chess-pieces/queen_${piece.color}.png`,
         };
      }

      // Handle Castling
      if (piece?.type === "king") {
         const color = piece?.color as "w" | "b";
         const isWhite = color === "w";
         const kingRow = isWhite ? 7 : 0;

         // Kingside castling (toCol === 6)
         if (fromCol === 4 && col === 6) {
            newBoard[kingRow][5] = newBoard[kingRow][7];
            newBoard[kingRow][7] = null;
            setHasRookMoved((prev) => ({
               ...prev,
               [color]: { ...prev[color], right: true },
            }));
         }

         // Queenside castling (toCol === 2)
         if (fromCol === 4 && col === 2) {
            newBoard[kingRow][3] = newBoard[kingRow][0];
            newBoard[kingRow][0] = null;
            setHasRookMoved((prev) => ({
               ...prev,
               [color]: { ...prev[color], left: true },
            }));
         }

         setHasKingMoved((prev) => ({ ...prev, [color]: true }));
      }

      // Update rook moved when a rook moves
      if (piece?.type === "castle") {
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

      const nextTurn = turn === "w" ? "b" : "w";

      setBoard(newBoard);
      setSelectedCell(null);
      setValidMoves([]);

      // Check game state
      if (isKingInCheck(nextTurn, newBoard)) {
         setIsInCheck(nextTurn);
         if (!hasLegalMove(nextTurn, newBoard)) {
            alert(`Checkmate! ${turn === "w" ? "White" : "Black"} wins!`);
         }
      } else {
         setIsInCheck(null);
         if (!hasLegalMove(nextTurn, newBoard)) {
            alert("Stalemate!");
         }
      }

      if (isInsufficientMaterial(newBoard)) {
         alert("Draw - Insufficient material!");
      }

      setTurn(nextTurn);
   };

   const isInsufficientMaterial = (boardToCheck: Piece[][]): boolean => {
      const allPieces = boardToCheck.flat().filter(Boolean);
      if (
         allPieces.every(
            (p) => p?.type === "king" || p?.type === "bishop" || p?.type === "horse"
         )
      ) {
         return true;
      }
      return false;
   };

   const undoMove = () => {
      if (history.board.length === 0) return;

      const lastBoardState = history.board[history.board.length - 1];
      const lastCapturedState = history.captured[history.captured.length - 1];
      const lastKingMovedState = history.kingMoved[history.kingMoved.length - 1];
      const lastRookMovedState = history.rookMoved[history.rookMoved.length - 1];

      setBoard(lastBoardState);
      setCapturedHistory(lastCapturedState);
      setHasKingMoved(lastKingMovedState);
      setHasRookMoved(lastRookMovedState);

      setHistory((prev) => ({
         board: prev.board.slice(0, -1),
         captured: prev.captured.slice(0, -1),
         kingMoved: prev.kingMoved.slice(0, -1),
         rookMoved: prev.rookMoved.slice(0, -1),
      }));

      const previousTurn = turn === "w" ? "b" : "w";
      setTurn(previousTurn);

      // Check if the previous player is in check after undo
      if (isKingInCheck(previousTurn, lastBoardState)) {
         setIsInCheck(previousTurn);
      } else {
         setIsInCheck(null);
      }

      setSelectedCell(null);
      setValidMoves([]);
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
               {isInCheck && (
                  <div className="text-red-400 text-xl text-center font-bold">
                     {isInCheck === "w" ? "White" : "Black"} is in Check!
                  </div>
               )}

               {board.map((row, rowIndex) => (
                  <div className="flex" key={rowIndex}>
                     {row.map((piece, colIndex) => {
                        const isLight = (rowIndex + colIndex) % 2 === 0;
                        const isSelected =
                           selectedCell &&
                           rowIndex === selectedCell[0] &&
                           colIndex === selectedCell[1];
                        const isValidTarget = validMoves.some(
                           ([r, c]) => r === rowIndex && c === colIndex
                        );

                        return (
                           <div
                              key={colIndex}
                              onClick={() => {
                                 if (isValidTarget) {
                                    handleNewMove(rowIndex, colIndex);
                                 } else if (piece && piece.color === turn) {
                                    showValidMoves(
                                       piece.type,
                                       piece.color,
                                       rowIndex,
                                       colIndex
                                    );
                                 }
                              }}
                              className={`w-16 h-16 border-2 flex items-center justify-center rounded-md cursor-pointer
                                 ${isSelected ? "border-4 border-green-500" : ""}
                                 ${isLight ? "bg-amber-100" : "bg-amber-600"}
                                 ${
                                    isValidTarget
                                       ? "ring-4 ring-blue-400 ring-opacity-60"
                                       : ""
                                 }
                              `}
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
               <div className="flex items-center flex-wrap">
                  P1:{" "}
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

               <div className="flex items-center flex-wrap">
                  P2:
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
            </div>
            <button
               onClick={undoMove}
               disabled={history.board.length === 0}
               className="bg-white px-4 py-2 rounded-md mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
               Undo Move
            </button>
         </div>
      </div>
   );
}

export default App;
