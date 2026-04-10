import PageSection from "../../../components/page/PageSection.jsx";
import PageActionBar from "../../../components/page/PageActionBar.jsx";
import ItemGrid from "../../../components/page/ItemGrid.jsx";
import EmptyState from "../../../components/page/EmptyState.jsx";
import PageScrollbar from "../../../components/page/PageScrollbar.jsx";
import usePageScrollbar from "../../../components/page/usePageScrollbar.js";
import ActionButton from "../../../components/ui/ActionButton.jsx";
import LibraryCard from "./LibraryCard.jsx";
import { librarySortOptions } from "../constants/sortOptions.js";

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

  const {
    scrollRef,
    scrollMetrics,
    isScrollbarVisible,
    handleScroll,
    handlePointerEnter,
    handlePointerLeave,
  } = usePageScrollbar();

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

      <div className="relative mt-4 min-h-0 flex-1">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          className="h-full min-h-0 overflow-y-auto scrollbar-hide pr-1"
        >
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
                    <ActionButton onClick={onClearFilters}>
                      Clear Filters
                    </ActionButton>
                  ) : (
                    <ActionButton
                      variant="library-add"
                      withIcon
                      onClick={onAddItem}
                    >
                      ✨ Add First Item
                    </ActionButton>
                  )
                }
              />
            )}
          </div>
        </div>

        <PageScrollbar
          isVisible={isScrollbarVisible}
          scrollMetrics={scrollMetrics}
        />
      </div>
    </PageSection>
  );
}

export default LibraryCollectionSection;
