import { supabase } from "@/lib/supabase";
import type { Activity } from "./ActivitiesContext";
import { DEFAULT_MESSAGE, DISPLAY_MESSAGES } from "@/lib/errors";
import { toCamel, toSnake } from "@/lib/caseConvert";

export async function fetchActivities() {
  const { data, error } = await supabase.from("activities").select();
  if (error) {
    console.error(error);
    const key = error.code ?? error.name;
    throw new Error(DISPLAY_MESSAGES[key] || DEFAULT_MESSAGE);
  }
  return data.map(toCamel);
}

export async function createActivity(activity: Activity) {
  const newActivity = toSnake(activity);
  const { error } = await supabase.from("activities").insert(newActivity);
  if (error) {
    console.error(error);
    const key = error.code ?? error.name;
    throw new Error(DISPLAY_MESSAGES[key] || DEFAULT_MESSAGE);
  }
}

export async function updateActivity(
  id: string,
  activity: Partial<Omit<Activity, "id">>,
) {
  const acitivity = toSnake(activity);
  const { error } = await supabase
    .from("activities")
    .update(acitivity)
    .eq("id", id);
  if (error) {
    console.error(error);
    const key = error.code ?? error.name;
    throw new Error(DISPLAY_MESSAGES[key] || DEFAULT_MESSAGE);
  }
}

export async function deleteActivity(id: string) {
  const { error } = await supabase.from("activities").delete().eq("id", id);

  if (error) {
    console.error(error);
    const key = error.code ?? error.name;
    throw new Error(DISPLAY_MESSAGES[key] || DEFAULT_MESSAGE);
  }
}
