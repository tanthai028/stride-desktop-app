function getNormalizedValue(value = "") {
  return String(value).trim().toLowerCase();
}

function sortByText(items, getValue, direction = "asc") {
  const sortedItems = [...items].sort((leftItem, rightItem) =>
    getValue(leftItem).localeCompare(getValue(rightItem)),
  );

  return direction === "desc" ? sortedItems.reverse() : sortedItems;
}

function sortByAppliedDate(items, direction = "desc") {
  const sortedItems = [...items].sort(
    (leftItem, rightItem) =>
      (leftItem._appliedTimestamp ?? 0) - (rightItem._appliedTimestamp ?? 0),
  );

  return direction === "desc" ? sortedItems.reverse() : sortedItems;
}

function getSortableText(item, key) {
  return getNormalizedValue(item[key]);
}

export function getFilteredAndSortedLibraryItems(
  items,
  searchValue,
  sortValue,
  statusFilterValue = "all",
) {
  const normalizedSearch = getNormalizedValue(searchValue);
  const normalizedStatusFilter = getNormalizedValue(statusFilterValue);

  let nextItems = items.filter((item) => {
    const matchesStatus =
      normalizedStatusFilter === "all" ||
      item._statusNormalized === normalizedStatusFilter;

    if (!matchesStatus) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    return (item._searchText ?? "").includes(normalizedSearch);
  });

  switch (sortValue) {
    case "appliedAt-asc":
      nextItems = sortByAppliedDate(nextItems, "asc");
      break;
    case "appliedAt-desc":
      nextItems = sortByAppliedDate(nextItems, "desc");
      break;
    case "company-asc":
      nextItems = sortByText(
        nextItems,
        (item) => getSortableText(item, "company"),
        "asc",
      );
      break;
    case "company-desc":
      nextItems = sortByText(
        nextItems,
        (item) => getSortableText(item, "company"),
        "desc",
      );
      break;
    case "role-asc":
      nextItems = sortByText(
        nextItems,
        (item) => getSortableText(item, "role"),
        "asc",
      );
      break;
    case "role-desc":
      nextItems = sortByText(
        nextItems,
        (item) => getSortableText(item, "role"),
        "desc",
      );
      break;
    case "status-asc":
      nextItems = sortByText(
        nextItems,
        (item) => item._statusNormalized ?? "",
        "asc",
      );
      break;
    case "status-desc":
      nextItems = sortByText(
        nextItems,
        (item) => item._statusNormalized ?? "",
        "desc",
      );
      break;
    case "location-asc":
      nextItems = sortByText(
        nextItems,
        (item) => getSortableText(item, "location"),
        "asc",
      );
      break;
    case "location-desc":
      nextItems = sortByText(
        nextItems,
        (item) => getSortableText(item, "location"),
        "desc",
      );
      break;
    case "priority-asc":
      nextItems = sortByText(
        nextItems,
        (item) => getSortableText(item, "priority"),
        "asc",
      );
      break;
    case "priority-desc":
      nextItems = sortByText(
        nextItems,
        (item) => getSortableText(item, "priority"),
        "desc",
      );
      break;
    default:
      nextItems = sortByAppliedDate(nextItems, "desc");
      break;
  }

  return nextItems;
}

function isSameLocalDay(leftDate, rightDate) {
  return (
    leftDate.getFullYear() === rightDate.getFullYear() &&
    leftDate.getMonth() === rightDate.getMonth() &&
    leftDate.getDate() === rightDate.getDate()
  );
}

function isWithinCurrentWeek(date, now = new Date()) {
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());

  const startOfNextWeek = new Date(startOfWeek);
  startOfNextWeek.setDate(startOfWeek.getDate() + 7);

  return date >= startOfWeek && date < startOfNextWeek;
}

function matchesDateScope(item, dateScope) {
  if (dateScope === "all") return true;

  const timestamp = item._appliedTimestamp ?? 0;
  if (!timestamp) return false;

  const appliedDate = new Date(timestamp);
  if (Number.isNaN(appliedDate.getTime())) return false;

  if (dateScope === "week") return isWithinCurrentWeek(appliedDate);

  return isSameLocalDay(appliedDate, new Date());
}

function matchesPickerFilter(value, filterValue) {
  const normalizedValue = getNormalizedValue(value);

  if (Array.isArray(filterValue)) {
    const normalizedFilters = filterValue.map(getNormalizedValue);

    if (normalizedFilters.length === 0 || normalizedFilters.includes("all")) {
      return true;
    }

    return normalizedFilters.includes(normalizedValue);
  }

  const normalizedFilter = getNormalizedValue(filterValue);

  if (!normalizedFilter || normalizedFilter === "all") {
    return true;
  }

  return normalizedValue === normalizedFilter;
}

function matchesAppliedDateFilter(item, appliedAtFilter) {
  if (!appliedAtFilter) return true;

  const timestamp = item._appliedTimestamp ?? 0;
  if (!timestamp) return false;

  const appliedDate = new Date(timestamp);
  if (Number.isNaN(appliedDate.getTime())) return false;

  const [year, month, day] = appliedAtFilter.split("-").map(Number);
  const selectedDate = new Date(year, month - 1, day);

  return isSameLocalDay(appliedDate, selectedDate);
}

function matchesExactFilter(value, filterValue) {
  const normalizedFilter = getNormalizedValue(filterValue);
  if (!normalizedFilter || normalizedFilter === "all") return true;
  return getNormalizedValue(value) === normalizedFilter;
}

export function sortPinnedItemsFirst(items) {
  return [...items].sort((a, b) => (a.pinned ? 0 : 1) - (b.pinned ? 0 : 1));
}

export function applyTableColumnFilters(
  items,
  tableColumnFilters = {},
  tableDateScope = "all",
) {
  return items.filter((item) => {
    if (!matchesDateScope(item, tableDateScope)) return false;
    if (!matchesAppliedDateFilter(item, tableColumnFilters.appliedAt)) {
      return false;
    }

    return (
      matchesPickerFilter(item.company, tableColumnFilters.company) &&
      matchesPickerFilter(item.role, tableColumnFilters.role) &&
      matchesPickerFilter(item.status, tableColumnFilters.status) &&
      matchesPickerFilter(item.priority, tableColumnFilters.priority) &&
      matchesPickerFilter(item.location, tableColumnFilters.location)
    );
  });
}
