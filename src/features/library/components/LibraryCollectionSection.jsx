import { Plus } from "lucide-react";
import PageSection from "../../../components/page/PageSection.jsx";
import PageActionBar from "../../../components/page/PageActionBar.jsx";
import ItemGrid from "../../../components/page/ItemGrid.jsx";
import EmptyState from "../../../components/page/EmptyState.jsx";
import PageScrollbar from "../../../components/page/PageScrollbar.jsx";
import usePageScrollbar from "../../../components/page/usePageScrollbar.js";
import ActionButton from "../../../components/ui/ActionButton.jsx";
import SelectMenu from "../../../components/ui/SelectMenu.jsx";
import LibraryCard from "./LibraryCard.jsx";
import LibraryTable from "./table/LibraryTable.jsx";
import { librarySortOptions } from "../constants/sortOptions.js";
import { libraryStatusFilterOptions } from "../constants/filterOptions.js";

const libraryViewOptions = [
  { value: "grid", label: "Card Grid" },
  { value: "table", label: "Table List" },
];

function LibraryCollectionSection({
  items,
  filteredItems,
  searchValue,
  onSearchChange,
  sortValue,
  onSortChange,
  tableSortValue,
  onTableSortChange,
  statusFilterValue,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  isPageReady,
  onItemClick,
  onClearFilters,
  onAddItem,
}) {
  const hasItems = items.length > 0;
  const hasFilteredItems = filteredItems.length > 0;
  const isTableView = viewMode === "table";

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
        <div className="library-section-header-actions">
          <SelectMenu
            value={viewMode}
            onChange={onViewModeChange}
            options={libraryViewOptions}
            className="library-view-mode-select"
          />

          <ActionButton
            onClick={onAddItem}
            tone="pink"
            withIcon
            className="pl-3"
          >
            <Plus className="h-4 w-4" />
            <span>Application</span>
          </ActionButton>
        </div>
      }
    >
      <PageActionBar
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        sortValue={sortValue}
        onSortChange={isTableView ? undefined : onSortChange}
        sortOptions={isTableView ? [] : librarySortOptions}
        filterValue={statusFilterValue}
        onFilterChange={isTableView ? undefined : onStatusFilterChange}
        filterOptions={isTableView ? [] : libraryStatusFilterOptions}
        searchPlaceholder="Search company, role, notes, location..."
        showSearch={!isTableView}
      />

      <div className="relative min-h-0 flex-1 overflow-hidden">
        {hasFilteredItems ? (
          isTableView ? (
            <LibraryTable
              items={filteredItems}
              isPageReady={isPageReady}
              onItemClick={onItemClick}
              sortValue={tableSortValue}
              onSortChange={onTableSortChange}
            />
          ) : (
            <>
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                onPointerEnter={handlePointerEnter}
                onPointerLeave={handlePointerLeave}
                className="h-full min-h-0 overflow-y-auto overflow-x-auto scrollbar-hide"
              >
                <div className="min-h-full p-1 pt-1.5">
                  <ItemGrid
                    items={filteredItems}
                    onItemClick={isPageReady ? onItemClick : undefined}
                    renderItem={(item) => <LibraryCard item={item} />}
                  />
                </div>
              </div>

              <PageScrollbar
                isVisible={isScrollbarVisible}
                scrollMetrics={scrollMetrics}
              />
            </>
          )
        ) : (
          <div className="p-1 pt-1.5">
            <EmptyState
              title={
                hasItems
                  ? "🔎 No matching applications"
                  : "📭 Your application tracker is empty"
              }
              description={
                hasItems
                  ? "Try a different search, status filter, sort, or view to find the applications you want."
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
          </div>
        )}
      </div>
    </PageSection>
  );
}

export default LibraryCollectionSection;
