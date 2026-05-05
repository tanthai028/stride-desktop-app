import { Plus, LayoutGrid, Rows3 } from "lucide-react";
import PageSection from "../../../components/page/PageSection.jsx";
import PageActionBar from "../../../components/page/PageActionBar.jsx";
import ItemGrid from "../../../components/page/ItemGrid.jsx";
import PageScrollbar from "../../../components/page/PageScrollbar.jsx";
import usePageScrollbar from "../../../components/page/usePageScrollbar.js";
import ActionButton from "../../../components/ui/ActionButton.jsx";
import SelectMenu from "../../../components/ui/SelectMenu.jsx";
import { libraryStatusFilterOptions } from "../constants/filterOptions.js";
import { librarySortOptions } from "../constants/sortOptions.js";
import LibraryCard from "./LibraryCard.jsx";
import LibraryCollectionEmptyState, {
  LibraryCollectionInlineEmptyState,
} from "./LibraryCollectionEmptyState.jsx";
import LibraryTable from "./table/LibraryTable.jsx";

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
  hasLoaded,
  onItemClick,
  onClearFilters,
  onAddItem,
}) {
  const hasItems = items.length > 0;
  const hasFilteredItems = filteredItems.length > 0;
  const isTableView = viewMode === "table";

  function cycleOption(currentValue, options, onChange) {
    const currentIndex = options.findIndex(
      (option) => option.value === currentValue,
    );

    if (currentIndex < 0 || options.length === 0) return;

    const nextIndex = (currentIndex + 1) % options.length;

    onChange(options[nextIndex].value);
  }

  function handleViewModeTriggerClick() {
    cycleOption(viewMode, libraryViewOptions, onViewModeChange);
  }

  function handleSortTriggerClick() {
    cycleOption(sortValue, librarySortOptions, onSortChange);
  }

  const actionBarClassName = isTableView
    ? "library-collection-action-bar-table"
    : "library-collection-action-bar-grid";

  const emptyState = LibraryCollectionEmptyState({
    hasItems,
    searchValue,
    onSearchChange,
    onClearFilters,
    onAddItem,
    isTableView,
  });

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
            onTriggerClick={handleViewModeTriggerClick}
          />
        }
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        sortValue={isTableView ? "" : sortValue}
        onSortChange={isTableView ? undefined : onSortChange}
        sortOptions={isTableView ? [] : librarySortOptions}
        sortTriggerClick={handleSortTriggerClick}
        filterValue={statusFilterValue}
        onFilterChange={onStatusFilterChange}
        filterOptions={isTableView ? [] : libraryStatusFilterOptions}
        searchPlaceholder="Search company, role, notes, location..."
        showSearch
      />

      <div className="library-collection-content">
        {!hasLoaded ? null : hasFilteredItems ? (
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
        ) : emptyState.renderAsTableEmptyState ? (
          <LibraryTable
            items={[]}
            isPageReady={isPageReady}
            onItemClick={onItemClick}
            sortValue={tableSortValue}
            onSortChange={onTableSortChange}
            emptyStateTitle={emptyState.title}
            emptyStateDescription={emptyState.description}
            emptyStateAction={emptyState.action}
          />
        ) : (
          <LibraryCollectionInlineEmptyState
            title={emptyState.title}
            description={emptyState.description}
            action={emptyState.action}
          />
        )}
      </div>
    </PageSection>
  );
}

export default LibraryCollectionSection;
