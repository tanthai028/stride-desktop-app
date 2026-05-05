import {
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

  useEffect(() => {
    document.documentElement.style.fontSize = `${16 * (applyModeScale / 100)}px`;
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

  async function handleApply() {
    if (!currentItem?.jobUrl) return;
    setIsApplying(true);
    await window.libraryApi?.openExternalUrl?.(currentItem.jobUrl);
  }

  async function handleDone() {
    if (!currentItem) return;

    const appliedAt = new Date().toISOString();

    await updateItem(currentItem.id, {
      ...currentItem,
      status: "Applied",
      appliedAt,
    });

    setCompletedItems((current) => [
      { ...currentItem, status: "Applied", appliedAt },
      ...current,
    ]);

    setIsApplying(false);
  }

  function handleSkip() {
    if (!currentItem) return;
    setSkippedIds((current) => [...current, currentItem.id]);
    setIsApplying(false);
  }

  return (
    <section className="apply-mode-screen">
      <div className="apply-mode-panel no-drag">
        <header className="apply-mode-header drag-region">
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

          <div className="apply-mode-window-actions no-drag">
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
          <section className="apply-mode-summary">
            <div>
              <span className="apply-mode-label">Queue</span>
              <strong>{queueItems.length}</strong>
            </div>
            <div>
              <span className="apply-mode-label">Applied</span>
              <strong>{completedItems.length}</strong>
            </div>
            <div>
              <span className="apply-mode-label">Skipped</span>
              <strong>{skippedIds.length}</strong>
            </div>
          </section>

          <section className="apply-mode-current-section">
            <div className="apply-mode-section-title">
              <span>Current job</span>
              {currentItem?.jobUrl && <ExternalLink size={13} />}
            </div>

            {currentItem ? (
              <button
                type="button"
                className="apply-mode-current-card"
                onClick={handleApply}
              >
                <span className="apply-mode-current-main">
                  <strong>{currentItem.company || "Unknown Company"}</strong>
                  <span>{currentItem.role || "Unknown Role"}</span>
                  {currentItem.location && <em>{currentItem.location}</em>}
                </span>

                <span className="apply-mode-current-action">Apply</span>
              </button>
            ) : (
              <div className="apply-mode-empty">
                <strong>No unapplied jobs queued.</strong>
                <span>
                  Dump job URLs in Library first, then come back here.
                </span>
              </div>
            )}
          </section>

          <div className="apply-mode-decision-row">
            <button type="button" onClick={handleDone} disabled={!currentItem}>
              <Check size={16} />
              Done
            </button>

            <button type="button" onClick={handleSkip} disabled={!currentItem}>
              <X size={16} />
              Skip
            </button>
          </div>

          <section className="apply-mode-completed">
            <div className="apply-mode-section-title">
              <span>Just applied</span>
            </div>

            {completedItems.length === 0 ? (
              <span className="apply-mode-muted">Nothing yet.</span>
            ) : (
              completedItems.map((item) => (
                <div
                  key={`${item.id}-${item.appliedAt}`}
                  className="apply-mode-completed-item"
                >
                  <strong>{item.company}</strong>
                  <span>{item.role}</span>
                </div>
              ))
            )}
          </section>
        </main>
      </div>
    </section>
  );
}

export default ApplyModePanel;
