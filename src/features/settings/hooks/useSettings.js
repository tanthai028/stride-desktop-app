import { useEffect, useRef, useState } from "react";
import { DEFAULT_SETTINGS } from "../../../constants/app.js";
import {
  getStoredSettings,
  saveStoredSettings,
} from "../storage/settingsStorage.js";
import { resetLibraryItems } from "../../library/utils/libraryClient.js";

const SETTINGS_PERSIST_DELAY_MS = 200;

export function useSettings() {
  const [settings, setSettings] = useState(() => {
    return getStoredSettings();
  });

  const persistTimeoutRef = useRef(null);
  const latestSettingsRef = useRef(settings);

  useEffect(() => {
    latestSettingsRef.current = settings;

    if (persistTimeoutRef.current) {
      window.clearTimeout(persistTimeoutRef.current);
    }

    persistTimeoutRef.current = window.setTimeout(() => {
      saveStoredSettings(latestSettingsRef.current);
      persistTimeoutRef.current = null;
    }, SETTINGS_PERSIST_DELAY_MS);

    return () => {
      if (persistTimeoutRef.current) {
        window.clearTimeout(persistTimeoutRef.current);
      }
    };
  }, [settings]);

  useEffect(() => {
    function flushPendingSettings() {
      if (persistTimeoutRef.current) {
        window.clearTimeout(persistTimeoutRef.current);
        persistTimeoutRef.current = null;
      }

      saveStoredSettings(latestSettingsRef.current);
    }

    window.addEventListener("beforeunload", flushPendingSettings);

    return () => {
      window.removeEventListener("beforeunload", flushPendingSettings);
      flushPendingSettings();
    };
  }, []);

  function updateSetting(key, value) {
    setSettings((currentSettings) => ({
      ...currentSettings,
      [key]: value,
    }));
  }

  async function resetSettings() {
    await resetLibraryItems();

    const nextSettings = {
      ...DEFAULT_SETTINGS,
      resetVersion: latestSettingsRef.current.resetVersion + 1,
    };

    setSettings(nextSettings);
    saveStoredSettings(nextSettings);

    if (persistTimeoutRef.current) {
      window.clearTimeout(persistTimeoutRef.current);
      persistTimeoutRef.current = null;
    }
  }

  return {
    settings,
    updateSetting,
    resetSettings,
  };
}
