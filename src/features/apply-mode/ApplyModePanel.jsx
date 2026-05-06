import {
  BriefcaseBusiness,
  Check,
  ExternalLink,
  Maximize2,
  Minus,
  MousePointer2,
  Settings,
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

function isUnapplied(item) {
  return (
    String(item?.status ?? "")
      .trim()
      .toLowerCase() === "unapplied"
  );
}

function ApplyModePanel({ items = [], updateItem, settings, updateSetting }) {
  const [isApplying, setIsApplying] = useState(false);
  const [skippedIds, setSkippedIds] = useState([]);
  const [completedItems, setCompletedItems] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const applyModeScale = settings?.applyModeScale ?? 100;
  const applyModeOpacity = settings?.applyModeOpacity ?? 100;
  const [isClickThrough, setIsClickThrough] = useState(false);
  const [recentPage, setRecentPage] = useState(0);
  const [isMovingCard, setIsMovingCard] = useState(false);

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
        (item) => isUnapplied(item) && !skippedIds.includes(item.id),
      ),
    [items, skippedIds],
  );

  const currentItem = queueItems[0] ?? null;
  const totalQueueCount = queueItems.length + completedItems.length;
  const appliedCount = completedItems.filter(
    (item) => item.status === "Applied",
  ).length;
  const skippedCount = completedItems.filter(
    (item) => item.status === "Skipped",
  ).length;
  const progressText = `${appliedCount}/${totalQueueCount}`;
  const visibleRecentItem = completedItems[recentPage] ?? null;
  const canGoPreviousRecent = recentPage > 0;
  const canGoNextRecent = recentPage < completedItems.length - 1;

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

  return (
    <section className="apply-mode-screen">
      <div className="apply-mode-panel no-drag">
        <header
          className="apply-mode-header drag-region"
          data-apply-mode-hitbox="true"
        >
          <div className="apply-mode-header-left">
            <div className="apply-mode-app-icon no-drag">
              <BriefcaseBusiness size={15} />
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

            {skippedCount > 0 && (
              <div className="apply-mode-skipped-pill">
                Skipped {skippedCount}
              </div>
            )}
          </div>

          <div className="apply-mode-header-right no-drag">
            <div className="apply-mode-window-actions">
              <button
                type="button"
                aria-label="Settings"
                onClick={() => setShowSettings((current) => !current)}
              >
                <Settings size={14} />
              </button>
              <button
                type="button"
                className={isClickThrough ? "is-active" : ""}
                aria-label="Toggle click through"
                title={
                  isClickThrough
                    ? "Click-through is on. Minimize to reset it."
                    : "Click through"
                }
                onClick={handleClickThroughToggle}
              >
                <MousePointer2 size={14} />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsClickThrough(false);
                  setApplyModeClickThrough(false);
                  minimizeWindow();
                }}
                aria-label="Minimize"
              >
                <Minus size={14} />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsClickThrough(false);
                  setApplyModeClickThrough(false);
                  exitApplyModeWindow();
                }}
                aria-label="Back to full app"
              >
                <Maximize2 size={14} />
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
                  <X size={16} />
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

        <main className="apply-mode-body">
          <section className="apply-mode-current-section">
            <div className="apply-mode-section-header">
              <div className="apply-mode-section-title">
                <span>Current job</span>
                <div className="apply-mode-progress-pill">{progressText}</div>
              </div>

              <div className="apply-mode-inline-actions">
                <button
                  type="button"
                  onClick={handleDone}
                  disabled={!currentItem || isMovingCard}
                >
                  <Check size={14} />
                  Done
                </button>

                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={!currentItem || isMovingCard}
                >
                  <X size={14} />
                  Skip
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: 14 }}
                  transition={{ duration: 0.14, ease: "easeOut" }}
                >
                  <span className="apply-mode-current-main">
                    <strong>{currentItem.company || "Unknown Company"}</strong>
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

          <section className="apply-mode-completed">
            <div className="apply-mode-section-header">
              <div className="apply-mode-section-title">
                <span>Just applied</span>
              </div>

              <div className="apply-mode-inline-actions">
                <button
                  type="button"
                  aria-label="Previous applied job"
                  disabled={!canGoPreviousRecent}
                  onClick={() =>
                    setRecentPage((current) => Math.max(0, current - 1))
                  }
                >
                  {"<"}
                </button>

                <button
                  type="button"
                  aria-label="Next applied job"
                  disabled={!canGoNextRecent}
                  onClick={() =>
                    setRecentPage((current) =>
                      Math.min(completedItems.length - 1, current + 1),
                    )
                  }
                >
                  {">"}
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {completedItems.length === 0 ? (
                <div className="apply-mode-recent-empty">
                  <strong>Nothing yet</strong>
                  <span>Applied or skipped jobs show here.</span>
                  <em>{"\u00A0"}</em>
                </div>
              ) : (
                visibleRecentItem && (
                  <motion.button
                    type="button"
                    key={`${visibleRecentItem.id}-${visibleRecentItem.appliedAt}-${recentPage}`}
                    className={`apply-mode-completed-item ${
                      visibleRecentItem.status === "Applied"
                        ? "apply-mode-completed-item--applied"
                        : "apply-mode-completed-item--skipped"
                    }`}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    onClick={() => openJobUrl(visibleRecentItem)}
                  >
                    <span className="apply-mode-completed-main">
                      <strong>
                        {visibleRecentItem.company || "Unknown Company"}
                      </strong>
                      <span>{visibleRecentItem.role || "Unknown Role"}</span>
                      <em>{visibleRecentItem.location || "\u00A0"}</em>
                    </span>

                    <span
                      className={`apply-mode-status-pill ${
                        visibleRecentItem.status === "Skipped"
                          ? "apply-mode-status-pill--skipped"
                          : "apply-mode-status-pill--applied"
                      }`}
                    >
                      {visibleRecentItem.status}
                      <ExternalLink size={12} />
                    </span>
                  </motion.button>
                )
              )}
            </AnimatePresence>
          </section>
        </main>
      </div>
    </section>
  );
}

export default ApplyModePanel;
