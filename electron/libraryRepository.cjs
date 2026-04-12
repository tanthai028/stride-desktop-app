const fs = require("fs");
const path = require("path");
const { app } = require("electron");
const { LibraryStorageError } = require("./libraryErrors.cjs");

function getLibraryFilePath() {
  return path.join(app.getPath("userData"), "library-items.json");
}

function ensureLibraryFile(seedItems = []) {
  try {
    const filePath = getLibraryFilePath();
    const directory = path.dirname(filePath);

    fs.mkdirSync(directory, { recursive: true });

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(seedItems, null, 2), "utf8");
    }

    return filePath;
  } catch (error) {
    throw new LibraryStorageError("Failed to prepare library storage.", {
      cause: error.message,
    });
  }
}

function readLibraryFile(seedItems = []) {
  try {
    const filePath = ensureLibraryFile(seedItems);
    const rawValue = fs.readFileSync(filePath, "utf8");
    return JSON.parse(rawValue);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new LibraryStorageError("Library data file is corrupted.", {
        cause: error.message,
      });
    }

    if (error.code === "STORAGE_ERROR") {
      throw error;
    }

    throw new LibraryStorageError("Failed to read library data.", {
      cause: error.message,
    });
  }
}

function writeLibraryFile(items) {
  try {
    const filePath = ensureLibraryFile(items);
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2), "utf8");
    return items;
  } catch (error) {
    if (error.code === "STORAGE_ERROR") {
      throw error;
    }

    throw new LibraryStorageError("Failed to write library data.", {
      cause: error.message,
    });
  }
}

module.exports = {
  readLibraryFile,
  writeLibraryFile,
};
