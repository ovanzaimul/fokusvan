import { supabase } from "@/lib/supabase";
import type { Activity } from "./ActivitiesContext";
import { toRow } from "@/lib/local-activities";

export async function addActivity(activity: Activity) {
  const newActivity = toRow(activity);
  try {
    const { error } = await supabase.from("activities").insert(newActivity);
    if (error) throw error;
  } catch (err) {
    console.error(err);
  }
}
