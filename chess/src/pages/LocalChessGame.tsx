import App from "../App";

function LocalChessGame() {
   return (
      <div className="bg-black min-h-screen flex items-center justify-center flex-col px-2">
         <App mode="local" />;
      </div>
   );
}

export default LocalChessGame;
