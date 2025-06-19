import { use, useState } from "react";
import axios from "axios";
import i18n from "../i18n";
import * as yup from "yup";
import { deletedChannelToast } from "./Chat.jsx";
import {
  errorToast as createErrorToast,
  renaimedChannelToast,
} from "./Chat.jsx";
import filter from "leo-profanity";

const errorReturn = (error) => {
  if (error == "The channel already exists") {
    return i18n.t("chatForm.channelExistError");
  }
  if (error == "name is a required field") {
    return i18n.t("chatForm.requiredFieldError");
  }
  if (error == "name must be at least 3 characters") {
    return i18n.t("chatForm.ChannelNameError");
  }
  if (error == "name must be at most 20 characters") {
    return i18n.t("chatForm.ChannelNameError");
  }
  if (error == "Obscene word") {
    return i18n.t("chatForm.ObsceneError");
  }
};

let schema = yup.object().shape({
  name: yup.string().required().min(3).max(20),
});

export default ({ channel, handleClick, channels, setActiveChannel }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState("");
  const [isDeliting, setIsDeliting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isChannelNameError, setIsChannelNameError] = useState(false);
  const [channelNameError, setChannelNameError] = useState(null);

  const checkChannelName = (value, propChannel) => {
    channels.forEach((channel) => {
      if (channel.name == value && channel.id !== propChannel.id) {
        setIsChannelNameError(true);
        setChannelNameError("The channel already exists");
        throw new Error("The channel already exists");
      } else {
        setIsChannelNameError(false);
        setText(value);
      }
    });
  };
  const checkCensore = (text) => {
    if (filter.check(text)) {
      throw new Error("Obscene word");
    }
  };
  const updateChannel = (channel, setIsChanging) => {
    const editedChannel = { name: text };
    try {
      checkChannelName(text, channel);
      checkCensore(text);
      schema
        .validate({ name: text })
        .then((result) => {
          setIsFetching(true);
          axios
            .patch(`/api/v1/channels/${channel.id}`, editedChannel, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
            .then((response) => {
              setActiveChannel(response.data);
              setText("");
              setIsFetching(false);
              renaimedChannelToast();
              setIsChanging(false);
            })
            .catch((error) => {
              createErrorToast(error.message);
            });
        })
        .catch((e) => {
          console.log(e.errors);
          setIsChannelNameError(true);
          setChannelNameError(e.errors[0]);
        });
    } catch (e) {
      setIsChannelNameError(true);
      if (e.message == "Obscene word") {
        setChannelNameError(e.message);
      }
      console.error(e.message);
      setIsFetching(false);
    }
  };
  const deleteChannel = (channel, setIsChanging) => {
    setIsDeliting(true);
    setIsFetching(true);
    axios
      .delete(`/api/v1/channels/${channel.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setActiveChannel(channels[0]);
        setIsFetching(false);
        deletedChannelToast();
        setIsChanging(false);
      })
      .catch((e) => {
        setIsFetching(false);
      });
  };
  const delitingForm = (channel) => {
    if (channel.name !== "random" && channel.name !== "general") {
      if (isDeliting) {
        return (
          <div className="modal-overlay">
          <div className="modal-content">
            <h3>{i18n.t("chatForm.deleteQuestion")}</h3>
            <div className="modal-actions">
              <button
                onClick={() => deleteChannel(channel, setIsDeliting)}
                disabled={isFetching}
                className="btn-confirm btn-danger"
              >
                {i18n.t("chatForm.yes")}
              </button>
              <button 
                onClick={() => setIsDeliting(false)} 
                disabled={isFetching}
                className="btn-cancel"
              >
                {i18n.t("chatForm.no")}
              </button>
            </div>
          </div>
        </div>
        );
      } else {
        return (
          <button onClick={() => setIsDeliting(true)} disabled={isFetching}>
            {i18n.t("chatForm.delete")}
          </button>
        );
      }
    }
  };
  const makeEdit = () => {
    setText(channel.name);
    setIsEditing(!isEditing);
  };
  const createButtons = (channel) => {
    const [isChanging, setIsChanging] = useState(false);
    if (channel.name !== "random" && channel.name !== "general") {
      if (isChanging) {
        return (
        <>
          {!isEditing ? (
            <button className='channel-editing-form' onClick={() => makeEdit()} disabled={isFetching}>{i18n.t("chatForm.rename")}
            </button>
          ) : (
            <button
              type="submit"
              onClick={() => updateChannel(channel, setIsChanging)}
              disabled={isFetching}
              className='channel-editing-form'
            >
              {i18n.t("chatForm.submit")}
            </button>
          )}
          {delitingForm(channel, setIsChanging)}
        </>
      );
      } else {
        return (
          <button className="channel-editing-form" onClick={() => setIsChanging(true)}>{i18n.t("chatForm.changeChannel")}</button>
        )
      }
    }
  };
  const formSubmit = (e, channel) => {
    e.preventDefault();
    updateChannel(channel);
  };
  return (
    <li className='channel-body'>
      <button className="channel-logo" aria-label={channel.name} type="button" onClick={() => handleClick(channel.id)}>
        <span className="channelSpan">#</span>
        {channel.name}
      </button>
      {isEditing && (
        <form className='channel-editing-form floating-label' onSubmit={(e) => formSubmit(e, channel)}>
          <input
            type="text"
            name='text'
            id='text'
            onChange={(e) => setText(e.target.value)}
            placeholder=" "
            value={text}
          ></input>
          <label htmlFor="text">{i18n.t('chatForm.channelName')}</label>
          {isChannelNameError && <p>{errorReturn(channelNameError)}</p>}
        </form>
      )}
      {createButtons(channel)}
    </li>
  );
};
