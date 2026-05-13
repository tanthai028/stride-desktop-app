import {
  Check,
  ExternalLink,
  Maximize2,
  Minus,
  MousePointer2,
  Settings,
  SkipForward,
  Trash2,
  Expand,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  exitApplyModeWindow,
  minimizeWindow,
  setApplyModeClickThrough,
  setApplyModeHitboxes,
  setApplyModeOpacity,
} from "../../lib/windowControls.js";
import { AnimatePresence, motion } from "framer-motion";
import PageScrollbar from "../../components/page/PageScrollbar.jsx";
import usePageScrollbar from "../../components/page/usePageScrollbar.js";

function isUnapplied(item) {
  return (
    String(item?.status ?? "")
      .trim()
      .toLowerCase() === "unapplied"
  );
}

function ApplyModePanel({
  items = [],
  updateItem,
  deleteItem,
  settings,
  updateSetting,
}) {
  const [isApplying, setIsApplying] = useState(false);
  const [skippedIds, setSkippedIds] = useState([]);
  const [completedItems, setCompletedItems] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const applyModeScale = settings?.applyModeScale ?? 100;
  const applyModeOpacity = settings?.applyModeOpacity ?? 100;
  const [isClickThrough, setIsClickThrough] = useState(false);
  const [recentPage, setRecentPage] = useState(0);
  const [showAppliedRecent, setShowAppliedRecent] = useState(true);
  const [showSkippedRecent, setShowSkippedRecent] = useState(true);
  const [isMovingCard, setIsMovingCard] = useState(false);
  const [removedIds, setRemovedIds] = useState([]);
  const [isRecentExpanded, setIsRecentExpanded] = useState(false);
  const [canShowFilteredEmpty, setCanShowFilteredEmpty] = useState(false);
  const {
    scrollRef: recentScrollRef,
    scrollMetrics: recentScrollMetrics,
    isScrollbarVisible: isRecentScrollbarVisible,
    handleScroll: handleRecentScroll,
    handlePointerEnter: handleRecentPointerEnter,
    handlePointerLeave: handleRecentPointerLeave,
  } = usePageScrollbar();

  useEffect(() => {
    setApplyModeOpacity(applyModeOpacity);
  }, [applyModeOpacity]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${16 * (applyModeScale / 50)}px`;
    window.windowControls?.setApplyModeScale?.(applyModeScale);

    return () => {
      document.documentElement.style.fontSize = "";
    };
  }, [applyModeScale]);

  useEffect(() => {
    setApplyModeHitboxes({
      headerHeight: 42,
      settingsOpen: showSettings,
    });

    if (!isClickThrough) {
      setApplyModeClickThrough(false);
      return;
    }

    setApplyModeClickThrough(true);

    return () => {
      setApplyModeClickThrough(false);
    };
  }, [isClickThrough, showSettings]);

  function resetApplySession() {
    setIsApplying(false);
    setSkippedIds([]);
    setCompletedItems([]);
    setRecentPage(0);
    setIsRecentExpanded(false);
    setShowAppliedRecent(true);
    setShowSkippedRecent(true);
    setIsMovingCard(false);
  }

  function handleScaleChange(event) {
    const nextScale = Number(event.target.value);

    updateSetting?.("applyModeScale", nextScale);
    window.windowControls?.setApplyModeScale?.(nextScale);
  }

  function handleOpacityChange(event) {
    const nextOpacity = Number(event.target.value);

    updateSetting?.("applyModeOpacity", nextOpacity);
    setApplyModeOpacity(nextOpacity);
  }

  function handleClickThroughToggle() {
    const nextValue = !isClickThrough;

    setIsClickThrough(nextValue);
    setApplyModeClickThrough(nextValue);
  }

  const queueItems = useMemo(
    () =>
      items.filter(
        (item) =>
          isUnapplied(item) &&
          !skippedIds.includes(item.id) &&
          !removedIds.includes(item.id),
      ),
    [items, skippedIds, removedIds],
  );

  useEffect(() => {
    setRecentPage(0);
  }, [showAppliedRecent, showSkippedRecent]);

  const currentItem = queueItems[0] ?? null;
  const totalQueueCount = queueItems.length + completedItems.length;
  const appliedCount = completedItems.filter(
    (item) => item.status === "Applied",
  ).length;
  const skippedCount = completedItems.filter(
    (item) => item.status === "Skipped",
  ).length;
  const completedCount = completedItems.length;

  const progressText =
    totalQueueCount > 0 ? `${completedCount}/${totalQueueCount}` : "None";
  const filteredCompletedItems = completedItems.filter((item) => {
    if (item.status === "Applied") return showAppliedRecent;
    if (item.status === "Skipped") return showSkippedRecent;
    return true;
  });

  const visibleRecentItems = isRecentExpanded
    ? filteredCompletedItems
    : filteredCompletedItems.slice(0, 1);

  const shouldShowFilteredEmpty =
    completedItems.length > 0 && visibleRecentItems.length === 0;

  useEffect(() => {
    if (!shouldShowFilteredEmpty) {
      setCanShowFilteredEmpty(false);
    }
  }, [shouldShowFilteredEmpty]);

  function openJobUrl(item) {
    if (!item?.jobUrl) return;
    window.libraryApi?.openExternalUrl?.(item.jobUrl);
  }

  async function handleApply() {
    if (!currentItem?.jobUrl) return;
    setIsApplying(true);
    await window.libraryApi?.openExternalUrl?.(currentItem.jobUrl);
  }

  async function handleDone() {
    if (!currentItem || isMovingCard) return;

    setIsMovingCard(true);

    const appliedAt = new Date().toISOString();
    const completedItem = {
      ...currentItem,
      status: "Applied",
      appliedAt,
    };

    await updateItem(currentItem.id, completedItem);

    setIsApplying(false);

    window.setTimeout(() => {
      setCompletedItems((current) => [completedItem, ...current]);
      setRecentPage(0);
      setIsMovingCard(false);
    }, 140);
  }

  function handleSkip() {
    if (!currentItem || isMovingCard) return;

    setIsMovingCard(true);

    const completedItem = {
      ...currentItem,
      status: "Skipped",
      appliedAt: new Date().toISOString(),
    };

    setSkippedIds((current) => [...current, currentItem.id]);
    setIsApplying(false);

    window.setTimeout(() => {
      setCompletedItems((current) => [completedItem, ...current]);
      setRecentPage(0);
      setIsMovingCard(false);
    }, 140);
  }

  async function handleRemove() {
    if (!currentItem || isMovingCard) return;

    setIsMovingCard(true);
    setIsApplying(false);

    const removedId = currentItem.id;

    setRemovedIds((current) => [...current, removedId]);

    try {
      await deleteItem?.(removedId);
    } catch (error) {
      setRemovedIds((current) => current.filter((id) => id !== removedId));
      console.error("Failed to remove job from apply mode:", error);
    } finally {
      window.setTimeout(() => {
        setRecentPage(0);
        setIsMovingCard(false);
      }, 140);
    }
  }

  return (
    <section className="apply-mode-screen">
      <div className="apply-mode-panel no-drag">
        <header
          className="apply-mode-header drag-region"
          data-apply-mode-hitbox="true"
        >
          <div className="apply-mode-header-left">
            <div className="apply-mode-app-icon no-drag">
              <img
                src="/stride_icon.png"
                alt=""
                className="apply-mode-app-icon-image"
              />
            </div>

            <button
              type="button"
              className="apply-mode-state no-drag"
              onClick={handleApply}
              disabled={!currentItem}
            >
              <span
                className={`apply-mode-dot ${isApplying ? "is-applying" : "is-idle"}`}
              />
              <span>{isApplying ? "Applying" : "Idle"}</span>
            </button>
          </div>

          <div className="apply-mode-header-right no-drag">
            <div className="apply-mode-window-actions">
              <button
                type="button"
                aria-label="Settings"
                title="Settings"
                onClick={() => setShowSettings((current) => !current)}
              >
                <Settings size="0.75rem" />
              </button>
              <button
                type="button"
                className={isClickThrough ? "is-active" : ""}
                aria-label="Toggle click through"
                title={
                  isClickThrough
                    ? "Disable click-through"
                    : "Enable click-through"
                }
                onClick={handleClickThroughToggle}
              >
                <MousePointer2 size="0.75rem" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsClickThrough(false);
                  setApplyModeClickThrough(false);
                  minimizeWindow();
                }}
                aria-label="Minimize"
                title="Minimize"
              >
                <Minus size="0.75rem" />
              </button>

              <button
                type="button"
                onClick={() => {
                  const isFinished =
                    totalQueueCount > 0 && queueItems.length === 0;

                  setIsClickThrough(false);
                  setApplyModeClickThrough(false);

                  if (isFinished || skippedIds.length > 0) {
                    resetApplySession();
                  }

                  exitApplyModeWindow();
                }}
                aria-label="Back to full app"
                title="Back to full app"
              >
                <Expand size="0.75rem" />
              </button>
            </div>
          </div>
        </header>

        {showSettings && (
          <div
            className="apply-mode-settings-backdrop no-drag"
            data-apply-mode-hitbox="true"
          >
            <section className="apply-mode-settings-modal">
              <header className="apply-mode-settings-header">
                <h2>Apply Mode Settings</h2>

                <button
                  type="button"
                  aria-label="Close settings"
                  onClick={() => setShowSettings(false)}
                >
                  <X size="1rem" />
                </button>
              </header>

              <div className="apply-mode-settings-content">
                <div className="apply-mode-settings-row">
                  <span>Scale</span>
                  <strong>{applyModeScale}%</strong>
                </div>

                <input
                  type="range"
                  min="50"
                  max="100"
                  step="5"
                  value={applyModeScale}
                  onChange={handleScaleChange}
                />

                <p className="apply-mode-settings-help">
                  Window size and font size
                </p>

                <div className="apply-mode-settings-row">
                  <span>Opacity</span>
                  <strong>{applyModeOpacity}%</strong>
                </div>

                <input
                  type="range"
                  min="35"
                  max="100"
                  step="5"
                  value={applyModeOpacity}
                  onChange={handleOpacityChange}
                />

                <p className="apply-mode-settings-help">Window transparency</p>
              </div>
            </section>
          </div>
        )}

        <main
          className={`apply-mode-body ${
            isRecentExpanded ? "is-recent-expanded" : ""
          }`}
        >
          {!isRecentExpanded && (
            <section className="apply-mode-current-section">
              <div className="apply-mode-section-header">
                <div className="apply-mode-section-title">
                  <span>Current job</span>
                  <div className="apply-mode-progress-pill">{progressText}</div>

                  {skippedCount > 0 && (
                    <div className="apply-mode-skipped-pill">
                      <SkipForward size="0.75rem" />
                      {skippedCount}
                    </div>
                  )}
                </div>

                <div className="apply-mode-inline-actions">
                  <button
                    type="button"
                    onClick={handleDone}
                    disabled={!currentItem || isMovingCard}
                  >
                    <Check size="0.75rem" />
                    Done
                  </button>

                  <button
                    type="button"
                    onClick={handleSkip}
                    disabled={!currentItem || isMovingCard}
                    aria-label="Skip"
                  >
                    <SkipForward size="0.75rem" />
                    Skip
                  </button>

                  <button
                    type="button"
                    className="apply-mode-danger-action"
                    onClick={handleRemove}
                    disabled={!currentItem || isMovingCard}
                    aria-label="Remove job"
                    title="Remove job"
                  >
                    <Trash2 size="0.75rem" />
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {currentItem ? (
                  <motion.button
                    key={currentItem.id}
                    type="button"
                    className="apply-mode-current-card"
                    onClick={handleApply}
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: 18 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <span className="apply-mode-current-main">
                      <strong>
                        {currentItem.company || "Unknown Company"}
                      </strong>
                      <span>{currentItem.role || "Unknown Role"}</span>
                      <em>{currentItem.location || "\u00A0"}</em>
                    </span>

                    <span className="apply-mode-current-action">Apply</span>
                  </motion.button>
                ) : (
                  <div className="apply-mode-empty">
                    <strong>No unapplied jobs queued.</strong>
                    <span>Dump job URLs in Library first.</span>
                    <em>{"\u00A0"}</em>
                  </div>
                )}
              </AnimatePresence>
            </section>
          )}

          <section className="apply-mode-completed">
            <div className="apply-mode-section-header">
              <div className="apply-mode-section-title">
                <span>Just applied</span>

                {isRecentExpanded && (
                  <div className="apply-mode-progress-pill">
                    {filteredCompletedItems.length}
                  </div>
                )}
              </div>

              <div className="apply-mode-inline-actions">
                {isRecentExpanded && (
                  <>
                    <button
                      type="button"
                      className={`apply-mode-filter-toggle ${
                        showAppliedRecent ? "is-active" : ""
                      }`}
                      onClick={() =>
                        setShowAppliedRecent((current) => !current)
                      }
                    >
                      <span>Applied</span>
                      <i />
                    </button>

                    <button
                      type="button"
                      className={`apply-mode-filter-toggle ${
                        showSkippedRecent ? "is-active" : ""
                      }`}
                      onClick={() =>
                        setShowSkippedRecent((current) => !current)
                      }
                    >
                      <span>Skipped</span>
                      <i />
                    </button>
                  </>
                )}

                <button
                  type="button"
                  aria-label={
                    isRecentExpanded
                      ? "Collapse recent jobs"
                      : "Expand recent jobs"
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
                ref={recentScrollRef}
                onScroll={handleRecentScroll}
                onPointerEnter={handleRecentPointerEnter}
                onPointerLeave={handleRecentPointerLeave}
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
                      <span>Applied or skipped jobs show here.</span>
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
                          <strong>
                            {recentItem.company || "Unknown Company"}
                          </strong>
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
                  isVisible={isRecentScrollbarVisible}
                  scrollMetrics={recentScrollMetrics}
                />
              </div>
            </div>
          </section>
        </main>
      </div>
    </section>
  );
}

export default ApplyModePanel;
