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
import { configureStore } from "@reduxjs/toolkit";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import channelsReducer from "../slices/channelsSlice.js";
import messagesReducer from "../slices/messagesSlice.js";
import userReducer from "../slices/userSlice.js";
import { setUser } from "../slices/userSlice.js";

const messageSubmit = async(data) => {
      const resp = await axios.post("/api/v1/messages", data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return resp.data;
};

const Messages = ({ messages, activeChannelId }) => {
  const [text, setText] = useState("");
  const activeUser = useSelector((state) => state.user.userName);

  const handleInputChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (activeUser == null) {
      console.error("that is not a real user");
      return;
    }
    const name = activeUser.userName;
    const newMessage = {
      body: text,
      channelId: activeChannelId,
      userName: name,
    };

    try {
      const result = await messageSubmit(newMessage);
      console.log(result);
      setText("");
    } catch (error) {
      console.error("Error submitting message:", error);
    }
  };

  return (
    <>
      <div className="messages-header">
        <h3 className="messages-title">Channel {activeChannelId}</h3>
      </div>
      <div className="messages-body">
        {messages
          .filter((message) => message.channelId === activeChannelId)
          .map((message) => (
            <div key={message.id} className="message-container">
              <p className="message-text">
                {message.userName}: {message.body}
              </p>
            </div>
          ))}
      </div>
      <div className="messages-bottom">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={text}
            onChange={handleInputChange}
            className="messages-input"
          />
          <button type="submit" className="messages-bottom-submit">
            Send
          </button>
        </form>
      </div>
    </>
  );
};

const Channels = ({ channels, setActiveChannelId }) => {
  const handleSelect = (tabIndex) => {
    setActiveChannelId(tabIndex);
  };

  return (
    <>
      <div className="channels-header">
        <h3 className="channels-title">Channels</h3>
        <button className="channels-add-button">+</button>
      </div>
      <div className="channels-body">
        <Tabs
          onSelect={handleSelect}
          defaultActiveKey="1"
          id="channels-tabs"
          className="mb-3"
          justify
        >
          {channels.map((channel) => (
            <Tab
              key={channel.id}
              eventKey={channel.id}
              title={`# ${channel.name}`}
            />
          ))}
        </Tabs>
      </div>
    </>
  );
};

const store = configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
    user: userReducer,
  },
});

const ChatPage = () => {
  const [activeChannelId, setActiveChannelId] = useState(1);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) {
      window.location = "/login";
      return;
    }

    const fetchData = async () => {
      try {
        const channelsResponse = await axios.get("/api/v1/channels", {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(channelsActions.addChannels(channelsResponse.data));

        const messagesResponse = await axios.get("/api/v1/messages", {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(messagesActions.addMessages(messagesResponse.data));
        dispatch(setUser({ userName: localStorage.getItem("userName") }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dispatch, token]);

  if (!token) return null;

  const channels = useSelector(channelsSelectors.selectAll);
  const messages = useSelector(messagesSelectors.selectAll);

  return (
    <div className="chat-container">
      <div className="channels-container">
        <Channels channels={channels} setActiveChannelId={setActiveChannelId} />
      </div>
      <div className="messages-container">
        <Messages messages={messages} activeChannelId={activeChannelId} />
      </div>
    </div>
  );
};

export default () => (
  <Provider store={store}>
    <ChatPage />
  </Provider>
);
