import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import { AppWithProviders } from "@/app/AppWithProviders.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppWithProviders />
  </React.StrictMode>,
);
