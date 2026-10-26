import { supabase } from "@/lib/supabase";
import type { Activity } from "./ActivitiesContext";
import { toRow } from "@/lib/local-activities";
import { DEFAULT_MESSAGE, DISPLAY_MESSAGES } from "@/lib/errors";

export async function fetchActivities() {
  const { data, error } = await supabase.from("activities").select();
  if (error) {
    console.error(error);
    const key = error.code ?? error.name;
    throw new Error(DISPLAY_MESSAGES[key] || DEFAULT_MESSAGE);
  }
  return data;
}

export async function addActivity(activity: Activity) {
  const newActivity = toRow(activity);
  const { error } = await supabase.from("activities").insert(newActivity);
  if (error) {
    console.error(error);
    const key = error.code ?? error.name;
    throw new Error(DISPLAY_MESSAGES[key] || DEFAULT_MESSAGE);
  }
}
