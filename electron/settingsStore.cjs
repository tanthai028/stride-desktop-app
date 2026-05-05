const fs = require("fs");
const path = require("path");
const { app } = require("electron");

const DEFAULT_SETTINGS = {
  darkMode: false,
  hoverSoundProfile: "off",
  resetVersion: 0,
  libraryViewMode: "grid",
  applyModeScale: 50,
  applyModeOpacity: 100,
};

function getSettingsFilePath() {
  return path.join(app.getPath("userData"), "settings.json");
}

function readAppSettings() {
  try {
    const filePath = getSettingsFilePath();

    if (!fs.existsSync(filePath)) {
      return DEFAULT_SETTINGS;
    }

    const rawValue = fs.readFileSync(filePath, "utf8");
    const parsedValue = JSON.parse(rawValue);

    return {
      ...DEFAULT_SETTINGS,
      ...parsedValue,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function writeAppSettings(settings) {
  try {
    const filePath = getSettingsFilePath();
    const directory = path.dirname(filePath);

    fs.mkdirSync(directory, { recursive: true });

    const nextSettings = {
      ...DEFAULT_SETTINGS,
      ...settings,
    };

    fs.writeFileSync(filePath, JSON.stringify(nextSettings, null, 2), "utf8");

    return nextSettings;
  } catch {
    return settings;
  }
}

module.exports = {
  readAppSettings,
  writeAppSettings,
  DEFAULT_SETTINGS,
};
