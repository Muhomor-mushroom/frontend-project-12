import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PageOne, PageTwo, PageThree } from "./routes/buildPage.jsx";

const mainForm = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PageOne />} />
          <Route path="/login" element={<PageTwo />} />
          <Route path={null} element={<PageThree />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default mainForm;