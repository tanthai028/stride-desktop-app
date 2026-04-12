const { DEFAULT_ITEMS } = require("./libraryDefaults.cjs");
const {
  getAllLibraryRows,
  getLibraryRowById,
  insertLibraryRow,
  updateLibraryRow,
  deleteLibraryRow,
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
    const rows = getAllLibraryRows(normalizeLibraryItems(DEFAULT_ITEMS));
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

function createLibraryItem(formValues) {
  try {
    const timestamp = new Date().toISOString();
    const validatedValues = validateLibraryFormValues(formValues);

    const newItem = normalizeLibraryItem({
      id: createItemId(),
      ...validatedValues,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    insertLibraryRow(newItem, normalizeLibraryItems(DEFAULT_ITEMS));

    return newItem;
  } catch (error) {
    if (error.code === "VALIDATION_ERROR" || error.code === "STORAGE_ERROR") {
      throw error;
    }

    throw new LibraryStorageError("Failed to create library item.", {
      cause: error.message,
    });
  }
}

function updateLibraryItem(itemId, formValues) {
  try {
    const existingItem = getLibraryRowById(
      itemId,
      normalizeLibraryItems(DEFAULT_ITEMS),
    );

    if (!existingItem) {
      throw new LibraryNotFoundError();
    }

    const validatedValues = validateLibraryFormValues({
      ...existingItem,
      ...formValues,
    });

    const updatedItem = normalizeLibraryItem({
      ...existingItem,
      ...validatedValues,
      updatedAt: new Date().toISOString(),
    });

    const didUpdate = updateLibraryRow(
      itemId,
      updatedItem,
      normalizeLibraryItems(DEFAULT_ITEMS),
    );

    if (!didUpdate) {
      throw new LibraryNotFoundError();
    }

    return updatedItem;
  } catch (error) {
    if (
      error.code === "VALIDATION_ERROR" ||
      error.code === "NOT_FOUND" ||
      error.code === "STORAGE_ERROR"
    ) {
      throw error;
    }

    throw new LibraryStorageError("Failed to update library item.", {
      cause: error.message,
    });
  }
}

function deleteLibraryItem(itemId) {
  try {
    const didDelete = deleteLibraryRow(
      itemId,
      normalizeLibraryItems(DEFAULT_ITEMS),
    );

    if (!didDelete) {
      throw new LibraryNotFoundError();
    }

    return { success: true };
  } catch (error) {
    if (error.code === "NOT_FOUND" || error.code === "STORAGE_ERROR") {
      throw error;
    }

    throw new LibraryStorageError("Failed to delete library item.", {
      cause: error.message,
    });
  }
}

function resetLibraryItems() {
  try {
    const resetItems = normalizeLibraryItems(DEFAULT_ITEMS);
    replaceLibraryRows(resetItems, resetItems);
    return resetItems;
  } catch (error) {
    if (error.code === "STORAGE_ERROR") {
      throw error;
    }

    throw new LibraryStorageError("Failed to reset library items.", {
      cause: error.message,
    });
  }
}

module.exports = {
  readLibraryItems,
  createLibraryItem,
  updateLibraryItem,
  deleteLibraryItem,
  resetLibraryItems,
};
