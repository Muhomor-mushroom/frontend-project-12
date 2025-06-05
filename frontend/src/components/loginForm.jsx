import { Formik, Field, Form } from "formik";
import axios from "axios";
import { useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";

const renderError = (errorState) => {
  if (errorState !== null) {
    return (
      <div className='error-container'>
        <h3>{errorState}</h3>
      </div>
    );
  }
};

export default () => {
  const [error, setError] = useState(null);

  const handleLogin = async (data) => {
    try {
      const resp = await axios.post("/api/v1/login", {
        username: data.name,
        password: data.password,
      });
      const { token } = resp.data;
      window.location = "/";
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div id="login-form">
      <Formik
        initialValues={{ name: "", password: "" }}
        onSubmit={(values, { setSubmitting }) => {
          console.log("Form is validated! Submitting the form...");
          console.log(values);
          handleLogin(values);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="form-row">
            <div className="form-group">
              <InputGroup.Text className='label-login' id="inputGroup-sizing-lg">
                  name
                </InputGroup.Text>
              <Field type="name" name="name" className="form-control input-login" />
            </div>
            <div className="form-group">
                <InputGroup.Text className='label-login' id="inputGroup-sizing-lg">
                  Password
                </InputGroup.Text>
                <Field
                  type="password"
                  name="password"
                  className="form-control input-login"
                />
            </div>
            <button className="login-submit" type="submit" disabled={isSubmitting}>
              Submit
            </button>
            <div className='registration-link' onClick={() => (window.location = "/signup")}>
              <h3>Регистрация</h3>
            </div>
          </Form>
        )}
      </Formik>
      {renderError(error)}
    </div>
  );
};
