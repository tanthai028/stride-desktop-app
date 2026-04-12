function getNormalizedValue(value = "") {
  return String(value).trim().toLowerCase();
}

function getAppliedTimestamp(item) {
  const parsedDate = item.appliedAt ? new Date(item.appliedAt).getTime() : NaN;
  return Number.isNaN(parsedDate) ? 0 : parsedDate;
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

  if (sortValue === "appliedAt-desc") {
    nextItems = [...nextItems].sort(
      (leftItem, rightItem) =>
        getAppliedTimestamp(rightItem) - getAppliedTimestamp(leftItem),
    );
  }

  if (sortValue === "appliedAt-asc") {
    nextItems = [...nextItems].sort(
      (leftItem, rightItem) =>
        getAppliedTimestamp(leftItem) - getAppliedTimestamp(rightItem),
    );
  }

  if (sortValue === "company-asc") {
    nextItems = [...nextItems].sort((leftItem, rightItem) =>
      getNormalizedValue(leftItem.company).localeCompare(
        getNormalizedValue(rightItem.company),
      ),
    );
  }

  if (sortValue === "status-asc") {
    nextItems = [...nextItems].sort((leftItem, rightItem) =>
      getNormalizedValue(leftItem.status).localeCompare(
        getNormalizedValue(rightItem.status),
      ),
    );
  }

  return nextItems;
}
