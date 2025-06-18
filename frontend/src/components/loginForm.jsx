import { Formik, Field, Form } from "formik";
import axios from "axios";
import { useEffect, useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import i18n from "../i18n";
import { ToastContainer, toast } from 'react-toastify';

export default () => {
  const [isError, setIsError] = useState(false);
  const handleLogin = async (data) => {
    try {
      const resp = await axios.post("/api/v1/login", {
        username: data.name,
        password: data.password,
      });
      setIsError(false);
      const { token, username } = resp.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userName', username);
      console.log(resp.data);
      window.location = "/";
    } catch (error) {
      toast(error.message);
      setIsError(true);
    }
  };
  return (
    <div id="login-form">
      <Formik
        initialValues={{ name: "", password: "" }}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values);
          handleLogin(values);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="form-row">
            <ToastContainer />
            <div className="form-group">
              <InputGroup.Text className='label-login' id="inputGroup-sizing-lg">
                  {i18n.t('loginForm.name')}
                </InputGroup.Text>
              <Field type="name" name="name" className="form-control input-login" />
            </div>
            <div className="form-group">
                <InputGroup.Text className='label-login' id="inputGroup-sizing-lg">
                  {i18n.t('loginForm.password')}
                </InputGroup.Text>
                <Field
                  type="password"
                  name="password"
                  className="form-control input-login"
                />
            </div>
            {isError && <p className='login-error'>{i18n.t('loginForm.unauthorized')}</p>}
            <button className="login-submit" type="submit" disabled={isSubmitting}>
              {i18n.t('loginForm.submit')}
            </button>
            <div className='registration-link' onClick={() => (window.location = "/signup")}>
              <h3>{i18n.t('loginForm.registration')}</h3>
            </div>
          </Form>
        )}
      </Formik>
      <a className="link-on-chat" onClick={() => window.location = "/"}>{i18n.t('loginForm.hexletChat')}</a>
    </div>
  );
};
