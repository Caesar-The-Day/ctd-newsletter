import { createRoot } from "react-dom/client";
import { HelmetProvider } from 'react-helmet-async';
import { injectSpeedInsights } from "@vercel/speed-insights";
import App from "./App.tsx";
import "./index.css";

// Initialize Vercel Speed Insights
injectSpeedInsights();

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
