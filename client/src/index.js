import React from "react";
import {createRoot} from "react-dom/client";
import {App} from "./App";
import "./index.scss";
import {HelmetProvider} from "react-helmet-async";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
