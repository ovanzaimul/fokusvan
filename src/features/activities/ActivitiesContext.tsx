import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../auth";
import {
  ACTIVITIES_KEY,
  hasLocalActivities,
  readLocalActivities,
} from "@/lib/local-activities";
import {
  createActivity,
  createFocusSessions,
  deleteActivity,
  fetchActivities,
  updateActivity,
} from "./activitiesApi";

export interface Activity {
  id: string;
  createdAt: string;
  title: string;
  estimation: number;
  completed: number;
  focusMinutes: Record<string, number>;
  focusSessions: {
    minutes: number;
    completedAt: string;
  }[];
  done: boolean;
  completedAt: string | null;
}

export interface FocusSession {
  minutes: number;
  activityId: string | null;
  completedAt: string;
}

interface ActivitiesContextType {
  activities: Activity[];
  activeActivityId: string | null;
  updateActiveActivityId: (id: string) => void;
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
  getActivities: () => Promise<void>;
  addActivity: ({
    title,
    estimation,
  }: Pick<Activity, "title" | "estimation">) => Promise<void>;
  saveActivity: (
    id: string,
    { title, estimation }: Partial<Activity>,
  ) => Promise<void>;
  removeActivity: (id: string) => Promise<void>;
  completeFocusActivity: (minutes: number) => Promise<void>;
  setOpenMergeDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openMergeDialog: boolean;
  loading: boolean;
  error: string;
}

const Context = createContext<ActivitiesContextType | null>(null);

function initActivityId() {
  const activityId = localStorage.getItem("activityId");
  return activityId;
}
const askToMerge = JSON.parse(localStorage.getItem("askToMerge") || "false");

export function ActivityContext({ children }: { children: React.ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeActivityId, setActiveActivityId] = useState<string | null>(
    initActivityId,
  );
  const [openMergeDialog, setOpenMergeDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { claims } = useAuth();
  const userId = claims?.sub;

  async function getActivities() {
    try {
      setLoading(true);
      const data = await fetchActivities();
      setActivities(data);
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function addActivity({
    title,
    estimation,
  }: Pick<Activity, "title" | "estimation">) {
    const newActivity = {
      id: crypto.randomUUID(),
      title,
      createdAt: new Date().toISOString(),
      estimation,
      completed: 0,
      focusMinutes: {},
      done: false,
      completedAt: null,
    } as Activity;
    if (userId) {
      // db(if signed in)
      await createActivity(newActivity);
      const newActivities = [...activities, newActivity];
      setActivities(newActivities);
    } else {
      // local
      const newActivities = [...activities, newActivity];
      setActivities(newActivities);
      localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(newActivities));
      localStorage.setItem("askToMerge", JSON.stringify(true));
    }
  }

  async function saveActivity(
    id: string,
    { title, estimation }: Partial<Activity>,
  ) {
    if (userId) {
      await updateActivity(id, { title, estimation });
      const updated = activities.map((activity) =>
        activity.id === id ? { ...activity, title, estimation } : activity,
      ) as Activity[];
      setActivities(updated);
    } else {
      const updated = activities.map((activity) =>
        activity.id === id ? { ...activity, title, estimation } : activity,
      ) as Activity[];
      setActivities(updated);
      localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(updated));
    }
  }

  async function removeActivity(id: string) {
    if (userId) {
      await deleteActivity(id);
      const updated = activities.filter((activity) => activity.id !== id);
      setActivities(updated);
    } else {
      const updated = activities.filter((activity) => activity.id !== id);
      setActivities(updated);
      localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(updated));
    }
    if (id === activeActivityId) {
      setActiveActivityId(null);
      localStorage.removeItem("activityId");
    }
  }

  async function completeFocusActivity(minutes: number) {
    const focus = {
      minutes,
      activityId: activeActivityId,
      completedAt: new Date().toISOString(),
    };
    if (userId) {
      await createFocusSessions(focus);
      const updated = activities.map((activity) => {
        return activity.id === activeActivityId
          ? {
              ...activity,
              focusSessions: [...activity.focusSessions, focus],
            }
          : activity;
      });

      setActivities(updated);
    } else {
      const updated = activities.map((activity) => {
        return activity.id === activeActivityId
          ? {
              ...activity,
              completed: activity.completed + 1,
              focusMinutes: {
                ...activity.focusMinutes,
                [minutes]: activity.focusMinutes[minutes]
                  ? activity.focusMinutes[minutes] + 1
                  : 1,
              },
            }
          : activity;
      });

      setActivities(updated);
      localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(updated));
    }
  }

  useEffect(() => {
    // Fix this later(maybe)
    if (!userId) {
      const localActivities = readLocalActivities();
      setActivities(localActivities);
    } else {
      if (hasLocalActivities() && askToMerge) {
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
        getActivities,
        addActivity,
        saveActivity,
        removeActivity,
        completeFocusActivity,
        setOpenMergeDialog,
        openMergeDialog,
        error,
        loading,
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
