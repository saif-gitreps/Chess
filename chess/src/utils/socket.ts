import { io } from "socket.io-client";
const socket = io(import.meta.env.VITE_API_KEY); // Replace with your deployed backend
export default socket;
