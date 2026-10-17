import type { Activity } from "@/features/activities/ActivitiesContext";
import { supabase } from "./supabase";

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
  try {
    const { error } = await supabase.from("activities").insert(localActivities);

    if (error) throw error;

    localStorage.removeItem(ACTIVITIES_KEY);
  } catch (err) {
    console.error(err);
  }
}
