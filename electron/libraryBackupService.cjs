const fs = require("fs");
const path = require("path");
const { app, dialog } = require("electron");
const { readLibraryItems } = require("./libraryService.cjs");
const { replaceLibraryRows } = require("./libraryRepository.cjs");
const { normalizeLibraryItems } = require("./libraryDefaults.cjs");
const { LibraryStorageError } = require("./libraryErrors.cjs");

const BACKUP_FILE_EXTENSION = ".json";

const CSV_COLUMNS = [
  { key: "company", label: "Company" },
  { key: "role", label: "Role" },
  { key: "status", label: "Status" },
  { key: "jobUrl", label: "Job URL" },
  { key: "location", label: "Location" },
  { key: "priority", label: "Priority" },
  { key: "appliedAt", label: "Applied At" },
  { key: "notes", label: "Notes" },
  { key: "createdAt", label: "Created At" },
  { key: "updatedAt", label: "Updated At" },
];

function getBackupDirectoryPath() {
  return path.join(app.getPath("userData"), "library-backups");
}

function ensureBackupDirectory() {
  fs.mkdirSync(getBackupDirectoryPath(), { recursive: true });
}

function createBackupId(name) {
  const date = new Date().toISOString().split("T")[0];
  const safeName = sanitizeBackupName(name);

  let counter = 1;
  let backupId = `${date}-${safeName}`;

  while (fs.existsSync(getBackupFilePath(backupId))) {
    counter += 1;
    backupId = `${date}-${counter}-${safeName}`;
  }

  return backupId;
}

function sanitizeBackupName(value) {
  const cleaned = String(value ?? "")
    .trim()
    .replace(/[^a-z0-9-_ ]/gi, "")
    .replace(/\s+/g, "-")
    .slice(0, 48);

  return cleaned || "applications";
}

function getBackupFilePath(backupId) {
  return path.join(
    getBackupDirectoryPath(),
    `${backupId}${BACKUP_FILE_EXTENSION}`,
  );
}

function buildBackupPayload(items) {
  return {
    app: "Stride",
    type: "application-library-backup",
    version: 1,
    exportedAt: new Date().toISOString(),
    items: normalizeLibraryItems(items),
  };
}

function parseBackupPayload(rawValue) {
  const parsedValue = JSON.parse(rawValue);

  if (Array.isArray(parsedValue)) return normalizeLibraryItems(parsedValue);
  if (Array.isArray(parsedValue?.items))
    return normalizeLibraryItems(parsedValue.items);

  throw new Error("Backup file does not contain application items.");
}

