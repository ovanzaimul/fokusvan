import { supabase } from "@/lib/supabase";
import type { Settings } from "./SettingsContext";
import { DEFAULT_MESSAGE, DISPLAY_MESSAGES } from "@/lib/errors";

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
  return {
    focusMinutes: data.focus_minutes,
    restMinutes: data.rest_minutes,
    recoveryMinutes: data.recovery_minutes,
    cycleLength: data.cycle_length,
  };
}

export async function updateSettings(id: string, settings: Settings) {
  const settingsSnake = {
    focus_minutes: settings.focusMinutes,
    rest_minutes: settings.restMinutes,
    recovery_minutes: settings.recoveryMinutes,
    cycle_length: settings.cycleLength,
  };
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
  return {
    focusMinutes: data.focus_minutes,
    restMinutes: data.rest_minutes,
    recoveryMinutes: data.recovery_minutes,
    cycleLength: data.cycle_length,
  };
}
