import { PRIORITY_OPTIONS } from "./libraryPriorities.js";
import { getLibraryStatusOptions } from "./libraryStatuses.js";

export const TABLE_DATE_SCOPE_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "all", label: "All" },
];

export const TABLE_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Status" },
  ...getLibraryStatusOptions().map((option) => ({
    value: option.value,
    label: option.rawLabel ?? option.label,
  })),
];

export const TABLE_PRIORITY_FILTER_OPTIONS = [
  { value: "all", label: "All Priority" },
  ...PRIORITY_OPTIONS,
];

export const EMPTY_TABLE_COLUMN_FILTERS = {
  company: ["all"],
  role: ["all"],
  status: ["all"],
  priority: ["all"],
  location: ["all"],
  appliedAt: "",
};
