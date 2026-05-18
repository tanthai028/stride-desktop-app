import { useEffect, useState } from "react";
import { Clock3, Expand, Minus, MousePointer2, Settings } from "lucide-react";

import {
  exitApplyModeWindow,
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
  currentItem,
  isClickThrough,
  setIsClickThrough,
  onApply,
  onToggleSettings,
  queueItems,
  skippedIds,
  resetApplySession,
}) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setElapsedSeconds((current) => (isTimerRunning ? current + 1 : current));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isTimerRunning]);

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

    // reset timer when returning back
    setElapsedSeconds(0);
    setIsTimerRunning(true);

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

        <button
          type="button"
          className={`apply-mode-timer no-drag ${
            !isTimerRunning ? "is-paused" : ""
          }`}
          onClick={() => setIsTimerRunning((current) => !current)}
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

          <button type="button" onClick={handleExit}>
            <Expand size="0.75rem" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default ApplyModeHeader;
