import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { io } from "socket.io-client";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import channelsReducer from "./slices/channelsSlice.js";
import messagesReducer from "./slices/messagesSlice.js";
import userReducer from "./slices/userSlice.js";
import { actions as messagesActions } from "./slices/messagesSlice.js";
import { actions as channelsActions } from "./slices/channelsSlice.js";

const store = configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
    user: userReducer
  }
})

const socket = io(); // Инициализируем работу Сокета
// Subscribe new messages
socket.on("newMessage", async (payload) => {
  /* console.log(payload); */ // => { body: "new message", channelId: 7, id: 8, username: "admin" }
  store.dispatch(messagesActions.addMessage(payload));
});
// subscribe new channel
socket.on("newChannel", (payload) => {
  /* console.log(payload); */ // { id: 6, name: "new channel", removable: true }
  store.dispatch(channelsActions.addChannel(payload));
});
// subscribe remove channel
socket.on("removeChannel", (payload) => {
  /* console.log(payload); */ // { id: 6 };
  store.dispatch(channelsActions.removeChannel(payload.id));
  const channelMessages = store.getState().messages.entities;
  const keys = Object.keys(channelMessages);
  const filteredMessages = keys.filter((key) => channelMessages[key].channelId == payload.id);
  store.dispatch(messagesActions.removeMessages(filteredMessages));
});
// subscribe rename channel
socket.on("renameChannel", (payload) => {
  console.log(payload); // { id: 7, name: "new name channel", removable: true }
  store.dispatch(channelsActions.renameChannel({ id: payload.id, changes: { name: payload.name}}))
});

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <StrictMode>
    <App />
  </StrictMode>
  </Provider>
);
