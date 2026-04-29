import { useEffect, useState } from "react";
import { formatLibraryAppliedDate } from "../../library/utils/libraryDisplayFormatters.js";
import { getStatusMeta } from "../../library/constants/libraryStatuses.js";

const DAILY_GOALS_STORAGE_KEY = "dashboardDailyGoals";

const DEFAULT_DAILY_GOALS = [
  { id: "apply", label: "Apply to 3 jobs", completed: false },
  { id: "follow-up", label: "Follow up on 1 application", completed: false },
  { id: "resume", label: "Improve resume or profile", completed: false },
];

function getSavedDailyGoals() {
  try {
    const savedGoals = JSON.parse(
      localStorage.getItem(DAILY_GOALS_STORAGE_KEY),
    );

    return Array.isArray(savedGoals) && savedGoals.length > 0
      ? savedGoals
      : DEFAULT_DAILY_GOALS;
  } catch {
    return DEFAULT_DAILY_GOALS;
  }
}

function DashboardPreview({
  variant = "dailyGoal",
  recentItems = [],
  onRecentApplicationsClick,
}) {
  const [dailyGoals, setDailyGoals] = useState(getSavedDailyGoals);
  const [isEditingGoals, setIsEditingGoals] = useState(false);

  useEffect(() => {
    localStorage.setItem(DAILY_GOALS_STORAGE_KEY, JSON.stringify(dailyGoals));
  }, [dailyGoals]);

  const completedGoalCount = dailyGoals.filter((goal) => goal.completed).length;
  const totalGoalCount = dailyGoals.length || 1;
  const goalProgress = Math.round((completedGoalCount / totalGoalCount) * 100);

  const updateGoalLabel = (goalId, nextLabel) => {
    setDailyGoals((goals) =>
      goals.map((goal) =>
        goal.id === goalId ? { ...goal, label: nextLabel } : goal,
      ),
    );
  };

  const toggleGoalComplete = (goalId) => {
    setDailyGoals((goals) =>
      goals.map((goal) =>
        goal.id === goalId ? { ...goal, completed: !goal.completed } : goal,
      ),
    );
  };

  const addGoal = () => {
    setDailyGoals((goals) => [
      ...goals,
      {
        id: `goal-${Date.now()}`,
        label: "New daily goal",
        completed: false,
      },
    ]);
  };

  const removeGoal = (goalId) => {
    setDailyGoals((goals) =>
      goals.length > 1 ? goals.filter((goal) => goal.id !== goalId) : goals,
    );
  };

  if (variant === "recentApplications") {
    return (
      <button
        type="button"
        className="surface-card dashboard-card dashboard-recent-card dashboard-clickable-card"
        onClick={onRecentApplicationsClick}
      >
        <p className="stat-card-description dashboard-card-title text-sm font-medium">
          Recent Applications
        </p>

        <div className="dashboard-recent-list">
          {recentItems.length > 0 ? (
            recentItems.map((item) => {
              const statusMeta = getStatusMeta(item.status);

              return (
                <div key={item.id} className="dashboard-recent-item">
                  <div className="min-w-0">
                    <p className="dashboard-recent-title">
                      {item.company || "Untitled Company"}
                    </p>
                    <p className="dashboard-recent-description">
                      {item.role || "Untitled Role"}
                    </p>
                  </div>

                  <div className="dashboard-recent-meta">
                    <span>{statusMeta.displayLabel}</span>
                    <span>{formatLibraryAppliedDate(item.appliedAt)}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="stat-card-description text-sm">
              No applications yet.
            </p>
          )}
        </div>
      </button>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className="surface-card dashboard-card dashboard-daily-goal-card dashboard-clickable-card"
      onClick={() => setIsEditingGoals((current) => !current)}
      onKeyDown={(event) => {
        const isEditingField =
          event.target.tagName === "INPUT" ||
          event.target.tagName === "TEXTAREA";

        if (isEditingField) return;

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setIsEditingGoals((current) => !current);
        }
      }}
    >
      <div className="dashboard-card-header">
        <p className="stat-card-description dashboard-card-title text-sm font-medium">
          Daily Goal
        </p>

        <span className="dashboard-daily-goal-count">
          {completedGoalCount}/{dailyGoals.length}
        </span>
      </div>

      <div className="dashboard-daily-goal-list">
        {dailyGoals.map((goal) => (
          <label
            key={goal.id}
            className="dashboard-daily-goal-item"
            onClick={(event) => event.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={goal.completed}
              onChange={() => toggleGoalComplete(goal.id)}
            />
            <span>{goal.label}</span>
          </label>
        ))}
      </div>

      <div className="dashboard-status-chart-track">
        <div
          className="dashboard-status-chart-fill dashboard-status-chart-fill--violet"
          style={{ width: `${goalProgress}%` }}
        />
      </div>

      {isEditingGoals ? (
        <div
          className="dashboard-daily-goal-editor"
          onClick={(event) => event.stopPropagation()}
        >
          {dailyGoals.map((goal) => (
            <div key={goal.id} className="dashboard-daily-goal-edit-row">
              <input
                value={goal.label}
                onChange={(event) =>
                  updateGoalLabel(goal.id, event.target.value)
                }
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => event.stopPropagation()}
              />

              <button type="button" onClick={() => removeGoal(goal.id)}>
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            className="dashboard-daily-goal-add-button"
            onClick={addGoal}
          >
            + Add goal
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default DashboardPreview;
