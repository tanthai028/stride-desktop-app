const DEFAULT_STATUS = "Unapplied";

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

export function normalizeLibraryItem(item = {}) {
  const nowIso = new Date().toISOString();
  const company = String(item.company ?? "").trim();
  const role = String(item.role ?? "").trim();
  const status =
    String(item.status ?? item.tag ?? DEFAULT_STATUS).trim() || DEFAULT_STATUS;

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
    jobUrl: String(item.jobUrl ?? "").trim(),
    location: String(item.location ?? "").trim(),
    priority: String(item.priority ?? "Medium").trim() || "Medium",
    pinned: Boolean(item.pinned),
    appliedAt: toIsoDateTime(item.appliedAt ?? item.createdAt ?? "") || nowIso,
    notes: String(item.notes ?? item.description ?? "").trim(),
    createdAt: toIsoDateTime(item.createdAt) || nowIso,
    updatedAt: toIsoDateTime(item.updatedAt) || nowIso,
    jobDescription: String(item.jobDescription ?? "").trim(),
    requirements: String(item.requirements ?? "").trim(),
    contactInfo: String(item.contactInfo ?? "").trim(),
    nextSteps: String(item.nextSteps ?? "").trim(),
  });
}

export function normalizeLibraryItems(items = []) {
  return Array.isArray(items) ? items.map(normalizeLibraryItem) : [];
}

export function createLibraryItemId() {
  return createItemId();
}

export { DEFAULT_STATUS };
