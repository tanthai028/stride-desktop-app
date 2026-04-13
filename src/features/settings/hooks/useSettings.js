import { useEffect, useState } from "react";
import { DEFAULT_SETTINGS } from "../../../constants/app.js";
import {
  getStoredSettings,
  saveStoredSettings,
} from "../storage/settingsStorage.js";
import { resetLibraryItems } from "../../library/utils/libraryClient.js";

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

  async function resetSettings() {
    await resetLibraryItems();

    setSettings((prev) => ({
      ...DEFAULT_SETTINGS,
      resetVersion: prev.resetVersion + 1,
    }));
  }

  return {
    settings,
    updateSetting,
    resetSettings,
  };
}
