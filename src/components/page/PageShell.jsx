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
    <div className="surface-panel flex min-h-0 flex-1 flex-col overflow-hidden p-6">
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

      <div className="relative mt-6 min-h-0 flex-1">
        {scrollable ? (
          <>
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              onPointerEnter={handlePointerEnter}
              onPointerLeave={handlePointerLeave}
              className="h-full min-h-0 overflow-y-auto scrollbar-hide"
            >
              <div className="flex min-h-full flex-col">{children}</div>
            </div>

            <PageScrollbar
              isVisible={isScrollbarVisible}
              scrollMetrics={scrollMetrics}
            />
          </>
        ) : (
          <div className="flex h-full min-h-0 flex-col overflow-visible">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

export default PageShell;
