import { useNavigate } from "react-router-dom";
import NewOnlineGameButton from "../components/GameInfo/NewOnlineGameButton";

export default function StartPage() {
   const navigate = useNavigate();

   return (
      <div className="bg-black h-screen text-white flex items-center justify-center flex-col">
         <div className="text-4xl text-center pt-10 flex justify-center items-center space-x-2">
            CHESS
            <img src="/chess-pieces/castle_w.png" />{" "}
         </div>
         <div className="font-bold p-2 flex justify-center items-center space-x-2">
            <button
               onClick={() => navigate("/local")}
               className="border p-3 rounded-xl hover:cursor-pointer"
            >
               Play locally
            </button>

            <NewOnlineGameButton>Play online with a friend</NewOnlineGameButton>
         </div>
      </div>
   );
}
