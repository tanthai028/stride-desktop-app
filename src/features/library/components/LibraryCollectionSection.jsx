import PageSection from "../../../components/page/PageSection.jsx";
import PageActionBar from "../../../components/page/PageActionBar.jsx";
import ItemGrid from "../../../components/page/ItemGrid.jsx";
import EmptyState from "../../../components/page/EmptyState.jsx";
import LibraryCard from "./LibraryCard.jsx";
import { librarySortOptions } from "../constants/sortOptions.js";

const actionButtonClassName =
  "interactive rounded-2xl bg-pink-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:scale-[1.01]";

function LibraryCollectionSection({
  items,
  filteredItems,
  searchValue,
  onSearchChange,
  sortValue,
  onSortChange,
  isPageReady,
  onItemClick,
  onClearFilters,
  onAddItem,
}) {
  const hasItems = items.length > 0;
  const hasFilteredItems = filteredItems.length > 0;

  return (
    <PageSection
      title="All Applications"
      description={`Total Jobs Applied: ${items.length}`}
    >
      <PageActionBar
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        sortValue={sortValue}
        onSortChange={onSortChange}
        sortOptions={librarySortOptions}
        searchPlaceholder="Search job applications..."
      />

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto scrollbar-hide">
        <div className="min-h-full">
          {hasFilteredItems ? (
            <ItemGrid
              items={filteredItems}
              onItemClick={isPageReady ? onItemClick : undefined}
              renderItem={(item) => <LibraryCard item={item} />}
            />
          ) : (
            <EmptyState
              title={
                hasItems
                  ? "🔎 No matching library items"
                  : "📭 Your library is empty"
              }
              description={
                hasItems
                  ? "Try a different search or clear your filters to see available items."
                  : "Add your first item to start building your reusable collection."
              }
              action={
                hasItems ? (
                  <button
                    type="button"
                    onClick={onClearFilters}
                    className={actionButtonClassName}
                  >
                    Clear Filters
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onAddItem}
                    className={actionButtonClassName}
                  >
                    ✨ Add First Item
                  </button>
                )
              }
            />
          )}
        </div>
      </div>
    </PageSection>
  );
}

export default LibraryCollectionSection;
