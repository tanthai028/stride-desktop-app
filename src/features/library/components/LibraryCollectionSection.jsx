import PageSection from "../../../components/page/PageSection.jsx";
import PageActionBar from "../../../components/page/PageActionBar.jsx";
import ItemGrid from "../../../components/page/ItemGrid.jsx";
import EmptyState from "../../../components/page/EmptyState.jsx";
import PageScrollbar from "../../../components/page/PageScrollbar.jsx";
import usePageScrollbar from "../../../components/page/usePageScrollbar.js";
import ActionButton from "../../../components/ui/ActionButton.jsx";
import LibraryCard from "./LibraryCard.jsx";
import LibraryTable from "./table/LibraryTable.jsx";
import { librarySortOptions } from "../constants/sortOptions.js";
import { libraryStatusFilterOptions } from "../constants/filterOptions.js";
import { Plus, LayoutGrid, Rows3 } from "lucide-react";
import SelectMenu from "../../../components/ui/SelectMenu.jsx";

const libraryViewOptions = [
  { value: "grid", label: "Card Grid", icon: LayoutGrid },
  { value: "table", label: "Table List", icon: Rows3 },
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
  const actionBarClassName = isTableView
    ? "library-collection-action-bar-table"
    : "library-collection-action-bar-grid";

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
        <ActionButton onClick={onAddItem} tone="pink" withIcon>
          <Plus className="h-4 w-4" />
          <span>Application</span>
        </ActionButton>
      }
    >
      <PageActionBar
        className={actionBarClassName}
        extraControls={
          <SelectMenu
            value={viewMode}
            onChange={onViewModeChange}
            options={libraryViewOptions}
            className="library-view-mode-select library-view-mode-select-icon-only"
          />
        }
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        sortValue={isTableView ? "" : sortValue}
        onSortChange={isTableView ? undefined : onSortChange}
        sortOptions={isTableView ? [] : librarySortOptions}
        filterValue={statusFilterValue}
        onFilterChange={onStatusFilterChange}
        filterOptions={isTableView ? [] : libraryStatusFilterOptions}
        searchPlaceholder="Search company, role, notes, location..."
        showSearch
      />

      <div className="library-collection-content">
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
                className="library-grid-scroll-area scrollbar-hide"
              >
                <div className="library-grid-scroll-inner">
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
        ) : isTableView && hasItems ? (
          <LibraryTable
            items={[]}
            isPageReady={isPageReady}
            onItemClick={onItemClick}
            sortValue={tableSortValue}
            onSortChange={onTableSortChange}
            emptyStateTitle="🔎 No matching applications"
            emptyStateDescription="Try a different search to find the applications you want."
            emptyStateAction={
              searchValue ? (
                <ActionButton onClick={() => onSearchChange("")}>
                  Clear Search
                </ActionButton>
              ) : null
            }
          />
        ) : (
          <div className="library-empty-state-wrap">
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
