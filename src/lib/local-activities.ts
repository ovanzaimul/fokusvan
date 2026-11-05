import { supabase } from "./supabase";
import { DEFAULT_MESSAGE, DISPLAY_MESSAGES } from "./errors";
import { toSnake } from "./caseConvert";

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

export async function mergeLocalActivities() {
  const localActivities = readLocalActivities().map(toSnake);
  const { error } = await supabase.from("activities").insert(localActivities);

  if (error) {
    const key = error.code ?? error.name;
    throw new Error(DISPLAY_MESSAGES[key] || DEFAULT_MESSAGE);
  }
  localStorage.removeItem(ACTIVITIES_KEY);
}
