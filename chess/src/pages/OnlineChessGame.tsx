import { useParams } from "react-router-dom";
import { useState } from "react";
import App from "../App";

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
      <div className="flex flex-col items-center gap-4 p-4">
         <div>
            <p className="text-sm">Share this link with your friend:</p>
            <div className="flex gap-2 items-center">
               <input
                  className="border px-2 py-1 w-[300px]"
                  type="text"
                  value={shareUrl}
                  readOnly
               />
               <button
                  onClick={handleCopy}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
               >
                  {copied ? "Copied!" : "Copy"}
               </button>
            </div>
         </div>

         <App mode="online" roomId={roomId} />
      </div>
   );
}
