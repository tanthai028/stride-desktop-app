import { Target } from "lucide-react";
import DashboardTitle from "./DashboardTitle.jsx";

function ApplyGoalCard({
  applyGoalCardRef,
  applyGoalInputRef,
  todayApplicationCount,
  applyGoalTarget,
  applyGoalProgress,
  applyGoalDraft,
  isEditingApplyGoal,
  onStartEditing,
  onDraftChange,
  onConfirmEdit,
  onCancelEdit,
}) {
  return (
    <div
      ref={applyGoalCardRef}
      className="surface-card stat-card dashboard-metric-card dashboard-apply-goal-card dashboard-editable-card dashboard-clickable-card"
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
        <div className="dashboard-apply-goal-header">
          <p className="stat-card-label stat-card-label--sky">
            <DashboardTitle icon={Target}>Daily Goal</DashboardTitle>
          </p>
        </div>

        {isEditingApplyGoal ? (
          <h2 className="stat-card-title dashboard-metric-value">
            <span>{todayApplicationCount}/</span>
            <input
              ref={applyGoalInputRef}
              type="number"
              min="1"
              value={applyGoalDraft}
              onChange={(event) => onDraftChange(event.target.value)}
              onKeyDown={(event) => {
                event.stopPropagation();

                if (event.key === "Enter") {
                  event.preventDefault();
                  onConfirmEdit();
                }

                if (event.key === "Escape") {
                  event.preventDefault();
                  onCancelEdit();
                }
              }}
              className="dashboard-inline-edit dashboard-inline-edit--goal"
              onClick={(event) => event.stopPropagation()}
            />
          </h2>
        ) : (
          <h2 className="stat-card-title dashboard-metric-value">
            {todayApplicationCount}/{applyGoalTarget}
          </h2>
        )}

        <p className="stat-card-description dashboard-metric-description">
          Apply to {applyGoalTarget} jobs
        </p>

        <div className="dashboard-status-chart-track dashboard-apply-goal-track">
          <div
            className="dashboard-status-chart-fill dashboard-status-chart-fill--sky"
            style={{ width: `${applyGoalProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default ApplyGoalCard;
