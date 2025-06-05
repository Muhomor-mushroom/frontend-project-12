import axios from "axios";
import { use, useEffect, useState } from "react";
import { Provider, useDispatch } from "react-redux";
import {
  actions as channelsActions,
  selectors as channelsSelectors,
} from "../../slices/channelsSlice.js";
import {
  actions as messagesActions,
  selectors as messagesSelectors,
} from "../../slices/messagesSlice.js";
import { selectors as usersSelectors } from "../../slices/usersSlice.js";
import channelsReducer from "../../slices/channelsSlice.js";
import messagesReducer from "../../slices/messagesSlice.js";
import usersReducer from "../../slices/usersSlice.js";
import userReducer from "../../slices/userSlice.js";
import { configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import _ from "lodash";
import { server } from 'socket.io';

const messageSubmit = async (data) => {
  const newMessage = data;  
  const resp = await axios.post('/api/v1/messages', newMessage, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    })
    return resp.data
}

const renderMessages = (messages, activeChannelId) => {
  const allChannels = useSelector((state) => state.channels.entities);
  const activeChannel = _.get(allChannels, activeChannelId);
  const [text, setText] = useState("");
  const handleInputChange = (event) => {
    setText(event.target.value);
  };
  return (
    <>
      <div className="messages-header">
        <h3 className="messages-title">Channel какой-то там</h3>
      </div>
      <div className="messages-body">
        {messages.map((message) => {
          if(message.channelId == activeChannelId) {
            return (
              <div className="message-container">
                <p className="message-text">{message.userName}: {message.body}</p>
              </div>
            )
          }
        })}
      </div>
      <div className="messages-bottom">
        <form action="" onSubmit={(e) => {
            e.preventDefault();
            const resultText = text;
            const userName = localStorage.getItem('userName')
            const newMessage = { body: resultText, channelId: activeChannelId, userName};
            messageSubmit(newMessage)
            .then((result) => {
              console.log(result)
            })
            setText('');

        }}>
            <input
          type="text"
          value={text}
          onChange={handleInputChange}
          className="messages-input"
        />
        <button type="submit" className="messages-bottom-submit">Send</button>
        </form>
      </div>
    </>
  );
};

const renderChannels = (channels, setActiveChannelId) => {
  const handleSubmit = (tabIndex) => {
    setActiveChannelId(tabIndex)
  }
    return (
    <>
      <div className="channels-header">
        <h3 className="channels-title">Channels</h3>
        <button className="channels-add-button">+</button>
      </div>
      <div className="channels-body">
        <Tabs
          onSelect={handleSubmit}
          defaultActiveKey="profile"
          id="justify-tab-example"
          className="mb-3"
          justify
        >
          {channels.map((channel) => {
            const { id, name } = channel;
            return (
              <Tab key={id} eventKey={id} title={`# ${name}`} id={id}></Tab>
            );
          })}
        </Tabs>
      </div>
    </>
  );
};

// Создаем store вне компонента
const store = configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
    users: usersReducer,
    user: userReducer
  },
});

const MainPage = () => {
  const [activeChannelId, setActiveChannelId] = useState(1);
  const token = localStorage.getItem("token");

  if (token == null) {
    window.location = "/login";
    return null;
  }

  const dispatch = useDispatch();

  useEffect(() => {
    const axiosChannels = async () => {
      const { data } = await axios.get("/api/v1/channels", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(channelsActions.addChannels(data));
    };
    const axiosMessages = async () => {
      const { data } = await axios.get("/api/v1/messages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(messagesActions.addMessages(data));
    };

    axiosChannels();
    axiosMessages();
  }, [dispatch, token]);

  const channels = useSelector(channelsSelectors.selectAll);
  const messages = useSelector(messagesSelectors.selectAll);
  console.log(messages)
  return (
    <div className="chat-container">
      <div className="channels-container">
        {renderChannels(channels, setActiveChannelId)}
      </div>
      <div className="messages-container">
        {renderMessages(messages, activeChannelId)}
      </div>
    </div>
  );
};

// Главный экспортируемый компонент, который оборачивает MainPage в Provider
export default () => (
  <Provider store={store}>
    <MainPage />
  </Provider>
);
