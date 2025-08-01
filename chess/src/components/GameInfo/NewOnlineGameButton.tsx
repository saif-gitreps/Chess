import { type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface NewOnlineGameButtonProps {
   children: ReactNode;
}

function NewOnlineGameButton({ children }: NewOnlineGameButtonProps) {
   const navigate = useNavigate();

   const handleOnline = () => {
      const roomId = crypto.randomUUID(); // Or generateRoomId()
      navigate(`/online/${roomId}`);
   };

   return (
      <button
         onClick={handleOnline}
         className="border p-3 rounded-xl hover:cursor-pointer"
      >
         {children}
      </button>
   );
}

export default NewOnlineGameButton;
