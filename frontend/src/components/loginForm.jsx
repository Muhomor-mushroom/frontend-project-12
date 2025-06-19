import { Formik, Field, Form } from 'formik'
import axios from 'axios'
import { useState } from 'react'
import i18n from '../i18n'
import { ToastContainer, toast } from 'react-toastify'
/* eslint-disable */ 
export default () => {
  /* eslint-enable */
  const [isError, setIsError] = useState(false)
  const handleLogin = async (data) => {
    try {
      const resp = await axios.post('/api/v1/login', {
        username: data.name,
        password: data.password,
      })
      setIsError(false)
      const { token, username } = resp.data
      localStorage.setItem('token', token)
      localStorage.setItem('userName', username)
      console.log(resp.data)
      window.location = '/'
    }
    catch (error) {
      toast(error.message)
      setIsError(true)
    }
  }
  return (
    <div id="login-form">
      <Formik
        initialValues={{ name: '', password: '' }}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values)
          handleLogin(values)
          setSubmitting(false)
        }}
      >
        {({ isSubmitting }) => (
          <Form className="form-row login-container">
            <ToastContainer />
            <div className="form-group floating-label login-input">
              <Field type="name" name="name" id="name" placeholder="" className="form-control input-login" />
              <label htmlFor="name">{i18n.t('loginForm.name')}</label>
            </div>
            <div className="form-group floating-label login-input">
              <Field
                type="password"
                name="password"
                id="password"
                className="form-control input-login"
                placeholder=""
              />
              <label htmlFor="password">{i18n.t('loginForm.password')}</label>
            </div>
            {isError && <p className="login-error">{i18n.t('loginForm.unauthorized')}</p>}
            <button className="login-submit" type="submit" disabled={isSubmitting}>
              {i18n.t('loginForm.submit')}
            </button>
            <div className="registration-link" onClick={() => (window.location = '/signup')}>
              <h3>{i18n.t('loginForm.registration')}</h3>
            </div>
          </Form>
        )}
      </Formik>
      <a className="link-on-chat" onClick={() => window.location = '/'}>{i18n.t('loginForm.hexletChat')}</a>
    </div>
  )
}