import { libraryItems as defaultLibraryItems } from "../data/librarySeedData.js";
import { parseJobUrl } from "./jobUrlParser.js";

const DEFAULT_STATUS = "Unapplied";

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

function normalizeText(value = "") {
  return String(value).trim().toLowerCase();
}

function getAppliedTimestamp(value) {
  const parsedDate = value ? new Date(value).getTime() : NaN;
  return Number.isNaN(parsedDate) ? 0 : parsedDate;
}

function buildSearchText(fields = []) {
  return fields
    .map((value) => normalizeText(value))
    .filter(Boolean)
    .join(" ");
}

function addDerivedLibraryFields(item) {
  return {
    ...item,
    _searchText: buildSearchText([
      item.company,
      item.role,
      item.status,
      item.location,
      item.notes,
      item.jobUrl,
      item.priority,
    ]),
    _appliedTimestamp: getAppliedTimestamp(item.appliedAt),
    _statusNormalized: normalizeText(item.status),
  };
}

function normalizeLibraryItem(item = {}) {
  const nowIso = new Date().toISOString();
  const company = (item.company ?? "").trim();
  const role = (item.role ?? "").trim();
  const status =
    (item.status ?? item.tag ?? DEFAULT_STATUS).trim() || DEFAULT_STATUS;
  const jobUrl = (item.jobUrl ?? "").trim();
  const location = (item.location ?? "").trim();
  const notes = (item.notes ?? item.description ?? "").trim();
  const appliedAt =
    toIsoDateTime(item.appliedAt ?? item.createdAt ?? "") || nowIso;
  const createdAt = toIsoDateTime(item.createdAt) || appliedAt || nowIso;
  const updatedAt = toIsoDateTime(item.updatedAt) || nowIso;
  const jobDescription = String(item.jobDescription ?? "").trim();
  const requirements = String(item.requirements ?? "").trim();
  const contactInfo = String(item.contactInfo ?? "").trim();
  const nextSteps = String(item.nextSteps ?? "").trim();

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

  return addDerivedLibraryFields({
    id: item.id || createItemId(),
    company: nextCompany,
    role: nextRole,
    status,
    jobUrl,
    location,
    priority: String(item.priority ?? "Medium").trim() || "Medium",
    pinned: Boolean(item.pinned),
    appliedAt,
    notes,
    createdAt,
    updatedAt,
    jobDescription,
    requirements,
    contactInfo,
    nextSteps,
  });
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
    const newItem = await invokeElectronLibraryApi("addItem", formValues);
    return normalizeLibraryItem(newItem);
  }

  const currentItems = await getLibraryItems();
  const timestamp = new Date().toISOString();

  const newItem = normalizeLibraryItem({
    id: createItemId(),
    status: DEFAULT_STATUS,
    appliedAt: timestamp,
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
  const normalizedDefaults = normalizeLibraryItems(defaultLibraryItems);

  if (hasElectronLibraryApi()) {
    const resetItems = await invokeElectronLibraryApi("resetItems");
    return normalizeLibraryItems(resetItems);
  }

  localStorage.setItem("library-items", JSON.stringify(normalizedDefaults));
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

    localStorage.setItem(`library-backup-${backup.id}`, JSON.stringify(backup));
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

  const stored = localStorage.getItem(`library-backup-${backupId}`);
  const parsed = stored ? JSON.parse(stored) : null;
  const items = normalizeLibraryItems(parsed?.items ?? []);

  localStorage.setItem("library-items", JSON.stringify(items));
  return items;
}

export async function deleteLibraryBackup(backupId) {
  if (
    hasElectronLibraryApi() &&
    typeof window.libraryApi.deleteBackup === "function"
  ) {
    return invokeElectronLibraryApi("deleteBackup", backupId);
  }

  localStorage.removeItem(`library-backup-${backupId}`);

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
