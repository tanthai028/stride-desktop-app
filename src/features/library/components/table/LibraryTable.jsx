import PageScrollbar from "../../../../components/page/PageScrollbar.jsx";
import EmptyState from "../../../../components/page/EmptyState.jsx";
import usePageScrollbar from "../../../../components/page/usePageScrollbar.js";
import LibraryTableHeader from "./LibraryTableHeader.jsx";
import LibraryTableRow from "./LibraryTableRow.jsx";

function LibraryTable({
  items,
  isPageReady,
  onItemClick,
  sortValue,
  onSortChange,
  onTogglePinned,
  emptyStateTitle = "",
  emptyStateDescription = "",
  emptyStateAction = null,
}) {
  const {
    scrollRef,
    scrollMetrics,
    isScrollbarVisible,
    handleScroll,
    handlePointerEnter,
    handlePointerLeave,
    handleScrollbarPointerDown,
  } = usePageScrollbar();

  const hasItems = items.length > 0;

  return (
    <div className="library-table-shell">
      {hasItems ? (
        <>
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            className="library-table-scroll scrollbar-hide"
          >
            <table className="library-table">
              <LibraryTableHeader
                sortValue={sortValue}
                onSortChange={onSortChange}
              />

              <tbody>
                {items.map((item) => (
                  <LibraryTableRow
                    key={item.id}
                    item={item}
                    isPageReady={isPageReady}
                    onItemClick={onItemClick}
                    onTogglePinned={onTogglePinned}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <PageScrollbar
            isVisible={isScrollbarVisible}
            scrollMetrics={scrollMetrics}
            insetRight="0"
            onPointerDown={handleScrollbarPointerDown}
          />
        </>
      ) : (
        <div className="library-table-empty-state">
          <EmptyState
            title={emptyStateTitle}
            description={emptyStateDescription}
            action={emptyStateAction}
          />
        </div>
      )}
    </div>
  );
}

export default LibraryTable;
