import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./routes/pages/HomePage.jsx";
import LoginPage from "./routes/pages/loginPage.jsx";
import ErrorPage from "./routes/pages/errorPage.jsx";
import SignupPage from "./routes/pages/signupPage.jsx";

const mainForm = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default mainForm;
