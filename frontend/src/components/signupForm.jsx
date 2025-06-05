import { Formik, Field, Form } from "formik";
import axios from "axios";
import { useState } from "react";
import { Provider, useDispatch } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice.js";
import { setUser } from "../slices/userSlice.js";
import { useSelector } from "react-redux";

const renderError = (errorState) => {
  if (errorState !== null) {
    return (
      <>
        <h3>{errorState}</h3>
      </>
    );
  }
};

const store = configureStore({
  reducer: {
    user: userReducer
  },
});

const MainPage = () => {
  const [error, setError] = useState(null);

  const dispatch = useDispatch()
  const passwordCheck = (data) => {
    const { password, confirmPassword } = data;
    if (password !== confirmPassword) {
      setError("The passwords entered do not match");
      throw new Error("The passwords entered do not match");
    }
  };

  const handleSignup = async (data) => {
    const { name, password } = data;
    try {
      passwordCheck(data);
      const resp = await axios.post("/api/v1/signup", {
        username: name,
        password: password,
      });
      console.log(resp);
      const { token } = resp.data;
      localStorage.setItem("token", token);
      localStorage.setItem('userName', name)
      if (resp.statusText == "Created") {
        dispatch(setUser({ userName: name }));
        console.log(useSelector((state) => state.user.userName))
        /* window.location = "/"; */
        console.log(resp.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
    <div className="signup-form">
        <Formik
        initialValues={{ name: "", password: "", confirmPassword: "" }}
        onSubmit={(values, { setSubmitting }) => {
          console.log("Form is validated! Submitting the form...");
          console.log(values);
          handleSignup(values);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group signup-group">
              <label className="signup-label" htmlFor="name">Name</label>
              <Field type="name" name="name" className="form-control signup-field" />
            </div>
            <div className="form-group signup-group">
              <label className="signup-label" htmlFor="password">Password</label>
              <Field type="password" name="password" className="form-control signup-field" />
            </div>
            <div className="form-group signup-group">
              <label className="signup-label" htmlFor="confirmPassword">Confirm the password</label>
              <Field
                type="password"
                name="confirmPassword"
                className="form-control signup-field"
              />
            </div>
            <button className="signup-button" type="submit" disabled={isSubmitting}>
              Submit
            </button>
            {renderError(error)}
          </Form>
        )}
      </Formik>
    </div>
    </>
  );
};

export default () => {
    return (
        <Provider store={store}>
            <MainPage />
        </Provider>
    )
}