import { Plus } from "lucide-react";
import PageSection from "../../../components/page/PageSection.jsx";
import PageActionBar from "../../../components/page/PageActionBar.jsx";
import ItemGrid from "../../../components/page/ItemGrid.jsx";
import EmptyState from "../../../components/page/EmptyState.jsx";
import PageScrollbar from "../../../components/page/PageScrollbar.jsx";
import usePageScrollbar from "../../../components/page/usePageScrollbar.js";
import ActionButton from "../../../components/ui/ActionButton.jsx";
import LibraryCard from "./LibraryCard.jsx";
import { librarySortOptions } from "../constants/sortOptions.js";
import { libraryStatusFilterOptions } from "../constants/filterOptions.js";

function LibraryCollectionSection({
  items,
  filteredItems,
  searchValue,
  onSearchChange,
  sortValue,
  onSortChange,
  statusFilterValue,
  onStatusFilterChange,
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
      description={`Tracked Applications: ${items.length}`}
      headerAction={
        <ActionButton onClick={onAddItem} tone="pink" withIcon className="pl-3">
          <Plus className="h-4 w-4" />
          <span>Application</span>
        </ActionButton>
      }
    >
      <PageActionBar
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        sortValue={sortValue}
        onSortChange={onSortChange}
        sortOptions={librarySortOptions}
        filterValue={statusFilterValue}
        onFilterChange={onStatusFilterChange}
        filterOptions={libraryStatusFilterOptions}
        searchPlaceholder="Search company, role, notes, location..."
      />

      <div className="relative min-h-0 flex-1 overflow-visible">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          className="h-full min-h-0 overflow-y-auto overflow-x-visible scrollbar-hide"
        >
          <div className="min-h-full p-1 pt-1.5">
            {hasFilteredItems ? (
              <ItemGrid
                items={filteredItems}
                onItemClick={isPageReady ? onItemClick : undefined}
                cardClassName="library-grid-card"
                renderItem={(item) => <LibraryCard item={item} />}
              />
            ) : (
              <EmptyState
                title={
                  hasItems
                    ? "🔎 No matching applications"
                    : "📭 Your application tracker is empty"
                }
                description={
                  hasItems
                    ? "Try a different search, status filter, or sort to find the applications you want."
                    : "Add your first application to start tracking roles, links, and notes in one place."
                }
                action={
                  hasItems ? (
                    <ActionButton onClick={onClearFilters}>
                      Clear Filters
                    </ActionButton>
                  ) : (
                    <ActionButton tone="pink" withIcon onClick={onAddItem}>
                      ✨ Add First Application
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
