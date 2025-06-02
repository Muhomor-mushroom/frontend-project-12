import { Formik, Field, Form } from "formik";
import { actions } from "../slices/usersSlice.js";
import { selectors } from "../slices/usersSlice.js";
import { useDispatch, useSelector } from "react-redux";

const BuildPage = (index) => {
  const users = useSelector(selectors.selectAll);
  const dispatch = useDispatch();
  
  const onSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    console.log(data);
  }

  if (index == "/login")
    return (
      <>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={({ setSubmitting }) => {
            console.log("Form is validated! Submitting the form...");
            setSubmitting(false);
          }}
        >
          {() => (
            <Form>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <Field type="name" name="name" className="form-control" />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <Field
                  type="password"
                  name="password"
                  className="form-control"
                />
              </div>
              <button type="submit">Submit</button>
            </Form>
          )}
        </Formik>
      </>
    );
  return (
    <>
      <h3>{index === null ? `Page 404 (not found)` : `Page ${index}`}</h3>
    </>
  );
};
export const PageOne = () => BuildPage("/");
export const PageTwo = () => BuildPage("/login");
export const PageThree = () => BuildPage("");
