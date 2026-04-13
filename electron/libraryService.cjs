const {
  getAllLibraryRows,
  getLibraryRowById,
  insertLibraryRow,
  updateLibraryRow,
  deleteLibraryRow,
  replaceLibraryRows,
} = require("./libraryRepository.cjs");
const {
  normalizeLibraryItems,
  normalizeLibraryItem,
} = require("./libraryDefaults.cjs");
const {
  LibraryNotFoundError,
  LibraryStorageError,
} = require("./libraryErrors.cjs");
const { validateLibraryFormValues } = require("./libraryValidation.cjs");

const DEFAULT_ITEMS = require("./libraryDefaults.cjs").DEFAULT_LIBRARY_ITEMS;

function createItemId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readLibraryItems() {
  try {
    return getAllLibraryRows(normalizeLibraryItems(DEFAULT_ITEMS));
  } catch (error) {
    if (error.code === "STORAGE_ERROR") {
      throw error;
    }

    throw new LibraryStorageError("Failed to read library items.", {
      cause: error.message,
    });
  }
}

function createLibraryItem(formValues) {
  try {
    const timestamp = new Date().toISOString();
    const validatedValues = validateLibraryFormValues(formValues, {
      mode: "create",
    });

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

    const validatedValues = validateLibraryFormValues(
      {
        ...existingItem,
        ...formValues,
      },
      { mode: "edit" },
    );

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
