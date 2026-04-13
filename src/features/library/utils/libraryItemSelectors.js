function getNormalizedValue(value = "") {
  return String(value).trim().toLowerCase();
}

function getAppliedTimestamp(item) {
  const parsedDate = item.appliedAt ? new Date(item.appliedAt).getTime() : NaN;
  return Number.isNaN(parsedDate) ? 0 : parsedDate;
}

function sortByText(items, getValue, direction = "asc") {
  const sortedItems = [...items].sort((leftItem, rightItem) =>
    getNormalizedValue(getValue(leftItem)).localeCompare(
      getNormalizedValue(getValue(rightItem)),
    ),
  );

  return direction === "desc" ? sortedItems.reverse() : sortedItems;
}

function sortByAppliedDate(items, direction = "desc") {
  const sortedItems = [...items].sort(
    (leftItem, rightItem) =>
      getAppliedTimestamp(leftItem) - getAppliedTimestamp(rightItem),
  );

  return direction === "desc" ? sortedItems.reverse() : sortedItems;
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
      getNormalizedValue(item.status) === normalizedStatusFilter;

    if (!matchesStatus) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    return [
      item.company,
      item.role,
      item.status,
      item.location,
      item.notes,
      item.jobUrl,
    ].some((value) => getNormalizedValue(value).includes(normalizedSearch));
  });

  switch (sortValue) {
    case "appliedAt-asc":
      nextItems = sortByAppliedDate(nextItems, "asc");
      break;
    case "appliedAt-desc":
      nextItems = sortByAppliedDate(nextItems, "desc");
      break;
    case "company-asc":
      nextItems = sortByText(nextItems, (item) => item.company, "asc");
      break;
    case "company-desc":
      nextItems = sortByText(nextItems, (item) => item.company, "desc");
      break;
    case "role-asc":
      nextItems = sortByText(nextItems, (item) => item.role, "asc");
      break;
    case "role-desc":
      nextItems = sortByText(nextItems, (item) => item.role, "desc");
      break;
    case "status-asc":
      nextItems = sortByText(nextItems, (item) => item.status, "asc");
      break;
    case "status-desc":
      nextItems = sortByText(nextItems, (item) => item.status, "desc");
      break;
    case "location-asc":
      nextItems = sortByText(nextItems, (item) => item.location, "asc");
      break;
    case "location-desc":
      nextItems = sortByText(nextItems, (item) => item.location, "desc");
      break;
    default:
      nextItems = sortByAppliedDate(nextItems, "desc");
      break;
  }

  return nextItems;
}
