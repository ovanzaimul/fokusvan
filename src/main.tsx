import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter, Routes, Route } from "react-router";

import App from "./App.tsx";
import { Toaster } from "./components/ui/toast.tsx";
import { AuthContext } from "./features/auth";
import { ActivityContext } from "./features/activities/ActivitiesContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContext>
        <ActivityContext>
          <Routes>
            <Route path="/" element={<App />} />
          </Routes>
          <Toaster />
        </ActivityContext>
      </AuthContext>
    </BrowserRouter>
  </StrictMode>,
);
