import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import { MeetingsProvider } from "./context/MeetingsContext";
import { AvailabilityProvider } from "./context/AvailabilityContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <MeetingsProvider>
        <AvailabilityProvider>
          <App />
        </AvailabilityProvider>
      </MeetingsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
