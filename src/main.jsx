import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.jsx";
import { registerServiceWorker } from "./utils/serviceWorker.js";
import { HelmetProvider } from "react-helmet-async";

// Register service worker for caching
registerServiceWorker();

createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
