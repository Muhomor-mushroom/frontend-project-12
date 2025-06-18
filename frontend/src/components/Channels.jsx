import Channel from "./Channel.jsx";
import { useState } from "react";
import { Formik, Field, Form } from "formik";
import axios from "axios";
import * as yup from "yup";
import i18n from "../i18n.js";
import { errorToast as createErrorToast, createdChannelToast } from "./Chat.jsx";
import filter from "leo-profanity";

const errorReturn = (error) => {
  if (error == 'The channel already exists') {
    return (i18n.t('chatForm.channelExistError'))
  }
  if (error == 'name is a required field') {
    return (i18n.t('chatForm.requiredFieldError'))
  }
  if (error == 'name must be at least 3 characters') {
    return (i18n.t('chatForm.nameMinError'));
  }
  if (error == 'name must be at most 20 characters') {
    return (i18n.t('chatForm.nameMaxError'));
  }
  if (error == 'Obscene word') {
    return (i18n.t('chatForm.ObsceneError'));
  }
}

let schema = yup.object().shape({
  name: yup.string().required().min(3).max(20),
});

const handleAdd = ({ name }, setActiveChannel) => {
  const newChannel = { name: name };
  console.log(newChannel);
  axios
    .post("/api/v1/channels", newChannel, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      setActiveChannel(response.data);
      createdChannelToast();
    })
    .catch((error) => {
      createErrorToast(error.message);
    })
};

const Channels = ({ channels, setActiveChannel }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [textError, setTextError] = useState("");
  const [isError, setIsError] = useState(false);

  const checkOnPlagiat = ({ name }) => {
    channels.forEach((channel) => {
      if (channel.name == name) {
        throw new Error("The channel already exists");
      } else {
        setIsError(false);
      }
    });
  };
  const censoreCheck = ({ name }) => {
    if (filter.check(name)) {
      throw new Error("Obscene word");
    }
  }
  const handleSelect = (channel) => {
    setActiveChannel(channel);
  };

  const CreateBody = () => {
    if (isAdding) {
      return (
        <>
        <Formik
          initialValues={{ name: "" }}
          onSubmit={(values, { setSubmitting }) => {
            schema
              .validate({ name: values.name })
              .then((result) => {
                censoreCheck(result);
                checkOnPlagiat(result);
                handleAdd(values, setActiveChannel);
                setIsAdding(false);
                setSubmitting(false);
                createToast();
              })
              .catch(function (err) {
                setIsError(true);
                if (typeof err.message == "string") {
                  setTextError(err.message);
                } else {
                  setTextError(err.errors[0]);
                }
              });
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-group signup-group">
                <label className="signup-label" htmlFor="name">
                  {i18n.t('chatForm.name')}
                </label>
                <Field
                  type="name"
                  name="name"
                  className="form-control signup-field"
                />
              </div>
              {isError && <p className="channel-name-error">{errorReturn(textError)}</p>}
              <button
                className="signup-button"
                type="submit"
                disabled={isSubmitting}
              >
                {i18n.t('chatForm.submit')}
              </button>
            </Form>
          )}
        </Formik></>
      );
    } else {
      return (
        <>
          {channels.map((channel) => (
            <Channel
              handleClick={() => handleSelect(channel)}
              key={channel.id}
              channel={channel}
              channels={channels}
              setActiveChannel={setActiveChannel}
            />
          ))}
        </>
      );
    }
  };

  return (
    <>
      <div className="channels-header">
        <h3 className="channels-title">{i18n.t('chatForm.channels')}</h3>
        <button
          className="channels-add-button"
          onClick={() => setIsAdding(!isAdding)}
        >
          +
        </button>
      </div>
      <div className="channels-body">
        <CreateBody />
      </div>
    </>
  );
};
export default Channels;