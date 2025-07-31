import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function StartPage() {
   const navigate = useNavigate();
   const [roomUrl, setRoomUrl] = useState("");

   const handleOnline = () => {
      const roomId = crypto.randomUUID(); // Or generateRoomId()
      const fullUrl = `${window.location.origin}/online/${roomId}`;
      setRoomUrl(fullUrl);
      navigate(`/online/${roomId}`);
   };

   return (
      <div className="flex flex-col gap-4">
         <button onClick={() => navigate("/local")}>Play Locally</button>
         <button onClick={handleOnline}>Play Online</button>
      </div>
   );
}
