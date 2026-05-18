import PageScrollbar from "./PageScrollbar.jsx";
import usePageScrollbar from "./usePageScrollbar.js";

function PageShell({ children, scrollable = true }) {
  const {
    scrollRef,
    scrollMetrics,
    isScrollbarVisible,
    handleScroll,
    handlePointerEnter,
    handlePointerLeave,
    handleScrollbarPointerDown,
  } = usePageScrollbar();

  return (
    <div className="surface-panel page-shell">
      <div className="page-shell-body">
        {scrollable ? (
          <>
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              onPointerEnter={handlePointerEnter}
              onPointerLeave={handlePointerLeave}
              className="page-shell-scroll-area scrollbar-hide"
            >
              <div className="page-shell-scroll-content">{children}</div>
            </div>

            <PageScrollbar
              isVisible={isScrollbarVisible}
              scrollMetrics={scrollMetrics}
              onPointerDown={handleScrollbarPointerDown}
            />
          </>
        ) : (
          <div className="page-shell-static-content">{children}</div>
        )}
      </div>
    </div>
  );
}

export default PageShell;
