import { libraryItems as defaultLibraryItems } from "../data/librarySeedData.js";
import { parseJobUrl } from "./jobUrlParser.js";
import {
  createLibraryItemId,
  DEFAULT_STATUS,
  normalizeLibraryItem,
  normalizeLibraryItems,
} from "./libraryItemNormalizers.js";

const LIBRARY_STORAGE_KEY = "library-items";
const BACKUP_STORAGE_KEY_PREFIX = "library-backup-";

function hasElectronLibraryApi() {
  return typeof window !== "undefined" && !!window.libraryApi;
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

function getStoredLibraryItems() {
  return localStorage.getItem(LIBRARY_STORAGE_KEY);
}

function storeLibraryItems(items) {
  localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(items));
}

function getNormalizedDefaultItems() {
  return normalizeLibraryItems(defaultLibraryItems);
}

function formatLocation(value = "") {
  const trimmed = String(value).trim();

  if (!trimmed) return "";

  const lowerValue = trimmed.toLowerCase();

  if (
    lowerValue === "remote" ||
    lowerValue === "hybrid" ||
    lowerValue === "onsite"
  ) {
    return trimmed;
  }

  const parts = trimmed
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0]}, ${parts[1]}`;
  }

  return trimmed;
}

function normalizeParsedJobData(parsed = {}) {
  return {
    company: String(parsed.company ?? "").trim(),
    role: String(parsed.role ?? "").trim(),
    location: formatLocation(parsed.location),
    notes: String(parsed.notes ?? "").trim(),
    source: String(parsed.source ?? "").trim(),
    employmentType: String(parsed.employmentType ?? "").trim(),
    jobDescription: String(parsed.jobDescription ?? "").trim(),
    requirements: String(parsed.requirements ?? "").trim(),
    contactInfo: String(parsed.contactInfo ?? "").trim(),
    nextSteps: String(parsed.nextSteps ?? "").trim(),
    isAtsUrl: Boolean(parsed.isAtsUrl),
    error: String(parsed.error ?? "").trim(),
  };
}

export async function parseLibraryJobUrl(url) {
  const trimmedUrl = String(url ?? "").trim();

  if (!trimmedUrl) {
    return normalizeParsedJobData({});
  }

  if (
    hasElectronLibraryApi() &&
    typeof window.libraryApi.parseJobPostingUrl === "function"
  ) {
    try {
      const parsed = await invokeElectronLibraryApi(
        "parseJobPostingUrl",
        trimmedUrl,
      );
      return normalizeParsedJobData(parsed);
    } catch {
      return normalizeParsedJobData(parseJobUrl(trimmedUrl));
    }
  }

  return normalizeParsedJobData(parseJobUrl(trimmedUrl));
}

export async function getLibraryItems() {
  if (hasElectronLibraryApi()) {
    const items = await invokeElectronLibraryApi("getItems");
    return normalizeLibraryItems(items);
  }

  const stored = getStoredLibraryItems();

  if (!stored) {
    const normalizedDefaults = getNormalizedDefaultItems();
    storeLibraryItems(normalizedDefaults);
    return normalizedDefaults;
  }

  try {
    const parsedItems = JSON.parse(stored);
    const normalizedItems = normalizeLibraryItems(parsedItems);
    storeLibraryItems(normalizedItems);
    return normalizedItems;
  } catch {
    const normalizedDefaults = getNormalizedDefaultItems();
    storeLibraryItems(normalizedDefaults);
    return normalizedDefaults;
  }
}

export async function addLibraryItem(formValues) {
  if (hasElectronLibraryApi()) {
    const newItem = await invokeElectronLibraryApi("addItem", formValues);
    return normalizeLibraryItem(newItem);
  }

  const currentItems = await getLibraryItems();
  const timestamp = new Date().toISOString();

  const newItem = normalizeLibraryItem({
    id: createLibraryItemId(),
    status: DEFAULT_STATUS,
    appliedAt: timestamp,
    ...formValues,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  const nextItems = [newItem, ...currentItems];
  storeLibraryItems(nextItems);

  return newItem;
}

export async function updateLibraryItem(itemId, formValues) {
  if (hasElectronLibraryApi()) {
    const updatedItem = await invokeElectronLibraryApi(
      "updateItem",
      itemId,
      formValues,
    );
    return updatedItem ? normalizeLibraryItem(updatedItem) : null;
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

  storeLibraryItems(nextItems);

  return nextItems.find((item) => item.id === itemId) ?? null;
}

export async function deleteLibraryItem(itemId) {
  if (hasElectronLibraryApi()) {
    return invokeElectronLibraryApi("deleteItem", itemId);
  }

  const currentItems = await getLibraryItems();
  const nextItems = currentItems.filter((item) => item.id !== itemId);

  storeLibraryItems(nextItems);

  return { success: true };
}

export async function resetLibraryItems() {
  const normalizedDefaults = getNormalizedDefaultItems();

  if (hasElectronLibraryApi()) {
    const resetItems = await invokeElectronLibraryApi("resetItems");
    return normalizeLibraryItems(resetItems);
  }

  storeLibraryItems(normalizedDefaults);
  return normalizedDefaults;
}

export async function listLibraryBackups() {
  if (
    !hasElectronLibraryApi() ||
    typeof window.libraryApi.listBackups !== "function"
  ) {
    return [];
  }

  return invokeElectronLibraryApi("listBackups");
}

export async function createLibraryBackup(name = "applications") {
  if (
    !hasElectronLibraryApi() ||
    typeof window.libraryApi.createBackup !== "function"
  ) {
    const items = await getLibraryItems();

    const backup = {
      id: `local-${Date.now()}`,
      label: `Browser backup (${items.length} apps)`,
      createdAt: new Date().toISOString(),
      itemCount: items.length,
      items,
    };

    localStorage.setItem(
      `${BACKUP_STORAGE_KEY_PREFIX}${backup.id}`,
      JSON.stringify(backup),
    );
    return backup;
  }

  return invokeElectronLibraryApi("createBackup", name);
}

export async function loadLibraryBackup(backupId) {
  if (
    hasElectronLibraryApi() &&
    typeof window.libraryApi.loadBackup === "function"
  ) {
    const items = await invokeElectronLibraryApi("loadBackup", backupId);
    return normalizeLibraryItems(items);
  }

  const stored = localStorage.getItem(
    `${BACKUP_STORAGE_KEY_PREFIX}${backupId}`,
  );
  const parsed = stored ? JSON.parse(stored) : null;
  const items = normalizeLibraryItems(parsed?.items ?? []);

  storeLibraryItems(items);
  return items;
}

export async function deleteLibraryBackup(backupId) {
  if (
    hasElectronLibraryApi() &&
    typeof window.libraryApi.deleteBackup === "function"
  ) {
    return invokeElectronLibraryApi("deleteBackup", backupId);
  }

  localStorage.removeItem(`${BACKUP_STORAGE_KEY_PREFIX}${backupId}`);

  return { deleted: true, id: backupId };
}

export async function importLibraryBackup() {
  if (
    !hasElectronLibraryApi() ||
    typeof window.libraryApi.importBackup !== "function"
  ) {
    return { canceled: true, items: [] };
  }

  const result = await invokeElectronLibraryApi("importBackup");

  return {
    ...result,
    items: normalizeLibraryItems(result?.items ?? []),
  };
}

export async function exportLibraryCsv() {
  if (
    !hasElectronLibraryApi() ||
    typeof window.libraryApi.exportCsv !== "function"
  ) {
    return { canceled: true, filePath: "", itemCount: 0 };
  }

  return invokeElectronLibraryApi("exportCsv");
}
