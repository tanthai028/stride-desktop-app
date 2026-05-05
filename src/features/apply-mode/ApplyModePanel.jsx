import { Check, Maximize2, Minus, Settings, X } from "lucide-react";
import { useMemo, useState } from "react";
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

function ApplyModePanel({ items = [], updateItem, onExitApplyMode }) {
  const [isApplying, setIsApplying] = useState(false);
  const [skippedIds, setSkippedIds] = useState([]);
  const [completedItems, setCompletedItems] = useState([]);

  const queueItems = useMemo(() => {
    return items.filter(
      (item) => isUnapplied(item) && !skippedIds.includes(item.id),
    );
  }, [items, skippedIds]);

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
            onMouseEnter={() => currentItem && setIsApplying(true)}
            onMouseLeave={() => setIsApplying(false)}
            onClick={handleApply}
          >
            <span
              className={`apply-mode-dot ${
                isApplying ? "is-applying" : "is-idle"
              }`}
            />
            {isApplying ? "Applying" : "Idle"}
          </button>

          <div className="apply-mode-window-actions no-drag">
            <button type="button" aria-label="Settings">
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

        <div className="apply-mode-body">
          {currentItem ? (
            <button
              type="button"
              className="apply-mode-current-card"
              onClick={handleApply}
            >
              <span className="apply-mode-current-main">
                <strong>{currentItem.company || "Unknown Company"}</strong>
                <span>{currentItem.role || "Unknown Role"}</span>
              </span>

              <span className="apply-mode-current-hover">Apply</span>
            </button>
          ) : (
            <div className="apply-mode-empty">No unapplied jobs queued.</div>
          )}

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

          <div className="apply-mode-completed">
            <p>Just applied</p>

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
          </div>
        </div>
      </div>
    </section>
  );
}

export default ApplyModePanel;