function escapeCsvValue(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function itemsToCsv(items) {
  const header = CSV_COLUMNS.map((column) => escapeCsvValue(column.label)).join(
    ",",
  );
  const rows = items.map((item) =>
    CSV_COLUMNS.map((column) => escapeCsvValue(item[column.key])).join(","),
  );

  return [header, ...rows].join("\r\n");
}

function parseCsvRows(rawValue) {
  const rows = [];
  let currentRow = [];
  let currentValue = "";
  let isQuoted = false;

  for (let index = 0; index < rawValue.length; index += 1) {
    const char = rawValue[index];
    const nextChar = rawValue[index + 1];

    if (char === '"') {
      if (isQuoted && nextChar === '"') {
        currentValue += '"';
        index += 1;
      } else {
        isQuoted = !isQuoted;
      }
      continue;
    }

    if (char === "," && !isQuoted) {
      currentRow.push(currentValue);
      currentValue = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !isQuoted) {
      if (char === "\r" && nextChar === "\n") index += 1;
      currentRow.push(currentValue);
      rows.push(currentRow);
      currentRow = [];
      currentValue = "";
      continue;
    }

    currentValue += char;
  }

  if (currentValue || currentRow.length > 0) {
    currentRow.push(currentValue);
    rows.push(currentRow);
  }

  return rows.filter((row) => row.some((value) => String(value).trim()));
}

function normalizeHeader(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function parseCsvItems(rawValue) {
  const rows = parseCsvRows(rawValue);
  if (rows.length <= 1) return [];

  const header = rows[0].map(normalizeHeader);

  const headerMap = {
    company: ["company"],
    role: ["role", "title", "position"],
    status: ["status"],
    jobUrl: ["joburl", "url", "link", "jobposting"],
    location: ["location"],
    priority: ["priority"],
    appliedAt: ["appliedat", "applieddate", "dateapplied"],
    notes: ["notes", "note"],
    createdAt: ["createdat"],
    updatedAt: ["updatedat"],
  };

  function getCell(row, key) {
    const acceptedHeaders = headerMap[key];
    const columnIndex = header.findIndex((column) =>
      acceptedHeaders.includes(column),
    );
    return columnIndex >= 0 ? (row[columnIndex] ?? "") : "";
  }

  return normalizeLibraryItems(
    rows.slice(1).map((row) => ({
      company: getCell(row, "company"),
      role: getCell(row, "role"),
      status: getCell(row, "status"),
      jobUrl: getCell(row, "jobUrl"),
      location: getCell(row, "location"),
      priority: getCell(row, "priority"),
      appliedAt: getCell(row, "appliedAt"),
      notes: getCell(row, "notes"),
      createdAt: getCell(row, "createdAt"),
      updatedAt: getCell(row, "updatedAt"),
    })),
  );
}

function parseImportedItems(filePath) {
  const rawValue = fs.readFileSync(filePath, "utf8");
  const extension = path.extname(filePath).toLowerCase();

  if (extension === ".csv") return parseCsvItems(rawValue);
  return parseBackupPayload(rawValue);
}

function listApplicationBackups() {
  try {
    ensureBackupDirectory();

    return fs
      .readdirSync(getBackupDirectoryPath())
      .filter((fileName) => fileName.endsWith(BACKUP_FILE_EXTENSION))
      .map((fileName) => {
        const filePath = path.join(getBackupDirectoryPath(), fileName);
        const rawValue = fs.readFileSync(filePath, "utf8");
        const parsedValue = JSON.parse(rawValue);
        const items = Array.isArray(parsedValue?.items)
          ? parsedValue.items
          : [];
        const backupId = path.basename(fileName, BACKUP_FILE_EXTENSION);

        return {
          id: backupId,
          label: `${backupId} (${items.length} apps)`,
          createdAt: parsedValue?.exportedAt ?? backupId,
          itemCount: items.length,
        };
      })
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  } catch (error) {
    throw new LibraryStorageError("Failed to list application backups.", {
      cause: error.message,
    });
  }
}

function createApplicationBackup(name) {
  try {
    ensureBackupDirectory();

    const items = readLibraryItems();
    const backupId = createBackupId(name);
    const payload = buildBackupPayload(items);

    fs.writeFileSync(
      getBackupFilePath(backupId),
      JSON.stringify(payload, null, 2),
      "utf8",
    );

    return {
      id: backupId,
      label: `${backupId} (${payload.items.length} apps)`,
      createdAt: payload.exportedAt,
      itemCount: payload.items.length,
    };
  } catch (error) {
    throw new LibraryStorageError("Failed to create application backup.", {
      cause: error.message,
    });
  }
}

function overwriteApplicationBackup(backupId) {
  try {
    ensureBackupDirectory();

    const filePath = getBackupFilePath(backupId);

    if (!fs.existsSync(filePath)) {
      throw new Error("Backup file does not exist.");
    }

    const existingRawValue = fs.readFileSync(filePath, "utf8");
    const existingPayload = JSON.parse(existingRawValue);
    const items = readLibraryItems();

    const payload = {
      ...buildBackupPayload(items),
      exportedAt: existingPayload?.exportedAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf8");

    return {
      id: backupId,
      label: `${backupId} (${payload.items.length} apps)`,
      createdAt: payload.exportedAt,
      updatedAt: payload.updatedAt,
      itemCount: payload.items.length,
    };
  } catch (error) {
    throw new LibraryStorageError("Failed to overwrite application backup.", {
      cause: error.message,
    });
  }
}

function loadApplicationBackup(backupId) {
  try {
    const filePath = getBackupFilePath(backupId);
    const rawValue = fs.readFileSync(filePath, "utf8");
    const items = parseBackupPayload(rawValue);

    replaceLibraryRows(items, items);
    return items;
  } catch (error) {
    throw new LibraryStorageError("Failed to load application backup.", {
      cause: error.message,
    });
  }
}

function deleteApplicationBackup(backupId) {
  try {
    const filePath = getBackupFilePath(backupId);

    if (!fs.existsSync(filePath)) {
      return { deleted: false, id: backupId };
    }

    fs.unlinkSync(filePath);

    return { deleted: true, id: backupId };
  } catch (error) {
    throw new LibraryStorageError("Failed to delete application backup.", {
      cause: error.message,
    });
  }
}

async function importApplicationBackup() {
  try {
    const result = await dialog.showOpenDialog({
      title: "Import applications",
      properties: ["openFile"],
      filters: [
        { name: "Application backups", extensions: ["json", "csv"] },
        { name: "All files", extensions: ["*"] },
      ],
    });

    if (result.canceled || !result.filePaths[0]) {
      return { canceled: true, items: [] };
    }

    const items = parseImportedItems(result.filePaths[0]);
    replaceLibraryRows(items, items);

    return { canceled: false, items };
  } catch (error) {
    throw new LibraryStorageError("Failed to import applications.", {
      cause: error.message,
    });
  }
}

async function exportApplicationsAsCsv() {
  try {
    const items = readLibraryItems();

    const defaultPath = path.join(
      app.getPath("documents"),
      `stride-applications-${createBackupId()}.csv`,
    );

    const result = await dialog.showSaveDialog({
      title: "Export applications for Google Sheets",
      defaultPath,
      filters: [{ name: "CSV", extensions: ["csv"] }],
    });

    if (result.canceled || !result.filePath) {
      return { canceled: true, filePath: "", itemCount: 0 };
    }

    fs.writeFileSync(result.filePath, itemsToCsv(items), "utf8");

    return {
      canceled: false,
      filePath: result.filePath,
      itemCount: items.length,
    };
  } catch (error) {
    throw new LibraryStorageError("Failed to export applications.", {
      cause: error.message,
    });
  }
}

module.exports = {
  listApplicationBackups,
  createApplicationBackup,
  overwriteApplicationBackup,
  loadApplicationBackup,
  deleteApplicationBackup,
  importApplicationBackup,
  exportApplicationsAsCsv,
};
