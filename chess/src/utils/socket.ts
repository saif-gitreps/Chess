import { io } from "socket.io-client";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
console.log(API_BASE_URL);
const socket = io(API_BASE_URL); // Replace with your deployed backend
export default socket;
