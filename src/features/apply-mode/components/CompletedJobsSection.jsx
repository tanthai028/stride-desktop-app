import { ExternalLink, Maximize2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import PageScrollbar from "../../../components/page/PageScrollbar.jsx";
import usePageScrollbar from "../../../components/page/usePageScrollbar.js";

function CompletedJobsSection({
  completedItems,
  filteredCompletedItems,
  visibleRecentItems,
  isRecentExpanded,
  setIsRecentExpanded,
  showAppliedRecent,
  setShowAppliedRecent,
  showSkippedRecent,
  setShowSkippedRecent,
  shouldShowFilteredEmpty,
  canShowFilteredEmpty,
  setCanShowFilteredEmpty,
  openJobUrl,
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
    <section className="apply-mode-completed">
      <div className="apply-mode-section-header">
        <div className="apply-mode-section-title">
          <span>Just applied</span>

          {isRecentExpanded ? (
            <div className="apply-mode-progress-pill">
              {filteredCompletedItems.length}
            </div>
          ) : null}
        </div>

        <div className="apply-mode-inline-actions">
          {isRecentExpanded ? (
            <>
              <button
                type="button"
                className={`apply-mode-filter-toggle ${
                  showAppliedRecent ? "is-active" : ""
                }`}
                onClick={() => setShowAppliedRecent((current) => !current)}
              >
                <span>Applied</span>
                <i />
              </button>

              <button
                type="button"
                className={`apply-mode-filter-toggle ${
                  showSkippedRecent ? "is-active" : ""
                }`}
                onClick={() => setShowSkippedRecent((current) => !current)}
              >
                <span>Skipped</span>
                <i />
              </button>
            </>
          ) : null}

          <button
            type="button"
            aria-label={
              isRecentExpanded ? "Collapse recent jobs" : "Expand recent jobs"
            }
            title={isRecentExpanded ? "Collapse" : "Expand"}
            disabled={completedItems.length === 0}
            onClick={() => setIsRecentExpanded((current) => !current)}
          >
            <Maximize2 size="0.75rem" />
          </button>
        </div>
      </div>

      <div className="apply-mode-recent-scroll-shell">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          className={`apply-mode-recent-list scrollbar-hide ${
            isRecentExpanded ? "is-expanded" : ""
          }`}
        >
          <AnimatePresence
            initial={false}
            onExitComplete={() => {
              if (shouldShowFilteredEmpty) {
                setCanShowFilteredEmpty(true);
              }
            }}
          >
            {completedItems.length === 0 ? (
              <div className="apply-mode-recent-empty">
                <strong>Nothing yet</strong>
                <span>Applied or skipped jobs show here</span>
                <em>{"\u00A0"}</em>
              </div>
            ) : shouldShowFilteredEmpty ? (
              canShowFilteredEmpty ? (
                <motion.div
                  key="nothing-visible"
                  className="apply-mode-recent-empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0 } }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <strong>Nothing visible</strong>
                  <span>Turn Applied or Skipped back on.</span>
                  <em>{"\u00A0"}</em>
                </motion.div>
              ) : null
            ) : (
              visibleRecentItems.map((recentItem) => (
                <motion.button
                  type="button"
                  key={`${recentItem.id}-${recentItem.appliedAt}`}
                  className={`apply-mode-completed-item ${
                    recentItem.status === "Applied"
                      ? "apply-mode-completed-item--applied"
                      : "apply-mode-completed-item--skipped"
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  onClick={() => openJobUrl(recentItem)}
                >
                  <span className="apply-mode-completed-main">
                    <strong>{recentItem.company || "Unknown Company"}</strong>
                    <span>{recentItem.role || "Unknown Role"}</span>
                    <em>{recentItem.location || "\u00A0"}</em>
                  </span>

                  <span
                    className={`apply-mode-status-pill ${
                      recentItem.status === "Skipped"
                        ? "apply-mode-status-pill--skipped"
                        : "apply-mode-status-pill--applied"
                    }`}
                  >
                    {recentItem.status}
                    <ExternalLink size="0.75rem" />
                  </span>
                </motion.button>
              ))
            )}
          </AnimatePresence>
        </div>

        <div className="apply-mode-page-scrollbar">
          <PageScrollbar
            isVisible={isScrollbarVisible}
            scrollMetrics={scrollMetrics}
          />
        </div>
      </div>
    </section>
  );
}

export default CompletedJobsSection;
