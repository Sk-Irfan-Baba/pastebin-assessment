import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Route for the main page */}
        <Route path="/" element={<App />} />

        {/* Route for handling shared links e.g. /p/MB_56b5srI */}
        <Route path="/p/:pasteId" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
