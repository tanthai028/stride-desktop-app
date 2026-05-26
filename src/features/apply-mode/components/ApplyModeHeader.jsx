import { Clock3, Expand, Minus, MousePointer2, Settings } from "lucide-react";

import {
  minimizeWindow,
  setApplyModeClickThrough,
} from "../../../lib/windowControls.js";

function formatElapsedTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function ApplyModeHeader({
  isApplying,
  isClickThrough,
  setIsClickThrough,
  elapsedSeconds,
  isTimerRunning,
  onToggleTimer,
  onToggleSettings,
  onExitRequest,
}) {
  function handleMinimize() {
    setIsClickThrough(false);
    setApplyModeClickThrough(false);
    minimizeWindow();
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

        <div className="apply-mode-state no-drag">
          <span
            className={`apply-mode-dot ${
              isApplying ? "is-applying" : "is-idle"
            }`}
          />
          <span>{isApplying ? "Applying" : "Idle"}</span>
        </div>

        <button
          type="button"
          className={`apply-mode-timer no-drag ${
            !isTimerRunning ? "is-paused" : ""
          }`}
          onClick={onToggleTimer}
        >
          <Clock3 size="0.72rem" />
          <span>{formatElapsedTime(elapsedSeconds)}</span>
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
            onClick={handleClickThroughToggle}
          >
            <MousePointer2 size="0.75rem" />
          </button>

          <button type="button" onClick={handleMinimize}>
            <Minus size="0.75rem" />
          </button>

          <button type="button" onClick={onExitRequest}>
            <Expand size="0.75rem" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default ApplyModeHeader;
