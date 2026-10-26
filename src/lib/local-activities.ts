import type { Activity } from "@/features/activities/ActivitiesContext";
import { supabase } from "./supabase";
import { DEFAULT_MESSAGE, DISPLAY_MESSAGES } from "./errors";

export const ACTIVITIES_KEY = "fokusvan:activities";

export function readLocalActivities() {
  try {
    const raw = localStorage.getItem(ACTIVITIES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const hasLocalActivities = () => readLocalActivities().length > 0;

export function toRow(activity: Activity) {
  return {
    id: activity.id,
    title: activity.title,
    created_at: activity.createdAt,
    estimation: activity.estimation,
    completed: activity.completed,
    focus_minutes: activity.focusMinutes,
    done: activity.done,
    completed_at: activity.completedAt,
  };
}

export async function mergeLocalActivities() {
  const localActivities = readLocalActivities().map(toRow);
  const { error } = await supabase.from("activitiess").insert(localActivities);

  if (error) {
    const key = error.code ?? error.name;
    throw new Error(DISPLAY_MESSAGES[key] || DEFAULT_MESSAGE);
  }
  localStorage.removeItem(ACTIVITIES_KEY);
}
