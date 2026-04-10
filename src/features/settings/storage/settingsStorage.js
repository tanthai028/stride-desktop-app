import { DEFAULT_SETTINGS } from "../../../constants/app.js";

const SETTINGS_KEY = "desktop-app:settings";

function isElectronSettingsAvailable() {
  return typeof window !== "undefined" && window.appSettings?.get;
}

export function getStoredSettings() {
  try {
    if (isElectronSettingsAvailable()) {
      const storedSettings = window.appSettings.get();

      return {
        ...DEFAULT_SETTINGS,
        ...storedSettings,
      };
    }

    const rawValue = localStorage.getItem(SETTINGS_KEY);

    if (!rawValue) {
      return DEFAULT_SETTINGS;
    }

    const parsedValue = JSON.parse(rawValue);

    return {
      ...DEFAULT_SETTINGS,
      ...parsedValue,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings) {
  if (isElectronSettingsAvailable()) {
    window.appSettings.set(settings);
    return;
  }

  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
