import { Plus } from "lucide-react";
import PageSection from "../../../components/page/PageSection.jsx";
import PageActionBar from "../../../components/page/PageActionBar.jsx";
import ActionButton from "../../../components/ui/ActionButton.jsx";
import { LIBRARY_VIEW_OPTIONS } from "../constants/libraryViewOptions.js";
import LibraryCollectionEmptyState, {
  LibraryCollectionInlineEmptyState,
} from "./LibraryCollectionEmptyState.jsx";
import LibraryGrid from "./LibraryGrid.jsx";
import LibraryTable from "./table/LibraryTable.jsx";
import LibraryTableFilters from "./table/LibraryTableFilters.jsx";
import LibraryViewModeSelect from "./LibraryViewModeSelect.jsx";

function LibraryCollectionSection({
  items,
  filteredItems,
  searchValue,
  onSearchChange,
  tableSortValue,
  onTableSortChange,
  viewMode,
  onViewModeChange,
  isPageReady,
  hasLoaded,
  onItemClick,
  onClearFilters,
  onAddItem,
  tableDateScope,
  onTableDateScopeChange,
  tableColumnFilters,
  onTableColumnFiltersChange,
  onTogglePinned,
}) {
  const hasItems = items.length > 0;
  const hasFilteredItems = filteredItems.length > 0;
  const isTableView = viewMode === "table";

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

  return (
    <PageSection>
      <PageActionBar
        className={actionBarClassName}
        extraControls={
          <LibraryViewModeSelect
            value={viewMode}
            onChange={onViewModeChange}
            options={LIBRARY_VIEW_OPTIONS}
          />
        }
        rowEndAction={
          <>
            <LibraryTableFilters
              items={items}
              dateScope={tableDateScope}
              onDateScopeChange={onTableDateScopeChange}
              columnFilters={tableColumnFilters}
              onColumnFiltersChange={onTableColumnFiltersChange}
            />
            <ActionButton onClick={onAddItem} tone="pink" withIcon>
              <Plus className="h-4 w-4" />
            </ActionButton>
          </>
        }
        searchValue={searchValue}
        onSearchChange={onSearchChange}
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
              onTogglePinned={onTogglePinned}
            />
          ) : (
            <LibraryGrid
              items={filteredItems}
              isPageReady={isPageReady}
              onItemClick={onItemClick}
              onTogglePinned={onTogglePinned}
            />
          )
        ) : emptyState.renderAsTableEmptyState ? (
          <LibraryTable
            items={[]}
            isPageReady={isPageReady}
            onItemClick={onItemClick}
            sortValue={tableSortValue}
            onSortChange={onTableSortChange}
            onTogglePinned={onTogglePinned}
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
