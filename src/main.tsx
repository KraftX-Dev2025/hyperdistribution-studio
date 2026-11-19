import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { StoreProvider } from "./lib/store";
import { MediaProvider } from "./lib/media";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoreProvider>
      <MediaProvider>
        <App />
      </MediaProvider>
    </StoreProvider>
  </StrictMode>,
);
