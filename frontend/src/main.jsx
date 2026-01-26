import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import RootWithGoogleProvider from "./RootWithGoogleProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RootWithGoogleProvider />
  </StrictMode>
);
