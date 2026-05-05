import {
  BriefcaseBusiness,
  Check,
  ExternalLink,
  Maximize2,
  Minus,
  Settings,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  exitApplyModeWindow,
  minimizeWindow,
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
  const [recentPage, setRecentPage] = useState(0);
  const [isMovingCard, setIsMovingCard] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = `${16 * (applyModeScale / 50)}px`;
    window.windowControls?.setApplyModeScale?.(applyModeScale);

    return () => {
      document.documentElement.style.fontSize = "";
    };
  }, [applyModeScale]);

  function handleScaleChange(event) {
    const nextScale = Number(event.target.value);

    updateSetting?.("applyModeScale", nextScale);
    window.windowControls?.setApplyModeScale?.(nextScale);
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
        <header className="apply-mode-header drag-region">
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

            <div className="apply-mode-progress-pill">{progressText}</div>
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
                onClick={minimizeWindow}
                aria-label="Minimize"
              >
                <Minus size={14} />
              </button>

              <button
                type="button"
                onClick={exitApplyModeWindow}
                aria-label="Back to full app"
              >
                <Maximize2 size={14} />
              </button>
            </div>
          </div>
        </header>

        {showSettings && (
          <div className="apply-mode-settings-backdrop no-drag">
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
                  Changes both the Apply Mode window size and font size.
                </p>
              </div>
            </section>
          </div>
        )}

        <main className="apply-mode-body">
          <section className="apply-mode-current-section">
            <div className="apply-mode-section-header">
              <div className="apply-mode-section-title">
                <span>Current job</span>
                {currentItem?.jobUrl && <ExternalLink size={13} />}
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
                  initial={{ opacity: 0, scale: 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.14, ease: "easeOut" }}
                  type="button"
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
                    className="apply-mode-completed-item"
                    exit={{ opacity: 0, scale: 0.985 }}
                    initial={{ opacity: 0, y: -6, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
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
