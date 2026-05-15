import { Expand, Minus, MousePointer2, Settings } from "lucide-react";
import {
  exitApplyModeWindow,
  minimizeWindow,
  setApplyModeClickThrough,
} from "../../../lib/windowControls.js";

function ApplyModeHeader({
  isApplying,
  currentItem,
  isClickThrough,
  setIsClickThrough,
  onApply,
  onToggleSettings,
  queueItems,
  skippedIds,
  resetApplySession,
}) {
  function handleMinimize() {
    setIsClickThrough(false);
    setApplyModeClickThrough(false);
    minimizeWindow();
  }

  function handleExit() {
    const totalQueueCount = queueItems.length + skippedIds.length;
    const isFinished = totalQueueCount > 0 && queueItems.length === 0;

    setIsClickThrough(false);
    setApplyModeClickThrough(false);

    if (isFinished || skippedIds.length > 0) {
      resetApplySession();
    }

    exitApplyModeWindow();
  }

  function handleClickThroughToggle() {
    const nextValue = !isClickThrough;

    setIsClickThrough(nextValue);
    setApplyModeClickThrough(nextValue);
  }

  return (
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
          onClick={onApply}
          disabled={!currentItem}
        >
          <span
            className={`apply-mode-dot ${
              isApplying ? "is-applying" : "is-idle"
            }`}
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
            onClick={onToggleSettings}
          >
            <Settings size="0.75rem" />
          </button>

          <button
            type="button"
            className={isClickThrough ? "is-active" : ""}
            aria-label="Toggle click through"
            title={
              isClickThrough ? "Disable click-through" : "Enable click-through"
            }
            onClick={handleClickThroughToggle}
          >
            <MousePointer2 size="0.75rem" />
          </button>

          <button
            type="button"
            onClick={handleMinimize}
            aria-label="Minimize"
            title="Minimize"
          >
            <Minus size="0.75rem" />
          </button>

          <button
            type="button"
            onClick={handleExit}
            aria-label="Back to full app"
            title="Back to full app"
          >
            <Expand size="0.75rem" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default ApplyModeHeader;
