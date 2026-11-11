import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../auth";
import { fetchSettings, updateSettings } from "./settingsApi";

interface SettingsContextType {
  settings: Settings;
  saveSettings: (settings: Settings) => Promise<void>;
}

export interface Settings {
  focusMinutes: number;
  restMinutes: number;
  recoveryMinutes: number;
  cycleLength: number;
}

interface SettingContextProps {
  children: React.ReactNode;
}

const DEFAULT_VALUES = {
  focusMinutes: 30,
  restMinutes: 5,
  recoveryMinutes: 10,
  cycleLength: 4,
};

function initSettings() {
  const localSettings = localStorage.getItem("settings");
  if (localSettings && JSON.parse(localSettings)) {
    return JSON.parse(localSettings);
  }
  return DEFAULT_VALUES;
}

const Context = createContext<SettingsContextType | null>(null);

export function SettingsContext({ children }: SettingContextProps) {
  const [settings, setSettings] = useState<Settings>(initSettings);

  const { claims } = useAuth();
  const userId = claims?.sub;

  async function saveSettings(settings: Settings) {
    if (userId) {
      const data = await updateSettings(userId, settings);
      setSettings(data);
    } else {
      setSettings(settings);
      localStorage.setItem("settings", JSON.stringify(settings));
    }
    const { focusMinutes, restMinutes, recoveryMinutes, cycleLength } =
      settings;
    setSettings({ focusMinutes, restMinutes, recoveryMinutes, cycleLength });
  }

  useEffect(() => {
    async function loadSettings() {
      if (userId) {
        const data = await fetchSettings();
        setSettings(data);
      }
    }

    loadSettings();
  }, [userId]);

  return (
    <Context
      value={{
        settings,
        saveSettings,
      }}
    >
      {children}
    </Context>
  );
}

export function useSettings() {
  const settings = useContext(Context);

  if (!settings)
    throw new Error(
      "useActivities has to be used within the <ActivitiesContext>",
    );
  return settings;
}
