import { supabase } from "@/lib/supabase";
import * as changeKeys from "change-case/keys";
import type { Settings } from "./SettingsContext";
import { DEFAULT_MESSAGE, DISPLAY_MESSAGES } from "@/lib/errors";

export interface SettingsDB {
  focus_minutes: number;
  rest_minutes: number;
  recovery_minutes: number;
  cycle_length: number;
}

export async function fetchSettings() {
  const { data, error } = await supabase
    .from("settings")
    .select()
    .limit(1)
    .single();
  if (error) {
    const key = error.code ?? error.name;
    throw new Error(DISPLAY_MESSAGES[key] || DEFAULT_MESSAGE);
  }
  return changeKeys.camelCase(data);
}

export async function updateSettings(id: string, settings: Settings) {
  const settingsSnake = changeKeys.snakeCase(settings) as SettingsDB;
  const { data, error } = await supabase
    .from("settings")
    .upsert({ ...settingsSnake, user_id: id }, { onConflict: "user_id" })
    .select()
    .limit(1)
    .single();
  if (error) {
    const key = error.code ?? error.name;
    throw new Error(DISPLAY_MESSAGES[key] || DEFAULT_MESSAGE);
  }
  return changeKeys.camelCase(data);
}
