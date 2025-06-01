import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PageOne, PageTwo, PageThree } from "./routes/buildPage.jsx";

function App() {
  const [count, setCount] = useState(0);

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
}

export default App;
