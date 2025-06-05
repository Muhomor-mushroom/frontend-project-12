import axios from "axios";
import { useEffect, useState } from "react";
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
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";

const renderMessages = (messages, id) => {
    console.log(id)
    return (
    <div className="messages-constructor">
        <div className="messages-header">
            <h3 className="messages-title">{}</h3>
        </div>
        <div className="messages-body"></div>
        <div className="messages-bottom"></div>
    </div>
  )
/*     if (messages.length > 0) {
    return (
        {messages.map((message) => {
          return (
            <div key={id} className="message-constructor">
              <p className="message">{message}</p>
            </div>
          );
        })}
    );
  } else {
    console.log('not have a messanges')
    return null;
  } */
};

const renderChannels = (channels, messages) => {
    const [activeChannelId, setActiveChannelId] = useState(1)
  return (
    <div className="channels-constructor">
      <div className="channels-header">
        <h3 className="channels-title">Channels</h3>
        <button className="channels-add-button">+</button>
      </div>
      <div className="channels-body">
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                {channels.map((channel) => {
                  const { id, name } = channel;
                  return (
                      <Nav.Item onClick={() => setActiveChannelId(id)} key={id} className="channel" id={id}>
                        <Nav.Link eventKey="first"># {name}</Nav.Link>
                        {renderMessages(messages, id)}
                      </Nav.Item>
                  );
                })}
              </Nav>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    </div>
  );
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
  console.log(messages);

  return <>{renderChannels(channels, messages)}</>;
};

// Главный экспортируемый компонент, который оборачивает MainPage в Provider
export default () => (
  <Provider store={store}>
    <div className="chat-constructor">
      <MainPage />
    </div>
  </Provider>
);
