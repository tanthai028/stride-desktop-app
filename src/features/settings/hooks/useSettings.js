import { useEffect, useState } from "react";
import { DEFAULT_SETTINGS } from "../../../constants/app.js";
import {
  getStoredSettings,
  saveStoredSettings,
} from "../storage/settingsStorage.js";

export function useSettings() {
  const [settings, setSettings] = useState(() => {
    return getStoredSettings();
  });

  useEffect(() => {
    saveStoredSettings(settings);
  }, [settings]);

  function updateSetting(key, value) {
    setSettings((currentSettings) => ({
      ...currentSettings,
      [key]: value,
    }));
  }

  function resetSettings() {
    setSettings(DEFAULT_SETTINGS);
  }

  return {
    settings,
    updateSetting,
    resetSettings,
  };
}