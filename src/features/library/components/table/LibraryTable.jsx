import PageScrollbar from "../../../../components/page/PageScrollbar.jsx";
import usePageScrollbar from "../../../../components/page/usePageScrollbar.js";
import LibraryTableHeader from "./LibraryTableHeader.jsx";
import LibraryTableRow from "./LibraryTableRow.jsx";

function LibraryTable({
  items,
  isPageReady,
  onItemClick,
  sortValue,
  onSortChange,
}) {
  const {
    scrollRef,
    scrollMetrics,
    isScrollbarVisible,
    handleScroll,
    handlePointerEnter,
    handlePointerLeave,
  } = usePageScrollbar();

  return (
    <div className="library-table-shell">
      <div className="library-width-debug">
        {Math.round(scrollRef.current?.offsetWidth || 0)}px
      </div>

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
              />
            ))}
          </tbody>
        </table>
      </div>

      <PageScrollbar
        isVisible={isScrollbarVisible}
        scrollMetrics={scrollMetrics}
      />
    </div>
  );
}

export default LibraryTable;
