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
      <div className="bg-black min-h-screen flex items-center justify-center flex-col px-2">
         <div className="flex flex-col md:flex-row md:justify-evenly md:space-x-3 space-y-2 md:space-y-0 items-center bg-black text-white pt-4 px-4 font-bold">
            <NewOnlineGameButton showAlert>New game</NewOnlineGameButton>

            <div className="space-y-1">
               <div className="flex space-x-2 items-center justify-between">
                  <div className="text-sm">Share link:</div>
                  <button
                     onClick={handleCopy}
                     className="text-white py-1 px-2 border rounded-xl hover:cursor-pointer"
                  >
                     {copied ? "Copied!" : "Copy"}
                  </button>
               </div>

               <input
                  className="border px-2 py-1 w-full md:w-[400px] max-w-full rounded-xl break-all text-sm"
                  type="text"
                  value={shareUrl}
                  readOnly
               />
            </div>
         </div>

         <App mode="online" roomId={roomId} />
      </div>
   );
}
