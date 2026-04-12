const fs = require("fs");
const path = require("path");
const { app } = require("electron");

const now = new Date();

function getDateOffset(daysAgo = 0) {
  const date = new Date(now);
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

const DEFAULT_ITEMS = [
  {
    id: "1",
    company: "Raymond James",
    role: "Software Developer Track",
    status: "Applied",
    jobUrl: "https://www.raymondjames.com/careers",
    location: "St. Petersburg, FL",
    appliedAt: getDateOffset(3),
    notes:
      "Applied to the IT Accelerated Development Program software developer track. Need to track recruiter updates, follow-up timing, and resume version used.",
    createdAt: getDateOffset(3),
    updatedAt: getDateOffset(3),
  },
  {
    id: "2",
    company: "GE Aerospace",
    role: "Early Career Software Engineer",
    status: "Wishlist",
    jobUrl: "https://jobs.gecareers.com/",
    location: "Remote",
    appliedAt: "",
    notes:
      "Saved as a target role because prior internship experience is relevant. Need to compare against other internal tools and platform roles before applying.",
    createdAt: getDateOffset(8),
    updatedAt: getDateOffset(8),
  },
  {
    id: "3",
    company: "Palantir",
    role: "Deployment Strategist / SWE",
    status: "Interview",
    jobUrl: "https://www.palantir.com/careers/",
    location: "New York, NY",
    appliedAt: getDateOffset(14),
    notes:
      "High-interest company. Keep notes on role fit, technical expectations, and whether the workflow matches long-term goals.",
    createdAt: getDateOffset(14),
    updatedAt: getDateOffset(10),
  },
  {
    id: "4",
    company: "JPMorgan Chase",
    role: "Software Engineer Program",
    status: "OA",
    jobUrl: "https://careers.jpmorgan.com/",
    location: "Tampa, FL",
    appliedAt: getDateOffset(21),
    notes:
      "Past internship connection makes this useful as a reference application. Keep notes on timeline, OA progress, and follow-up decisions.",
    createdAt: getDateOffset(21),
    updatedAt: getDateOffset(5),
  },
];

function getLibraryFilePath() {
  return path.join(app.getPath("userData"), "library-items.json");
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
  const company = String(item.company ?? "").trim();
  const role = String(item.role ?? "").trim();
  const status = String(item.status ?? item.tag ?? "").trim();
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

function ensureLibraryFile() {
  const filePath = getLibraryFilePath();
  const directory = path.dirname(filePath);

  fs.mkdirSync(directory, { recursive: true });

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(
      filePath,
      JSON.stringify(normalizeLibraryItems(DEFAULT_ITEMS), null, 2),
      "utf8",
    );
  }

  return filePath;
}

function readLibraryItems() {
  try {
    const filePath = ensureLibraryFile();
    const rawValue = fs.readFileSync(filePath, "utf8");
    const parsedValue = JSON.parse(rawValue);
    const normalizedItems = normalizeLibraryItems(parsedValue);

    fs.writeFileSync(
      filePath,
      JSON.stringify(normalizedItems, null, 2),
      "utf8",
    );

    return normalizedItems;
  } catch {
    return normalizeLibraryItems(DEFAULT_ITEMS);
  }
}

function writeLibraryItems(items) {
  const filePath = ensureLibraryFile();
  const normalizedItems = normalizeLibraryItems(items);

  fs.writeFileSync(filePath, JSON.stringify(normalizedItems, null, 2), "utf8");
  return normalizedItems;
}

function createLibraryItem(formValues) {
  const currentItems = readLibraryItems();
  const timestamp = new Date().toISOString();

  const newItem = normalizeLibraryItem({
    id: createItemId(),
    company: formValues.company,
    role: formValues.role,
    status: formValues.status,
    jobUrl: formValues.jobUrl,
    location: formValues.location,
    appliedAt: formValues.appliedAt,
    notes: formValues.notes,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  const nextItems = [newItem, ...currentItems];
  writeLibraryItems(nextItems);

  return newItem;
}

function updateLibraryItem(itemId, formValues) {
  const currentItems = readLibraryItems();

  const nextItems = currentItems.map((item) =>
    item.id === itemId
      ? normalizeLibraryItem({
          ...item,
          ...formValues,
          updatedAt: new Date().toISOString(),
        })
      : item,
  );

  writeLibraryItems(nextItems);

  return nextItems.find((item) => item.id === itemId) ?? null;
}

function deleteLibraryItem(itemId) {
  const currentItems = readLibraryItems();
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
