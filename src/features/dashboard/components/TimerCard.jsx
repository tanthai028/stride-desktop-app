import { Clock3, Pause, Play, RotateCcw } from "lucide-react";
import DashboardTitle from "./DashboardTitle.jsx";
import {
  formatTimerDurationLabel,
  formatTimerSeconds,
} from "./dashboardPreview.utils.js";

function TimerCard({
  timerCardRef,
  timerMinutesInputRef,
  timerSecondsInputRef,
  timerSeconds,
  timerTotalSeconds,
  timerProgress,
  timerDraftMinutes,
  timerDraftSeconds,
  isEditingTimer,
  isTimerRunning,
  onStartEditing,
  onCancelEdit,
  onConfirmEdit,
  onMinutesDraftChange,
  onSecondsDraftChange,
  onToggleTimer,
  onResetTimer,
}) {
  return (
    <div
      ref={timerCardRef}
      className="surface-card stat-card dashboard-metric-card dashboard-timer-card dashboard-editable-card dashboard-clickable-card"
      role="button"
      tabIndex={0}
      onClick={onStartEditing}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onStartEditing();
        }
      }}
    >
      <div className="dashboard-metric-content">
        <div className="dashboard-timer-header">
          <p className="stat-card-label stat-card-label--violet">
            <DashboardTitle icon={Clock3}>Timer</DashboardTitle>
          </p>
        </div>

        <div className="dashboard-timer-value-row">
          {isEditingTimer ? (
            <h2 className="stat-card-title dashboard-metric-value dashboard-timer-edit-value">
              <input
                ref={timerMinutesInputRef}
                value={timerDraftMinutes}
                onChange={(event) =>
                  onMinutesDraftChange(event.target.value.replace(/\D/g, ""))
                }
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => {
                  event.stopPropagation();

                  if (event.key === "Enter") {
                    event.preventDefault();

                    const nextMinutes = event.currentTarget.value.replace(
                      /\D/g,
                      "",
                    );
                    onMinutesDraftChange(nextMinutes);

                    window.requestAnimationFrame(() => {
                      timerSecondsInputRef.current?.focus();
                      timerSecondsInputRef.current?.select();
                    });
                  }

                  if (event.key === "Escape") {
                    onCancelEdit();
                  }
                }}
                className="dashboard-inline-edit dashboard-inline-edit--timer-minutes"
                inputMode="numeric"
              />
              <span>:</span>
              <input
                ref={timerSecondsInputRef}
                value={timerDraftSeconds}
                onChange={(event) =>
                  onSecondsDraftChange(
                    event.target.value.replace(/\D/g, "").slice(0, 2),
                  )
                }
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => {
                  event.stopPropagation();

                  if (event.key === "Enter") {
                    event.preventDefault();

                    const nextSeconds = event.currentTarget.value
                      .replace(/\D/g, "")
                      .slice(0, 2);

                    onConfirmEdit(timerDraftMinutes, nextSeconds);
                  }

                  if (event.key === "Escape") {
                    onCancelEdit();
                  }
                }}
                className="dashboard-inline-edit dashboard-inline-edit--timer-seconds"
                inputMode="numeric"
              />
            </h2>
          ) : (
            <h2 className="stat-card-title dashboard-metric-value dashboard-timer-value">
              {formatTimerSeconds(timerSeconds)}
            </h2>
          )}

          <div className="dashboard-timer-header-actions">
            <button
              type="button"
              className="dashboard-icon-action dashboard-timer-icon-button"
              onClick={(event) => {
                event.stopPropagation();
                onToggleTimer();
              }}
              aria-label={isTimerRunning ? "Pause timer" : "Start timer"}
              title={isTimerRunning ? "Pause" : "Start"}
            >
              {isTimerRunning ? <Pause /> : <Play />}
            </button>

            <button
              type="button"
              className="dashboard-icon-action dashboard-timer-icon-button"
              onClick={(event) => {
                event.stopPropagation();
                onResetTimer();
              }}
              aria-label="Reset timer"
              title="Reset"
            >
              <RotateCcw />
            </button>
          </div>
        </div>

        <p className="stat-card-description dashboard-timer-duration-text">
          Duration: {formatTimerDurationLabel(timerTotalSeconds)}
        </p>

        <div className="dashboard-status-chart-track dashboard-timer-track">
          <div
            className="dashboard-status-chart-fill dashboard-status-chart-fill--violet"
            style={{ width: `${timerProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default TimerCard;
