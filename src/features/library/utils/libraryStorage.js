import { libraryItems as defaultLibraryItems } from "../data/libraryData.js";

export const LIBRARY_STORAGE_KEY = "library-items";

export function loadLibraryItems() {
  const savedItems = window.localStorage.getItem(LIBRARY_STORAGE_KEY);

  if (!savedItems) {
    return defaultLibraryItems;
  }

  try {
    const parsedItems = JSON.parse(savedItems);

    if (Array.isArray(parsedItems)) {
      return parsedItems;
    }

    return defaultLibraryItems;
  } catch {
    return defaultLibraryItems;
  }
}

export function saveLibraryItems(items) {
  window.localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(items));
}
