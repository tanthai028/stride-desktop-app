const fs = require("fs");
const path = require("path");
const { app } = require("electron");
const { DatabaseSync } = require("node:sqlite");
const { LibraryStorageError } = require("./libraryErrors.cjs");

let database = null;

function getLibraryDatabasePath() {
  return path.join(app.getPath("userData"), "library.db");
}

function getLegacyLibraryFilePath() {
  return path.join(app.getPath("userData"), "library-items.json");
}

function ensureDatabaseDirectory() {
  try {
    fs.mkdirSync(app.getPath("userData"), { recursive: true });
  } catch (error) {
    throw new LibraryStorageError("Failed to prepare library database.", {
      cause: error.message,
    });
  }
}

function getDatabase() {
  if (database) {
    return database;
  }

  try {
    ensureDatabaseDirectory();

    database = new DatabaseSync(getLibraryDatabasePath());

    database.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS library_items (
        id TEXT PRIMARY KEY,
        company TEXT NOT NULL,
        role TEXT NOT NULL,
        status TEXT NOT NULL,
        job_url TEXT NOT NULL DEFAULT '',
        location TEXT NOT NULL DEFAULT '',
        applied_at TEXT NOT NULL DEFAULT '',
        notes TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_library_items_status
      ON library_items (status);

      CREATE INDEX IF NOT EXISTS idx_library_items_created_at
      ON library_items (created_at DESC);

      CREATE INDEX IF NOT EXISTS idx_library_items_updated_at
      ON library_items (updated_at DESC);
    `);

    return database;
  } catch (error) {
    throw new LibraryStorageError("Failed to open library database.", {
      cause: error.message,
    });
  }
}

function readLegacyLibraryItems() {
  const legacyFilePath = getLegacyLibraryFilePath();

  if (!fs.existsSync(legacyFilePath)) {
    return null;
  }

  try {
    const rawValue = fs.readFileSync(legacyFilePath, "utf8");
    const parsedValue = JSON.parse(rawValue);

    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch (error) {
    throw new LibraryStorageError("Legacy library data file is corrupted.", {
      cause: error.message,
    });
  }
}

function insertLibraryItems(db, items) {
  const insertStatement = db.prepare(`
    INSERT INTO library_items (
      id,
      company,
      role,
      status,
      job_url,
      location,
      applied_at,
      notes,
      created_at,
      updated_at
    )
    VALUES (
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?
    )
  `);

  for (const item of items) {
    insertStatement.run(
      item.id,
      item.company,
      item.role,
      item.status,
      item.jobUrl ?? "",
      item.location ?? "",
      item.appliedAt ?? "",
      item.notes,
      item.createdAt,
      item.updatedAt,
    );
  }
}

function ensureLibraryRows(seedItems = []) {
  try {
    const db = getDatabase();
    const row = db.prepare("SELECT COUNT(*) AS count FROM library_items").get();

    if ((row?.count ?? 0) > 0) {
      return;
    }

    const legacyItems = readLegacyLibraryItems();
    const sourceItems =
      Array.isArray(legacyItems) && legacyItems.length > 0
        ? legacyItems
        : seedItems;

    if (!Array.isArray(sourceItems) || sourceItems.length === 0) {
      return;
    }

    db.exec("BEGIN");

    try {
      insertLibraryItems(db, sourceItems);
      db.exec("COMMIT");
    } catch (error) {
      db.exec("ROLLBACK");

      throw new LibraryStorageError("Failed to seed library database.", {
        cause: error.message,
      });
    }
  } catch (error) {
    if (error.code === "STORAGE_ERROR") {
      throw error;
    }

    throw new LibraryStorageError("Failed to initialize library database.", {
      cause: error.message,
    });
  }
}

function readLibraryRows(seedItems = []) {
  try {
    ensureLibraryRows(seedItems);

    const db = getDatabase();

    return db
      .prepare(
        `
        SELECT
          id,
          company,
          role,
          status,
          job_url AS jobUrl,
          location,
          applied_at AS appliedAt,
          notes,
          created_at AS createdAt,
          updated_at AS updatedAt
        FROM library_items
        ORDER BY datetime(created_at) DESC, datetime(updated_at) DESC
      `,
      )
      .all();
  } catch (error) {
    if (error.code === "STORAGE_ERROR") {
      throw error;
    }

    throw new LibraryStorageError("Failed to read library data.", {
      cause: error.message,
    });
  }
}

function replaceLibraryRows(items) {
  try {
    const db = getDatabase();

    db.exec("BEGIN");

    try {
      db.exec("DELETE FROM library_items");
      insertLibraryItems(db, items);
      db.exec("COMMIT");
    } catch (error) {
      db.exec("ROLLBACK");

      throw new LibraryStorageError("Failed to write library data.", {
        cause: error.message,
      });
    }

    return items;
  } catch (error) {
    if (error.code === "STORAGE_ERROR") {
      throw error;
    }

    throw new LibraryStorageError("Failed to replace library data.", {
      cause: error.message,
    });
  }
}

module.exports = {
  readLibraryRows,
  replaceLibraryRows,
};
