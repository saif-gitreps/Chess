import type React from "react";
import type { Position, Square } from "../../utils/types";
import PieceComponent from "./Piece";

interface SquareProps {
   position: Position;
   piece: Square;
   isSelected: boolean;
   isLegalMove: boolean;
   onClick: (position: Position) => void;
}

const SquareComponent: React.FC<SquareProps> = ({
   position,
   piece,
   isSelected,
   isLegalMove,
   onClick,
}) => {
   const [row, col] = position;
   const isLight = (row + col) % 2 === 0;

   return (
      <div
         onClick={() => onClick(position)}
         className={`
        w-16 h-16 border-2 flex items-center justify-center rounded-md cursor-pointer
        ${isSelected ? "border-4 border-green-500" : ""}
        ${isLight ? "bg-amber-100" : "bg-amber-600"}
        ${isLegalMove ? "border-4 border-blue-400" : ""}
      `}
      >
         {piece && <PieceComponent piece={piece} />}
      </div>
   );
};

export default SquareComponent;
