import { Formik, Field, Form } from "formik";
import axios from "axios";
import { useState } from "react";
import { Provider, useDispatch } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice.js";
import { setUser } from "../slices/userSlice.js";
import * as yup from "yup";
import i18n from "../i18n.js";
import { ToastContainer, toast } from "react-toastify";

let schema = yup.object().shape({
  name: yup.string().required().min(3).max(20),
  password: yup.string().required().min(6),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref("password")], "confirmPassword must match with password"),
});

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

const SignupForm = () => {
  const [isError, setIsError] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [isUsernameError, setIsUserNameError] = useState(false);
  const [usernameError, setUsernameError] = useState(null);
  const [passwordIsError, setPasswordIsError] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [isConfirmError, setIsConfirmError] = useState(false);
  const [confirmError, setConfirmError] = useState(null);

  const toastify = () => toast(fetchError);

  const cleanValidateErrors = () => {
    setIsUserNameError(false);
    setPasswordIsError(false);
    setIsConfirmError(false);
    setUsernameError(null);
    setPasswordError(null);
    setConfirmError(null);
  };
  const dispatch = useDispatch();

  const dataCheck = (data) => {
    const { password, confirmPassword, name } = data;
    return schema.validateSync(
      { name, password, confirmPassword },
      { abortEarly: false }
    );
  };

  const handleSignup = async (data) => {
    const { name, password } = data;
    try {
      dataCheck(data);
      cleanValidateErrors();
      const resp = await axios.post("/api/v1/signup", {
        username: name,
        password: password,
      });
      console.log(resp);
      setIsError(false);
      const { token } = resp.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userName", name);
      if (resp.statusText === "Created") {
        dispatch(setUser({ userName: name }));
        window.location = "/";
      }
    } catch (error) {
      if (error.name == "ValidationError") {
        console.log(error.errors);
        switch (false) {
          case error.errors.includes("name"): {
            setIsUserNameError(false);
            setUsernameError(null);
          }
          case error.errors.includes("password"): {
            setPasswordIsError(false);
            setPasswordError(null);
          }
          case error.errors.includes("confirmPassword"): {
            setIsConfirmError(false);
            setConfirmError(null);
            break;
          }
          default:
            break;
        }
        error.errors.reverse().forEach((error) => {
          console.log(error);
          switch (error) {
            case "name must be at least 3 characters":
            case "name must be at most 20 characters":
            case "name is a required field": {
              setIsUserNameError(true);
              if (error == "name is a required field") {
                setUsernameError(i18n.t("signupForm.requiredFieldError"));
              } else {
                setUsernameError(i18n.t("signupForm.usernameError"));
              }
              break;
            }
            case "password must be at least 6 characters":
            case "password is a required field": {
              setPasswordIsError(true);
              if (error == "password is a required field") {
                setPasswordError(i18n.t("signupForm.requiredFieldError"));
              } else {
                setPasswordError(i18n.t("signupForm.passwordMinError"));
              }
              break;
            }
            case "confirmPassword is a required field":
            case "confirmPassword must match with password": {
              setIsConfirmError(true);
              if (error == "confirmPassword is a required field") {
                setConfirmError(i18n.t("signupForm.requiredFieldError"));
              } else {
                setConfirmError(i18n.t("signupForm.confirmError"));
              }
              break;
            }
            default: {
              break;
            }
          }
        });
      } else {
        setFetchError(error.message);
        toastify();
      }
    }
  };

  return (
    <div className="signup-form">
      <ToastContainer />
      <Formik
        initialValues={{ name: "", password: "", confirmPassword: "" }}
        onSubmit={(values, { setSubmitting }) => {
          handleSignup(values);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group signup-group">
              <label className="signup-label" htmlFor="name">
                {i18n.t("signupForm.name")}
              </label>
              <Field
                type="name"
                name="name"
                className="form-control signup-field"
              />
              {isUsernameError && (
                <p className="signup-login-error">{usernameError}</p>
              )}
            </div>
            <div className="form-group signup-group">
              <label className="signup-label" htmlFor="password">
                {i18n.t("signupForm.password")}
              </label>
              <Field
                type="password"
                name="password"
                className="form-control signup-field"
              />
              {passwordIsError && (
                <p className="signup-login-error">{passwordError}</p>
              )}
            </div>
            <div className="form-group signup-group">
              <label className="signup-label" htmlFor="confirmPassword">
                {i18n.t("signupForm.confirmation")}
              </label>
              <Field
                type="password"
                name="confirmPassword"
                className="form-control signup-field"
              />
              {isConfirmError && (
                <p className="signup-login-error">{confirmError}</p>
              )}
            </div>
            <button
              className="signup-button"
              type="submit"
              disabled={isSubmitting}
            >
              {i18n.t("signupForm.submit")}
            </button>
          </Form>
        )}
      </Formik>
      <a
        className="signup-link-on-chat"
        onClick={() => (window.location = "/")}
      >
        {i18n.t("signupForm.hexletChat")}
      </a>
    </div>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <SignupForm />
    </Provider>
  );
};

export default App;
