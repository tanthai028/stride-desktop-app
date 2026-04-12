const fs = require("fs");
const path = require("path");
const { app } = require("electron");

const DEFAULT_ITEMS = [
  {
    id: "1",
    title: "Raymond James - Software Developer Track",
    description:
      "Applied to the IT Accelerated Development Program software developer track. Need to track recruiter updates and follow-up timing.",
    tag: "Applied",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "GE Aerospace - Early Career SWE",
    description:
      "Saved as a target role because prior internship experience is relevant. Need to compare against other internal tools or platform roles.",
    tag: "Wishlist",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Palantir - Deployment Strategist / SWE",
    description:
      "High-interest company. Keep notes on role fit, technical expectations, and whether the workflow matches long-term goals.",
    tag: "Interview",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "JPMorgan Chase - Software Engineer Program",
    description:
      "Past internship connection makes this useful as a reference application. Keep notes on timeline and resume version used.",
    tag: "OA",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function getLibraryFilePath() {
  return path.join(app.getPath("userData"), "library-items.json");
}

function ensureLibraryFile() {
  const filePath = getLibraryFilePath();
  const directory = path.dirname(filePath);

  fs.mkdirSync(directory, { recursive: true });

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(DEFAULT_ITEMS, null, 2), "utf8");
  }

  return filePath;
}

function readLibraryItems() {
  try {
    const filePath = ensureLibraryFile();
    const rawValue = fs.readFileSync(filePath, "utf8");
    const parsedValue = JSON.parse(rawValue);

    return Array.isArray(parsedValue) ? parsedValue : DEFAULT_ITEMS;
  } catch {
    return DEFAULT_ITEMS;
  }
}

function writeLibraryItems(items) {
  const filePath = ensureLibraryFile();
  fs.writeFileSync(filePath, JSON.stringify(items, null, 2), "utf8");
  return items;
}

function createLibraryItem(formValues) {
  const currentItems = readLibraryItems();
  const timestamp = new Date().toISOString();

  const newItem = {
    id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: formValues.title,
    description: formValues.description,
    tag: formValues.tag,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const nextItems = [newItem, ...currentItems];
  writeLibraryItems(nextItems);

  return newItem;
}

function updateLibraryItem(itemId, formValues) {
  const currentItems = readLibraryItems();

  const nextItems = currentItems.map((item) =>
    item.id === itemId
      ? {
          ...item,
          ...formValues,
          updatedAt: new Date().toISOString(),
        }
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
  writeLibraryItems(DEFAULT_ITEMS);
  return DEFAULT_ITEMS;
}

module.exports = {
  readLibraryItems,
  createLibraryItem,
  updateLibraryItem,
  deleteLibraryItem,
  resetLibraryItems,
};
