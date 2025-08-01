import { useParams } from "react-router-dom";
import { useState } from "react";
import App from "../App";
import NewOnlineGameButton from "../components/GameInfo/NewOnlineGameButton";

export default function OnlineChessGame() {
   const { roomId } = useParams();
   const [copied, setCopied] = useState(false);

   const shareUrl = `${window.location.origin}/online/${roomId}`;

   const handleCopy = async () => {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
   };

   return (
      <div className="bg-black h-screen flex items-center justify-center flex-col">
         <div className="flex justify-center items-center space-x-1 bg-black text-white pt-4 pb-2 font-bold">
            <NewOnlineGameButton>New game</NewOnlineGameButton>

            <div>
               <p className="text-sm">Share link:</p>
               <div className="flex gap-2 items-center">
                  <input
                     className="border px-2 py-1 w-[300px] rounded-xl"
                     type="text"
                     value={shareUrl}
                     readOnly
                  />
                  <button onClick={handleCopy} className="text-white px-2 py-1 rounded">
                     {copied ? "Copied!" : "Copy"}
                  </button>
               </div>
            </div>
         </div>

         <App mode="online" roomId={roomId} />
      </div>
   );
}
