import { DEFAULT_SETTINGS } from "../../../constants/app.js";

const SETTINGS_KEY = "desktop-app:settings";

export function getStoredSettings() {
  try {
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
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}