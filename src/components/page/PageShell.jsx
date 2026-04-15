import PageScrollbar from "./PageScrollbar.jsx";
import usePageScrollbar from "./usePageScrollbar.js";

function PageShell({
  eyebrow,
  title,
  description,
  actions,
  children,
  scrollable = true,
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
    <div className="surface-panel page-shell">
      <div className="surface-section-divider page-shell-header">
        <div>
          {eyebrow ? (
            <p className="page-eyebrow text-sm font-medium">{eyebrow}</p>
          ) : null}

          <h2 className="page-title text-2xl font-semibold">{title}</h2>

          {description ? (
            <p className="page-description mt-1 text-sm">{description}</p>
          ) : null}
        </div>

        {actions ? (
          <div className="page-shell-header-actions">{actions}</div>
        ) : null}
      </div>

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
