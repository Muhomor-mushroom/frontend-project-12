import axios from "axios";
import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import {
  actions as channelsActions,
  selectors as channelsSelectors,
} from "../../slices/channelsSlice.js";
import {
  actions as messagesActions,
  selectors as messagesSelectors,
} from "../../slices/messagesSlice.js";
import channelsReducer from "../../slices/channelsSlice.js";
import messagesReducer from "../../slices/messagesSlice.js";
import { configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const renderMessages = (messages, id) => {
    if (messages.length > 0) {
        return (
            <div className="messages-constructor">{messages.map((message) => {
                return (
                    <div key={message.id} className="message-constructor">
                        <p className="message">{message}</p>
                    </div>
                )
            })}</div>
        )
    } else {
        return null;
    }
}

const renderChannels = (channels, messages) => {
  return (
    <div className='channels-constructor'>
        {channels.map((channel) => {
            const { id, name } = channel;
            return (
                <div className="channel-constructor" key={id}>
                    <h3 id={id} key={id} className="channel">Channel: {name}</h3>
                    {renderMessages(messages, id)}
                </div>
            )
        })}
    </div>
  )
};

// Создаем store вне компонента
const store = configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
  },
});

const MainPage = () => {
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
  console.log(channels);

  return <>{renderChannels(channels, messages)}</>;
};

// Главный экспортируемый компонент, который оборачивает MainPage в Provider
export default () => (
  <Provider store={store}>
    <MainPage />
  </Provider>
);
