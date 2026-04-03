import PageScrollbar from "./PageScrollbar.jsx";
import usePageScrollbar from "./usePageScrollbar.js";

function PageShell({ eyebrow, title, description, actions, children }) {
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
      <div className="surface-section-divider flex shrink-0 flex-col gap-4 pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          {eyebrow ? (
            <p className="text-sm font-medium text-violet-500">{eyebrow}</p>
          ) : null}

          <h2 className="text-2xl font-semibold text-slate-800">{title}</h2>

          {description ? (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          ) : null}
        </div>

        {actions ? <div className="flex gap-3">{actions}</div> : null}
      </div>

      <div className="relative mt-6 min-h-0 flex-1">
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
      </div>
    </div>
  );
}

export default PageShell;
