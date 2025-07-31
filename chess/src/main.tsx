import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StartPage from "./pages/StartPage";
import LocalChessGame from "./pages/LocalChessGame";
import OnlineChessGame from "./pages/OnlineChessGame";

createRoot(document.getElementById("root")!).render(
   <StrictMode>
      <BrowserRouter>
         <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/local" element={<LocalChessGame />} />
            <Route path="/online/:roomId" element={<OnlineChessGame />} />
         </Routes>
      </BrowserRouter>
   </StrictMode>
);
