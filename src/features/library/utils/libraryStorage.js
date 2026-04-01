import { libraryItems } from "../data/libraryData.js";

const STORAGE_KEY = "library-items";

export function loadLibraryItems() {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) return libraryItems;

  try {
    return JSON.parse(stored);
  } catch {
    return libraryItems;
  }
}

export function saveLibraryItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function resetLibraryItems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(libraryItems));
  return libraryItems; // 👈 important
}
