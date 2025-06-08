import { io } from "socket.io-client";

const socket = io("ws://localhost:5001");

export default socket;