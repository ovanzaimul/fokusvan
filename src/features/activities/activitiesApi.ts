import { supabase } from "@/lib/supabase";
import * as changeKeys from "change-case/keys";
import type { Activity } from "./ActivitiesContext";
import { DEFAULT_MESSAGE, DISPLAY_MESSAGES } from "@/lib/errors";

export interface ActivityDB {
  id: string;
  created_at: string;
  title: string;
  estimation: number;
  completed: number;
  focus_minutes: number;
  done: boolean;
  completed_at: string | null;
}

export async function fetchActivities() {
  const { data, error } = await supabase.from("activities").select();
  if (error) {
    console.error(error);
    const key = error.code ?? error.name;
    throw new Error(DISPLAY_MESSAGES[key] || DEFAULT_MESSAGE);
  }
  return data.map((d) => changeKeys.camelCase(d));
}

export async function createActivity(activity: Activity) {
  const newActivity = changeKeys.snakeCase(activity) as ActivityDB;
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
  const acitivity = changeKeys.snakeCase(activity) as ActivityDB;
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
