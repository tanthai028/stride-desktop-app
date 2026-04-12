import { libraryItems as defaultLibraryItems } from "../data/libraryData.js";

function hasElectronLibraryApi() {
  return typeof window !== "undefined" && !!window.libraryApi;
}

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
  const company = (item.company ?? "").trim();
  const role = (item.role ?? "").trim();
  const status = (item.status ?? item.tag ?? "").trim();
  const jobUrl = (item.jobUrl ?? "").trim();
  const location = (item.location ?? "").trim();
  const notes = (item.notes ?? item.description ?? "").trim();
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

    nextCompany = titleParts[0] ?? "";
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
  return Array.isArray(items)
    ? items.map((item) => normalizeLibraryItem(item))
    : defaultLibraryItems.map((item) => normalizeLibraryItem(item));
}

function getLibraryErrorMessage(errorPayload) {
  switch (errorPayload?.code) {
    case "VALIDATION_ERROR":
      return errorPayload.message || "Please fix the form and try again.";
    case "NOT_FOUND":
      return "That application no longer exists.";
    case "STORAGE_ERROR":
      return "Library data could not be saved or loaded.";
    default:
      return "Something went wrong. Please try again.";
  }
}

function normalizeLibraryClientError(error) {
  try {
    const parsedError = JSON.parse(error?.message ?? "");

    if (parsedError?.code) {
      return {
        name: parsedError.name || "LibraryError",
        code: parsedError.code,
        message: getLibraryErrorMessage(parsedError),
        details: parsedError.details ?? null,
      };
    }
  } catch {
    // Fall through to generic error below.
  }

  return {
    name: "LibraryError",
    code: "UNKNOWN_ERROR",
    message: "Something went wrong. Please try again.",
    details: null,
  };
}

async function invokeElectronLibraryApi(methodName, ...args) {
  try {
    return await window.libraryApi[methodName](...args);
  } catch (error) {
    throw normalizeLibraryClientError(error);
  }
}

export async function getLibraryItems() {
  if (hasElectronLibraryApi()) {
    return invokeElectronLibraryApi("getItems");
  }

  const stored = localStorage.getItem("library-items");

  if (!stored) {
    const normalizedDefaults = normalizeLibraryItems(defaultLibraryItems);
    localStorage.setItem("library-items", JSON.stringify(normalizedDefaults));
    return normalizedDefaults;
  }

  try {
    const parsedItems = JSON.parse(stored);
    const normalizedItems = normalizeLibraryItems(parsedItems);
    localStorage.setItem("library-items", JSON.stringify(normalizedItems));
    return normalizedItems;
  } catch {
    const normalizedDefaults = normalizeLibraryItems(defaultLibraryItems);
    localStorage.setItem("library-items", JSON.stringify(normalizedDefaults));
    return normalizedDefaults;
  }
}

export async function addLibraryItem(formValues) {
  if (hasElectronLibraryApi()) {
    return invokeElectronLibraryApi("addItem", formValues);
  }

  const currentItems = await getLibraryItems();
  const timestamp = new Date().toISOString();

  const newItem = normalizeLibraryItem({
    id: createItemId(),
    ...formValues,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  const nextItems = [newItem, ...currentItems];
  localStorage.setItem("library-items", JSON.stringify(nextItems));

  return newItem;
}

export async function updateLibraryItem(itemId, formValues) {
  if (hasElectronLibraryApi()) {
    return invokeElectronLibraryApi("updateItem", itemId, formValues);
  }

  const currentItems = await getLibraryItems();

  const nextItems = currentItems.map((item) =>
    item.id === itemId
      ? normalizeLibraryItem({
          ...item,
          ...formValues,
          updatedAt: new Date().toISOString(),
        })
      : item,
  );

  localStorage.setItem("library-items", JSON.stringify(nextItems));

  return nextItems.find((item) => item.id === itemId) ?? null;
}

export async function deleteLibraryItem(itemId) {
  if (hasElectronLibraryApi()) {
    return invokeElectronLibraryApi("deleteItem", itemId);
  }

  const currentItems = await getLibraryItems();
  const nextItems = currentItems.filter((item) => item.id !== itemId);

  localStorage.setItem("library-items", JSON.stringify(nextItems));

  return { success: true };
}

export async function resetLibraryItems() {
  if (hasElectronLibraryApi()) {
    return invokeElectronLibraryApi("resetItems");
  }

  const normalizedDefaults = normalizeLibraryItems(defaultLibraryItems);
  localStorage.setItem("library-items", JSON.stringify(normalizedDefaults));
  return normalizedDefaults;
}
