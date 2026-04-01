import { useMemo, useState } from "react";
import PageShell from "../../../components/page/PageShell.jsx";
import PageSection from "../../../components/page/PageSection.jsx";
import ItemGrid from "../../../components/page/ItemGrid.jsx";
import EmptyState from "../../../components/page/EmptyState.jsx";
import PageActionBar from "../../../components/page/PageActionBar.jsx";
import { libraryItems } from "../../../data/libraryItems.js";

const sortOptions = [
  { value: "title-asc", label: "Title A–Z" },
  { value: "title-desc", label: "Title Z–A" },
  { value: "tag-asc", label: "Tag A–Z" },
];

function LibraryPage() {
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState("title-asc");

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    let nextItems = libraryItems.filter((item) => {
      if (!normalizedSearch) {
        return true;
      }

      return (
        item.title.toLowerCase().includes(normalizedSearch) ||
        item.description.toLowerCase().includes(normalizedSearch) ||
        item.tag.toLowerCase().includes(normalizedSearch)
      );
    });

    nextItems = [...nextItems].sort((leftItem, rightItem) => {
      if (sortValue === "title-desc") {
        return rightItem.title.localeCompare(leftItem.title);
      }

      if (sortValue === "tag-asc") {
        return leftItem.tag.localeCompare(rightItem.tag);
      }

      return leftItem.title.localeCompare(rightItem.title);
    });

    return nextItems;
  }, [searchValue, sortValue]);

  const hasItems = filteredItems.length > 0;

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

        {hasItems ? (
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
                onClick={() => {
                  setSearchValue("");
                  setSortValue("title-asc");
                }}
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