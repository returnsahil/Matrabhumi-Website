import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ReactLenis
      root
      options={{
        autoRaf: true,
        anchors: true,
        lerp: 0.09,
        smoothWheel: true,
        wheelMultiplier: 0.9,
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ReactLenis>
  </StrictMode>,
);
