import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/components.css";
import "./styles/pages.css";
import "./styles/responsive.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("SSLG: #root element is missing from index.html");
}

// Arm the scroll-reveal layer before the first paint. Without this class the
// reveal CSS never hides anything, so a reader without JavaScript, without
// IntersectionObserver, or with reduced motion keeps the whole page visible.
// SiteLayout removes the class again if it cannot run the observer.
const motionOK =
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
if (motionOK && typeof IntersectionObserver !== "undefined") {
  document.documentElement.classList.add("reveal-armed");
}

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
