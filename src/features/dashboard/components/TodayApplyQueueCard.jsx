import { Rocket } from "lucide-react";
import { useMemo } from "react";
import DashboardTitle from "./DashboardTitle.jsx";
import {
  getCompanyIconUrl,
  handleCompanyIconFallback,
} from "../utils/companyIcon.utils.js";
import { openDashboardLink } from "../utils/dashboardPreview.utils.js";
import useApplyQueue from "../hooks/useApplyQueue.js";
import useApplyGoal from "../hooks/useApplyGoal.js";
import { openApplyModeWindow } from "../../../lib/windowControls.js";

const QUEUE_DISPLAY_LIMIT = 6;

function TodayApplyQueueCard({ items = [], todayApplicationCount = 0, onNavigate }) {
  const {
    applyGoalTarget,
    applyGoalDraft,
    isEditingApplyGoal,
    applyGoalInputRef,
    setApplyGoalDraft,
    startEditingApplyGoal,
    confirmApplyGoalEdit,
    cancelApplyGoalEdit,
  } = useApplyGoal(todayApplicationCount);

  const { visibleQueue, totalUnapplied } = useApplyQueue({
    items,
    queueSize: QUEUE_DISPLAY_LIMIT,
  });

  const completed = Math.min(todayApplicationCount, applyGoalTarget);
  const remaining = Math.max(0, applyGoalTarget - todayApplicationCount);
  const isGoalDone = todayApplicationCount >= applyGoalTarget;
  const hasQueue = visibleQueue.length > 0;

  const ctaLabel = useMemo(() => {
    if (!hasQueue) return "All Caught Up";
    return todayApplicationCount > 0 ? "Continue Applying" : "Start Applying";
  }, [hasQueue, todayApplicationCount]);

  function handleStartApplying() {
    if (!hasQueue) return;
    openApplyModeWindow();
  }

  function handleOpenJob(item) {
    if (!item?.jobUrl) return;
    openDashboardLink(item.jobUrl);
  }

  function handleCardClick(e) {
    if (!onNavigate) return;
    if (e.target.closest("button, input")) return;
    onNavigate("discover");
  }

  return (
    <div
      className="surface-card dashboard-card dashboard-apply-queue-card dashboard-clickable-card"
      onClick={handleCardClick}
      style={onNavigate ? { cursor: "pointer" } : undefined}
    >
      <div className="dashboard-apply-queue-header">
        <div className="dashboard-apply-queue-heading">
          <p className="stat-card-description dashboard-card-title dashboard-apply-queue-title text-sm font-medium">
            <DashboardTitle icon={Rocket}>Today's Apply Queue</DashboardTitle>
          </p>

          <p className="dashboard-apply-queue-goal-line">
            <span className="dashboard-apply-queue-goal-label">Daily Goal:</span>{" "}
            {isEditingApplyGoal ? (
              <input
                ref={applyGoalInputRef}
                type="number"
                min="1"
                value={applyGoalDraft}
                onChange={(event) => setApplyGoalDraft(event.target.value)}
                onBlur={confirmApplyGoalEdit}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    confirmApplyGoalEdit();
                  }
                  if (event.key === "Escape") {
                    event.preventDefault();
                    cancelApplyGoalEdit();
                  }
                }}
                className="dashboard-apply-queue-goal-input"
                aria-label="Daily goal target"
              />
            ) : (
              <button
                type="button"
                className="dashboard-apply-queue-goal-value"
                onClick={startEditingApplyGoal}
                aria-label="Edit daily goal"
                title="Edit daily goal"
              >
                {applyGoalTarget}
              </button>
            )}
          </p>

          <p className="dashboard-apply-queue-goal-progress-line">
            <span className="dashboard-apply-queue-goal-progress">
              {completed}/{applyGoalTarget}
            </span>{" "}
            completed
            {isGoalDone ? (
              <span className="dashboard-apply-queue-goal-celebrate"> 🎉</span>
            ) : (
              <>
                {" "}
                •{" "}
                <span className="dashboard-apply-queue-goal-remaining">
                  {remaining} remaining
                </span>
              </>
            )}
          </p>
        </div>

        <button
          type="button"
          className="dashboard-apply-queue-cta"
          onClick={handleStartApplying}
          disabled={!hasQueue}
          aria-label={ctaLabel}
        >
          <Rocket />
          <span>{ctaLabel}</span>
        </button>
      </div>

      <div className="dashboard-apply-queue-list">
        {hasQueue ? (
          visibleQueue.map((item) => (
            <button
              key={item.id}
              type="button"
              className="dashboard-apply-queue-item"
              onClick={() => handleOpenJob(item)}
              disabled={!item.jobUrl}
              title={item.jobUrl ? "Open job posting" : "No job URL on this item"}
              aria-label={`Open ${item.company || "job"} posting`}
            >
              <div className="dashboard-apply-queue-item-main">
                <p className="dashboard-apply-queue-item-title">
                  <img
                    className="dashboard-company-icon"
                    src={getCompanyIconUrl(item.company)}
                    onError={(event) =>
                      handleCompanyIconFallback(event, item.jobUrl)
                    }
                    alt=""
                    loading="lazy"
                  />
                  <span className="dashboard-apply-queue-item-title-text">
                    {item.company || "Untitled Company"} —{" "}
                    {item.role || "Untitled Role"}
                  </span>
                </p>
                <p className="dashboard-apply-queue-item-location">
                  {item.location || "Location unknown"}
                </p>
              </div>
            </button>
          ))
        ) : (
          <p className="dashboard-apply-queue-empty stat-card-description text-sm">
            {totalUnapplied === 0
              ? "No unapplied jobs in your library yet. Add a few to fill the queue."
              : "You're caught up for now. Add more roles to keep applying."}
          </p>
        )}
      </div>
    </div>
  );
}

export default TodayApplyQueueCard;
