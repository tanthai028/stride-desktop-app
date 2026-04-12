import { libraryItems } from "../data/libraryData.js";

function hasElectronLibraryApi() {
  return typeof window !== "undefined" && !!window.libraryApi;
}

export async function getLibraryItems() {
  if (hasElectronLibraryApi()) {
    return window.libraryApi.getItems();
  }

  const stored = localStorage.getItem("library-items");

  if (!stored) {
    localStorage.setItem("library-items", JSON.stringify(libraryItems));
    return libraryItems;
  }

  try {
    return JSON.parse(stored);
  } catch {
    return libraryItems;
  }
}

export async function addLibraryItem(formValues) {
  if (hasElectronLibraryApi()) {
    return window.libraryApi.addItem(formValues);
  }

  const currentItems = await getLibraryItems();
  const timestamp = new Date().toISOString();

  const newItem = {
    id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ...formValues,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const nextItems = [newItem, ...currentItems];
  localStorage.setItem("library-items", JSON.stringify(nextItems));

  return newItem;
}

export async function updateLibraryItem(itemId, formValues) {
  if (hasElectronLibraryApi()) {
    return window.libraryApi.updateItem(itemId, formValues);
  }

  const currentItems = await getLibraryItems();

  const nextItems = currentItems.map((item) =>
    item.id === itemId
      ? {
          ...item,
          ...formValues,
          updatedAt: new Date().toISOString(),
        }
      : item,
  );

  localStorage.setItem("library-items", JSON.stringify(nextItems));

  return nextItems.find((item) => item.id === itemId) ?? null;
}

export async function deleteLibraryItem(itemId) {
  if (hasElectronLibraryApi()) {
    return window.libraryApi.deleteItem(itemId);
  }

  const currentItems = await getLibraryItems();
  const nextItems = currentItems.filter((item) => item.id !== itemId);

  localStorage.setItem("library-items", JSON.stringify(nextItems));

  return { success: true };
}

export async function resetLibraryItems() {
  if (hasElectronLibraryApi()) {
    return window.libraryApi.resetItems();
  }

  localStorage.setItem("library-items", JSON.stringify(libraryItems));
  return libraryItems;
}
