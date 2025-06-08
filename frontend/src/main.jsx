import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { io } from "socket.io-client";

const socket = io("http://localhost:5001"); // Инициализируем работу Сокета
// Subscribe new messages
socket.on("newMessage", (payload) => {
  console.log(payload); // => { body: "new message", channelId: 7, id: 8, username: "admin" }
});
// subscribe new channel
socket.on('newChannel', (payload) => {
  console.log(payload) // { id: 6, name: "new channel", removable: true }
});
// subscribe remove channel
socket.on('removeChannel', (payload) => {
  console.log(payload); // { id: 6 };
});
// subscribe rename channel
socket.on('renameChannel', (payload) => {
  console.log(payload); // { id: 7, name: "new name channel", removable: true }
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
