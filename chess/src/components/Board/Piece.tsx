import type { Piece } from "../../utils/types";

interface PieceComponentProps {
   piece: Piece;
}

const PieceComponent: React.FC<PieceComponentProps> = ({ piece }) => (
   <img
      src={piece.image}
      alt={`${piece.color} ${piece.type}`}
      className="w-12 h-12 object-contain"
   />
);

export default PieceComponent;
