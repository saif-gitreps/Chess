import App from "../App";

function LocalChessGame() {
   return (
      <div className="bg-black h-screen flex items-center justify-center flex-col">
         <App mode="local" />;
      </div>
   );
}

export default LocalChessGame;
