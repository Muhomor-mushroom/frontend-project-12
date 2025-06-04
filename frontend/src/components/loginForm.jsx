import { Formik, Field, Form } from "formik";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import InputGroup from 'react-bootstrap/InputGroup';
import { Button, Form as BootstrapForm, Alert } from "react-bootstrap";

const renderError = (errorState) => {
  if (errorState !== null) {
    return (
      <>
      <h3>{errorState}</h3>
      </>
    )
  }
}


export default () => {
  const [error, setError] = useState(null);

const handleLogin = async (data) => {
  try {
    const resp = await axios.post('/api/v1/login', { username: data.name, password: data.password });
    const { token } = resp.data;
    window.location = '/';
  }
  catch (error) {
    setError(error.message);
    /* if (error.status == 401) {
      handleSignup(data);
    } */
  }
}
    return (
      <>
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
            <Form>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <Field type="name" name="name" className="form-control" />
              </div>
              <div className="form-group">
                <InputGroup size="lg">
                <InputGroup.Text id="inputGroup-sizing-lg">Password</InputGroup.Text>
                <Field 
                  type="password"
                  name="password"
                  className="form-control" aria-label="Large"
          aria-describedby="inputGroup-sizing-sm"
                />
                </InputGroup>
              </div>
              <Button type="submit" disabled={isSubmitting}>Submit</Button>
              {renderError(error)}
            </Form>
          )}
        </Formik>
        <div onClick={() => window.location = "/signup"}>
          <h3>Регистрация</h3>
        </div>
      </>
    );
};
