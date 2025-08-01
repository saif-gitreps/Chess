import type React from "react";
import type { Board, Position } from "../../utils/types";
import SquareComponent from "./Square";

interface BoardProps {
   board: Board;
   selectedSquare: Position | null;
   legalMoves: Position[];
   onSquareClick: (position: Position) => void;
}

const BoardComponent: React.FC<BoardProps> = ({
   board,
   selectedSquare,
   legalMoves,
   onSquareClick,
}) => (
   <div className="flex justify-center overflow-x-auto">
      <div className="border-4">
         {board.map((row, rowIndex) => (
            <div className="flex" key={rowIndex}>
               {row.map((piece, colIndex) => (
                  <SquareComponent
                     key={`${rowIndex}-${colIndex}`}
                     position={[rowIndex, colIndex]}
                     piece={piece}
                     isSelected={
                        selectedSquare?.[0] === rowIndex &&
                        selectedSquare?.[1] === colIndex
                     }
                     isLegalMove={legalMoves.some(
                        ([r, c]) => r === rowIndex && c === colIndex
                     )}
                     onClick={onSquareClick}
                  />
               ))}
            </div>
         ))}
      </div>
   </div>
);

export default BoardComponent;
