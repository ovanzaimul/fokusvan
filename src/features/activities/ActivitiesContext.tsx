import { supabase } from "@/lib/supabase";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../auth";

export interface Activity {
  id: string;
  title: string;
  estimation: number;
  completed: number;
  focusMinues: number;
  done: boolean;
}

interface ActivitiesContextType {
  activities: Activity[];
  activeActivityId: string | null;
  updateActiveActivityId: (id: string) => void;
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
}

const Context = createContext<ActivitiesContextType | null>(null);

function initActivityId() {
  const activityId = localStorage.getItem("activityId");
  return activityId;
}

export function ActivityContext({ children }: { children: React.ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeActivityId, setActiveActivityId] = useState<string | null>(
    initActivityId,
  );

  const { claims } = useAuth();
  const userId = claims?.sub;

  async function getActivities() {
    const { data, error } = await supabase.from("activities").select();
    if (error) {
      console.error(error);
      return;
    }

    setActivities(data);
  }

  useEffect(() => {
    // Fix this later
    getActivities();
  }, [userId]);

  function updateActiveActivityId(id: string) {
    localStorage.setItem("activityId", id);
    setActiveActivityId(id);
  }
  return (
    <Context
      value={{
        activities,
        activeActivityId,
        updateActiveActivityId,
        setActivities,
      }}
    >
      {children}
    </Context>
  );
}

export function useActivities() {
  const activities = useContext(Context);

  if (!activities)
    throw new Error(
      "useActivities has to be used within the <ActivitiesContext>",
    );
  return activities;
}
