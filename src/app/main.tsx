/**
 * HyperMixer: six modules, one path. Connect → Brands → Swipe → Edit → Publish,
 * with the Dashboard as home. Data, Claude, media and rendering come from the
 * same local services the classic board (board.html) uses, so both read the
 * same brands and posts.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerWorker } from "../shim/assets";
import { folder } from "../shim/folder";
import { setupNative } from "../shim/native";
import { startRenderer } from "../shim/render";
import App from "./App";
import "./app.css";

(async () => {
  setupNative();
  await registerWorker();
  createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
  startRenderer();
  folder.restore().catch(() => {});
})();
