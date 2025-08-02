import { useState } from "react";
import type { Piece } from "../../utils/types";

interface PieceComponentProps {
   piece: Piece;
}

const PieceComponent: React.FC<PieceComponentProps> = ({ piece }) => {
   const [imageError, setImageError] = useState(false);

   const handleImageError = () => {
      setImageError(true);
   };

   if (imageError) {
      const pieceSymbols = {
         king: piece.color === "w" ? "♔" : "♚",
         queen: piece.color === "w" ? "♕" : "♛",
         castle: piece.color === "w" ? "♖" : "♜",
         bishop: piece.color === "w" ? "♗" : "♝",
         horse: piece.color === "w" ? "♘" : "♞",
         pawn: piece.color === "w" ? "♙" : "♟",
      };

      return <span className="text-2xl">{pieceSymbols[piece.type] || "?"}</span>;
   }

   return (
      <img
         src={`/chess-pieces/${piece.type}_${piece.color}.png`}
         alt={`${piece.color} ${piece.type}`}
         className="w-12 h-12 object-contain"
         onError={handleImageError}
      />
   );
};

export default PieceComponent;
