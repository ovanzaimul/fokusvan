import { supabase } from "@/lib/supabase";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../auth";
import {
  ACTIVITIES_KEY,
  hasLocalActivities,
  readLocalActivities,
} from "@/lib/local-activities";

export interface Activity {
  id: string;
  createdAt: string;
  title: string;
  estimation: number;
  completed: number;
  focusMinutes: number;
  done: boolean;
  completedAt: string | null;
}

interface ActivitiesContextType {
  activities: Activity[];
  activeActivityId: string | null;
  updateActiveActivityId: (id: string) => void;
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
  addActivity: ({
    title,
    estimation,
  }: Pick<Activity, "title" | "estimation">) => void;
  setOpenMergeDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openMergeDialog: boolean;
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
  const [openMergeDialog, setOpenMergeDialog] = useState(false);

  const { claims } = useAuth();
  const userId = claims?.sub;

  async function getActivities() {
    try {
      const { data, error } = await supabase.from("activities").select();
      if (error) throw error;

      setActivities(data);
    } catch (err) {
      console.error(err);
      return;
    }
  }

  function addActivity({
    title,
    estimation,
  }: Pick<Activity, "title" | "estimation">) {
    const newActivity = {
      id: crypto.randomUUID(),
      title,
      createdAt: new Date().toISOString(),
      estimation,
      completed: 0,
      focusMinutes: 0,
      done: false,
      completedAt: null,
    } as Activity;
    // local
    const newActivities = [...activities, newActivity];
    setActivities(newActivities);
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(newActivities));
    // db(if signed in)
  }

  useEffect(() => {
    // Fix this later(maybe)
    if (!userId) {
      const localActivities = readLocalActivities();
      setActivities(localActivities);
    } else {
      if (hasLocalActivities()) {
        setOpenMergeDialog(true);
      } else {
        getActivities();
      }
    }
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
        addActivity,
        setOpenMergeDialog,
        openMergeDialog,
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
