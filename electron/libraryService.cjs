const { DEFAULT_ITEMS } = require("./libraryDefaults.cjs");
const {
  readLibraryRows,
  replaceLibraryRows,
} = require("./libraryRepository.cjs");
const {
  validateLibraryFormValues,
  normalizeStatusValue,
} = require("./libraryValidation.cjs");
const {
  LibraryNotFoundError,
  LibraryStorageError,
} = require("./libraryErrors.cjs");

function createItemId() {
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function toIsoDateTime(value) {
  if (!value) return "";

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? "" : parsedDate.toISOString();
}

function normalizeLibraryItem(item = {}) {
  const nowIso = new Date().toISOString();
  const company = String(item.company ?? "").trim();
  const role = String(item.role ?? "").trim();
  const status = normalizeStatusValue(item.status ?? item.tag ?? "");
  const jobUrl = String(item.jobUrl ?? "").trim();
  const location = String(item.location ?? "").trim();
  const notes = String(item.notes ?? item.description ?? "").trim();
  const appliedAt = toIsoDateTime(item.appliedAt ?? item.createdAt ?? "");
  const createdAt = toIsoDateTime(item.createdAt) || appliedAt || nowIso;
  const updatedAt = toIsoDateTime(item.updatedAt) || nowIso;

  let nextCompany = company;
  let nextRole = role;

  if (!nextCompany && item.title) {
    const titleParts = String(item.title)
      .split(" - ")
      .map((part) => part.trim())
      .filter(Boolean);

    nextCompany = titleParts[0] || "";
    nextRole = nextRole || titleParts.slice(1).join(" - ");
  }

  return {
    id: item.id || createItemId(),
    company: nextCompany,
    role: nextRole,
    status,
    jobUrl,
    location,
    appliedAt,
    notes,
    createdAt,
    updatedAt,
  };
}

function normalizeLibraryItems(items) {
  const sourceItems = Array.isArray(items) ? items : DEFAULT_ITEMS;
  return sourceItems.map((item) => normalizeLibraryItem(item));
}

function readLibraryItems() {
  try {
    const rows = readLibraryRows(normalizeLibraryItems(DEFAULT_ITEMS));
    return normalizeLibraryItems(rows);
  } catch (error) {
    if (error.code === "STORAGE_ERROR") {
      throw error;
    }

    throw new LibraryStorageError("Failed to load library items.", {
      cause: error.message,
    });
  }
}

function writeLibraryItems(items) {
  try {
    const normalizedItems = normalizeLibraryItems(items);
    replaceLibraryRows(normalizedItems);
    return normalizedItems;
  } catch (error) {
    if (error.code === "STORAGE_ERROR") {
      throw error;
    }

    throw new LibraryStorageError("Failed to save library items.", {
      cause: error.message,
    });
  }
}

function createLibraryItem(formValues) {
  const currentItems = readLibraryItems();
  const timestamp = new Date().toISOString();
  const validatedValues = validateLibraryFormValues(formValues);

  const newItem = normalizeLibraryItem({
    id: createItemId(),
    ...validatedValues,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  const nextItems = [newItem, ...currentItems];
  writeLibraryItems(nextItems);

  return newItem;
}

function updateLibraryItem(itemId, formValues) {
  const currentItems = readLibraryItems();
  const existingItem = currentItems.find((item) => item.id === itemId);

  if (!existingItem) {
    throw new LibraryNotFoundError();
  }

  const validatedValues = validateLibraryFormValues({
    ...existingItem,
    ...formValues,
  });

  const nextItems = currentItems.map((item) =>
    item.id === itemId
      ? normalizeLibraryItem({
          ...item,
          ...validatedValues,
          updatedAt: new Date().toISOString(),
        })
      : item,
  );

  writeLibraryItems(nextItems);

  return nextItems.find((item) => item.id === itemId) ?? null;
}

function deleteLibraryItem(itemId) {
  const currentItems = readLibraryItems();
  const existingItem = currentItems.find((item) => item.id === itemId);

  if (!existingItem) {
    throw new LibraryNotFoundError();
  }

  const nextItems = currentItems.filter((item) => item.id !== itemId);

  writeLibraryItems(nextItems);

  return { success: true };
}

function resetLibraryItems() {
  const resetItems = normalizeLibraryItems(DEFAULT_ITEMS);
  writeLibraryItems(resetItems);
  return resetItems;
}

module.exports = {
  readLibraryItems,
  createLibraryItem,
  updateLibraryItem,
  deleteLibraryItem,
  resetLibraryItems,
};
