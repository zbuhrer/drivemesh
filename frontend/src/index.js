import React from "react";
import { createRoot } from "react-dom/client";
import TripPlanner from "./App";
import "./index.css"; // We'll create this next

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <TripPlanner />
  </React.StrictMode>,
);
