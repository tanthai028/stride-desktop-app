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
    default:
      nextItems = sortByAppliedDate(nextItems, "desc");
      break;
  }

  return nextItems;
}
