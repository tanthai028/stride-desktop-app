export function createItemId() {
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getFilteredAndSortedLibraryItems(
  items,
  searchValue,
  sortValue,
) {
  const normalizedSearch = searchValue.trim().toLowerCase();

  let nextItems = items.filter((item) => {
    if (!normalizedSearch) {
      return true;
    }

    return (
      item.title.toLowerCase().includes(normalizedSearch) ||
      item.description.toLowerCase().includes(normalizedSearch) ||
      item.tag.toLowerCase().includes(normalizedSearch)
    );
  });

  if (sortValue === "title-asc") {
    nextItems = [...nextItems].sort((leftItem, rightItem) =>
      leftItem.title.localeCompare(rightItem.title),
    );
  }

  if (sortValue === "title-desc") {
    nextItems = [...nextItems].sort((leftItem, rightItem) =>
      rightItem.title.localeCompare(leftItem.title),
    );
  }

  if (sortValue === "tag-asc") {
    nextItems = [...nextItems].sort((leftItem, rightItem) =>
      leftItem.tag.localeCompare(rightItem.tag),
    );
  }

  return nextItems;
}
