import ItemGrid from "../../../components/page/ItemGrid.jsx";
import PageScrollbar from "../../../components/page/PageScrollbar.jsx";
import usePageScrollbar from "../../../components/page/usePageScrollbar.js";
import LibraryCard from "./LibraryCard.jsx";

function LibraryGrid({ items, isPageReady, onItemClick, onTogglePinned }) {
  const {
    scrollRef,
    scrollMetrics,
    isScrollbarVisible,
    handleScroll,
    handlePointerEnter,
    handlePointerLeave,
  } = usePageScrollbar();

  return (
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
            items={items}
            onItemClick={isPageReady ? onItemClick : undefined}
            onItemMiddleClick={onTogglePinned}
            renderItem={(item) => <LibraryCard item={item} />}
          />
        </div>
      </div>

      <PageScrollbar
        isVisible={isScrollbarVisible}
        scrollMetrics={scrollMetrics}
      />
    </>
  );
}

export default LibraryGrid;
