import axios from "axios";
import { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import {
  actions as channelsActions,
  selectors as channelsSelectors,
} from "../slices/channelsSlice.js";
import {
  actions as messagesActions,
  selectors as messagesSelectors,
} from "../slices/messagesSlice.js";
import { setUser } from "../slices/userSlice.js";
import Channels from "./channels.jsx";
import Messages from "./messages.jsx";
import i18n from "../i18n.js";

const ChatPage = () => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
      if (!token) {
      window.location = "/login";
      return;
    }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const channelsResponse = await axios.get("/api/v1/channels", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const messagesResponse = await axios.get("/api/v1/messages", {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(messagesActions.addMessages(messagesResponse.data));
        dispatch(channelsActions.addChannels(channelsResponse.data));
        dispatch(setUser({ userName: localStorage.getItem("userName") }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dispatch, token]);

  const logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName')
    window.location = "/login";
  }

  if (!token) return null;

  const channels = useSelector(channelsSelectors.selectAll);
  const messages = useSelector(messagesSelectors.selectAll);
  const [activeChannel, setActiveChannel] = useState({});

  return (
    <div className="chat-container">
      <div className="channels-container">
        <Channels channels={channels} setActiveChannel={setActiveChannel} />
        <a className="log-out" onClick={() => logOut()}>{i18n.t('chatForm.logOut')}</a>
      </div>
      <div className="messages-container">
        {<Messages messages={messages} activeChannel={activeChannel} />}
      </div>
    </div>
  );
};

export default () => <ChatPage />;
