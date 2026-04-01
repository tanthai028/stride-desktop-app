import { useEffect, useMemo, useState } from "react";
import PageShell from "../../../components/page/PageShell.jsx";
import PageSection from "../../../components/page/PageSection.jsx";
import ItemGrid from "../../../components/page/ItemGrid.jsx";
import EmptyState from "../../../components/page/EmptyState.jsx";
import PageActionBar from "../../../components/page/PageActionBar.jsx";
import { libraryItems as defaultLibraryItems } from "../../../data/libraryItems.js";

const STORAGE_KEY = "library-items";

const sortOptions = [
  { value: "title-asc", label: "Title A-Z" },
  { value: "title-desc", label: "Title Z-A" },
  { value: "tag-asc", label: "Tag A-Z" },
];

function LibraryPage() {
  const [items, setItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState("title-asc");

  useEffect(() => {
    const savedItems = window.localStorage.getItem(STORAGE_KEY);

    if (!savedItems) {
      setItems(defaultLibraryItems);
      return;
    }

    try {
      const parsedItems = JSON.parse(savedItems);

      if (Array.isArray(parsedItems)) {
        setItems(parsedItems);
      } else {
        setItems(defaultLibraryItems);
      }
    } catch {
      setItems(defaultLibraryItems);
    }
  }, []);

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const filteredItems = useMemo(() => {
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
        leftItem.title.localeCompare(rightItem.title)
      );
    }

    if (sortValue === "title-desc") {
      nextItems = [...nextItems].sort((leftItem, rightItem) =>
        rightItem.title.localeCompare(leftItem.title)
      );
    }

    if (sortValue === "tag-asc") {
      nextItems = [...nextItems].sort((leftItem, rightItem) =>
        leftItem.tag.localeCompare(rightItem.tag)
      );
    }

    return nextItems;
  }, [items, searchValue, sortValue]);

  function clearFilters() {
    setSearchValue("");
    setSortValue("title-asc");
  }

  return (
    <PageShell
      eyebrow="Library"
      title="Saved Building Blocks"
      description="A reusable list-style page with search, sorting, and empty-state support."
      actions={
        <button
          type="button"
          className="rounded-2xl bg-pink-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:scale-[1.01]"
        >
          Add Item
        </button>
      }
    >
      <PageSection
        title="Items"
        description="Example cards rendered from shared data."
      >
        <PageActionBar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          sortValue={sortValue}
          onSortChange={setSortValue}
          sortOptions={sortOptions}
          searchPlaceholder="Search library items..."
        />

        {filteredItems.length > 0 ? (
          <ItemGrid
            items={filteredItems}
            renderItem={(item) => (
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-slate-800">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    {item.description}
                  </p>
                </div>

                <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-500">
                  {item.tag}
                </span>
              </div>
            )}
          />
        ) : (
          <EmptyState
            title="No matching library items"
            description="Try a different search or clear your filters to see available items."
            action={
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-2xl bg-pink-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:scale-[1.01]"
              >
                Clear Filters
              </button>
            }
          />
        )}
      </PageSection>
    </PageShell>
  );
}

export default LibraryPage;