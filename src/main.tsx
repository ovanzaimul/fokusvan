import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "./components/ui/toast.tsx";
import { AuthContext } from "./features/auth";
import { ActivityContext } from "./features/activities/ActivitiesContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthContext>
      <ActivityContext>
        <App />
        <Toaster />
      </ActivityContext>
    </AuthContext>
  </StrictMode>,
);
