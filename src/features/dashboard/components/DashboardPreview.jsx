import { useEffect, useRef, useState } from "react";
import {
  Check,
  Clock3,
  ExternalLink,
  Link,
  ListChecks,
  Pause,
  Pencil,
  Play,
  Plus,
  RotateCcw,
  Target,
  Trash2,
} from "lucide-react";
import { formatLibraryAppliedDate } from "../../library/utils/libraryDisplayFormatters.js";
import { getStatusMeta } from "../../library/constants/libraryStatuses.js";
const TIMER_STORAGE_KEY = "dashboardTimerMinutes";
const DEFAULT_TIMER_MINUTES = 30;

const APPLY_GOAL_STORAGE_KEY = "dashboardApplyGoalTarget";
const QUICK_LINKS_STORAGE_KEY = "dashboardQuickLinks";

const DEFAULT_APPLY_GOAL_TARGET = 3;
const DEFAULT_QUICK_LINKS = [
  {
    id: "job-sheet",
    label: "Job Tracker Sheet",
    url: "https://docs.google.com/spreadsheets/",
  },
  {
    id: "leetcode",
    label: "LeetCode",
    url: "https://leetcode.com/",
  },
  {
    id: "youtube",
    label: "YouTube",
    url: "https://www.youtube.com/",
  },
];

function getSavedApplyGoalTarget() {
  const savedTarget = Number(localStorage.getItem(APPLY_GOAL_STORAGE_KEY));

  return Number.isFinite(savedTarget) && savedTarget > 0
    ? savedTarget
    : DEFAULT_APPLY_GOAL_TARGET;
}

function getSavedTimerMinutes() {
  const savedMinutes = Number(localStorage.getItem(TIMER_STORAGE_KEY));

  return Number.isFinite(savedMinutes) && savedMinutes > 0
    ? savedMinutes
    : DEFAULT_TIMER_MINUTES;
}

function formatTimerSeconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

function formatTimerDurationLabel(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0 && remainingSeconds > 0) {
    return `${minutes} min ${remainingSeconds} sec`;
  }

  if (minutes > 0) {
    return `${minutes} minute${minutes === 1 ? "" : "s"}`;
  }

  return `${remainingSeconds} second${remainingSeconds === 1 ? "" : "s"}`;
}

function getSavedQuickLinks() {
  try {
    const savedLinks = JSON.parse(
      localStorage.getItem(QUICK_LINKS_STORAGE_KEY),
    );

    return Array.isArray(savedLinks) && savedLinks.length > 0
      ? savedLinks
      : DEFAULT_QUICK_LINKS;
  } catch {
    return DEFAULT_QUICK_LINKS;
  }
}

function normalizeUrl(url) {
  const trimmedUrl = String(url || "").trim();

  if (!trimmedUrl) return "";

  if (/^https?:\/\//i.test(trimmedUrl)) {
    return trimmedUrl;
  }

  return `https://${trimmedUrl}`;
}

function getFaviconUrl(url) {
  const normalizedUrl = normalizeUrl(url);

  if (!normalizedUrl) return "";

  try {
    const { origin } = new URL(normalizedUrl);

    return `${origin}/favicon.ico`;
  } catch {
    return "";
  }
}

function openDashboardLink(url) {
  const normalizedUrl = normalizeUrl(url);

  if (!normalizedUrl) return;

  if (window.libraryApi?.openExternalUrl) {
    window.libraryApi.openExternalUrl(normalizedUrl);
    return;
  }

  window.open(normalizedUrl, "_blank", "noopener,noreferrer");
}

function DashboardTitle({ icon: Icon, children, className = "" }) {
  return (
    <span className={`dashboard-title-with-icon ${className}`}>
      <Icon className="dashboard-title-icon" />
      <span>{children}</span>
    </span>
  );
}

function DashboardPreview({
  variant = "applyGoal",
  todayApplicationCount = 0,
  recentItems = [],
  recentPeriod = "today",
  onRecentPeriodClick,
  onRecentApplicationsClick,
}) {
  const [applyGoalTarget, setApplyGoalTarget] = useState(
    getSavedApplyGoalTarget,
  );
  const [quickLinks, setQuickLinks] = useState(getSavedQuickLinks);
  const [isEditingLinks, setIsEditingLinks] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(getSavedTimerMinutes);
  const [timerSeconds, setTimerSeconds] = useState(
    () => getSavedTimerMinutes() * 60,
  );
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isEditingTimer, setIsEditingTimer] = useState(false);
  const [timerDraftMinutes, setTimerDraftMinutes] = useState("");
  const [timerDraftSeconds, setTimerDraftSeconds] = useState("");
  const timerCardRef = useRef(null);
  const timerMinutesInputRef = useRef(null);
  const timerSecondsInputRef = useRef(null);

  const applyGoalCardRef = useRef(null);
  const applyGoalInputRef = useRef(null);
  const [isEditingApplyGoal, setIsEditingApplyGoal] = useState(false);
  const [applyGoalDraft, setApplyGoalDraft] = useState("");

  useEffect(() => {
    localStorage.setItem(APPLY_GOAL_STORAGE_KEY, String(applyGoalTarget));
  }, [applyGoalTarget]);

  useEffect(() => {
    localStorage.setItem(QUICK_LINKS_STORAGE_KEY, JSON.stringify(quickLinks));
  }, [quickLinks]);

  useEffect(() => {
    localStorage.setItem(TIMER_STORAGE_KEY, String(timerMinutes));
  }, [timerMinutes]);

  useEffect(() => {
    if (!isTimerRunning) return undefined;

    const intervalId = window.setInterval(() => {
      setTimerSeconds((currentSeconds) => {
        if (currentSeconds <= 1) {
          setIsTimerRunning(false);
          return 0;
        }

        return currentSeconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isTimerRunning]);

  useEffect(() => {
    if (!isEditingTimer) return;

    timerMinutesInputRef.current?.focus();
    timerMinutesInputRef.current?.select();
  }, [isEditingTimer]);

  useEffect(() => {
    if (!isEditingApplyGoal) return;

    applyGoalInputRef.current?.focus();
    applyGoalInputRef.current?.select();
  }, [isEditingApplyGoal]);

  useEffect(() => {
    if (!isEditingTimer && !isEditingApplyGoal) return undefined;

    function handlePointerDown(event) {
      if (
        isEditingTimer &&
        timerCardRef.current &&
        !timerCardRef.current.contains(event.target)
      ) {
        cancelTimerEdit();
      }

      if (
        isEditingApplyGoal &&
        applyGoalCardRef.current &&
        !applyGoalCardRef.current.contains(event.target)
      ) {
        cancelApplyGoalEdit();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isEditingTimer, isEditingApplyGoal]);

  const applyGoalProgress = Math.min(
    100,
    Math.round((todayApplicationCount / applyGoalTarget) * 100),
  );

  const timerTotalSeconds = Math.max(1, Math.round(timerMinutes * 60));

  const timerProgress = Math.min(
    100,
    Math.round((timerSeconds / timerTotalSeconds) * 100),
  );

  const updateQuickLink = (linkId, field, value) => {
    setQuickLinks((links) =>
      links.map((link) =>
        link.id === linkId ? { ...link, [field]: value } : link,
      ),
    );
  };

  const addQuickLink = () => {
    setQuickLinks((links) => [
      ...links,
      {
        id: `link-${Date.now()}`,
        label: "New Link",
        url: "https://",
      },
    ]);

    setIsEditingLinks(true);
  };

  const removeQuickLink = (linkId) => {
    setQuickLinks((links) =>
      links.length > 1 ? links.filter((link) => link.id !== linkId) : links,
    );
  };

  const startEditingTimer = () => {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;

    setTimerDraftMinutes(String(minutes));
    setTimerDraftSeconds(String(seconds).padStart(2, "0"));
    setIsEditingTimer(true);
  };

  const confirmTimerEdit = (
    nextDraftMinutes = timerDraftMinutes,
    nextDraftSeconds = timerDraftSeconds,
  ) => {
    const minutes = Number(nextDraftMinutes || 0);
    const seconds = Math.min(59, Number(nextDraftSeconds || 0));
    const nextSeconds = Math.max(1, Math.round(minutes * 60 + seconds));

    setTimerMinutes(nextSeconds / 60);
    setTimerSeconds(nextSeconds);
    setIsTimerRunning(false);
    setIsEditingTimer(false);
  };

  const cancelTimerEdit = () => {
    setIsEditingTimer(false);
  };

  const startEditingApplyGoal = () => {
    setApplyGoalDraft(String(applyGoalTarget));
    setIsEditingApplyGoal(true);
  };

  const confirmApplyGoalEdit = () => {
    const nextGoal = Number(applyGoalDraft);

    setApplyGoalTarget(
      Number.isFinite(nextGoal) && nextGoal > 0
        ? nextGoal
        : DEFAULT_APPLY_GOAL_TARGET,
    );

    setIsEditingApplyGoal(false);
  };

  const cancelApplyGoalEdit = () => {
    setApplyGoalDraft(String(applyGoalTarget));
    setIsEditingApplyGoal(false);
  };

  if (variant === "timer") {
    return (
      <div
        ref={timerCardRef}
        className="surface-card stat-card dashboard-metric-card dashboard-timer-card dashboard-editable-card"
        role="button"
        tabIndex={0}
        onClick={startEditingTimer}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            startEditingTimer();
          }
        }}
      >
        <div className="dashboard-metric-content">
          <div className="dashboard-timer-header">
            <p className="stat-card-label stat-card-label--violet">
              <DashboardTitle icon={Clock3}>Timer</DashboardTitle>
            </p>

            <div className="dashboard-timer-header-actions">
              <button
                type="button"
                className="dashboard-icon-action dashboard-timer-icon-button"
                onClick={(event) => {
                  event.stopPropagation();
                  setIsTimerRunning((current) => !current);
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
                  setIsTimerRunning(false);
                  setTimerSeconds(timerTotalSeconds);
                }}
                aria-label="Reset timer"
                title="Reset"
              >
                <RotateCcw />
              </button>
            </div>
          </div>

          {isEditingTimer ? (
            <h2 className="stat-card-title dashboard-metric-value dashboard-timer-edit-value">
              <input
                ref={timerMinutesInputRef}
                value={timerDraftMinutes}
                onChange={(event) =>
                  setTimerDraftMinutes(event.target.value.replace(/\D/g, ""))
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
                    setTimerDraftMinutes(nextMinutes);

                    window.requestAnimationFrame(() => {
                      timerSecondsInputRef.current?.focus();
                      timerSecondsInputRef.current?.select();
                    });
                  }

                  if (event.key === "Escape") {
                    cancelTimerEdit();
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
                  setTimerDraftSeconds(
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

                    confirmTimerEdit(timerDraftMinutes, nextSeconds);
                  }

                  if (event.key === "Escape") {
                    cancelTimerEdit();
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

  if (variant === "recentApplications") {
    const periodLabel = recentPeriod === "today" ? "Today" : "This Week";

    return (
      <div
        className="surface-card dashboard-card dashboard-recent-card dashboard-clickable-card"
        role="button"
        tabIndex={0}
        onClick={onRecentApplicationsClick}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onRecentApplicationsClick?.();
          }
        }}
      >
        <div className="dashboard-recent-header">
          <p className="stat-card-description dashboard-card-title dashboard-recent-card-title text-sm font-medium">
            <DashboardTitle icon={ListChecks}>
              Recent Applications
            </DashboardTitle>{" "}
            <span className="dashboard-recent-count-chip">
              {recentItems.length}
            </span>
          </p>

          <button
            type="button"
            className="dashboard-recent-period-button"
            onClick={(event) => {
              event.stopPropagation();
              onRecentPeriodClick?.();
            }}
          >
            {periodLabel}
          </button>
        </div>

        <div className="dashboard-recent-list">
          {recentItems.length > 0 ? (
            recentItems.map((item) => {
              const statusMeta = getStatusMeta(item.status);

              return (
                <button
                  key={item.id}
                  type="button"
                  className="dashboard-recent-item"
                  onClick={(event) => {
                    event.stopPropagation();
                    openDashboardLink(item.jobUrl);
                  }}
                  disabled={!item.jobUrl}
                >
                  <p className="dashboard-recent-title">
                    {item.company || "Untitled Company"} ·{" "}
                    {item.role || "Untitled Role"}
                  </p>

                  <div className="dashboard-recent-meta">
                    <span className="dashboard-recent-location">
                      {item.location || "Unknown"}
                    </span>

                    <span className="dashboard-recent-right">
                      {statusMeta.displayLabel || statusMeta.label} -{" "}
                      {formatLibraryAppliedDate(item.appliedAt)}
                    </span>
                  </div>
                </button>
              );
            })
          ) : (
            <p className="stat-card-description text-sm">
              No applications listed for {periodLabel.toLowerCase()}.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (variant === "quickLinks") {
    return (
      <div className="surface-card dashboard-card dashboard-quick-links-card">
        <div className="dashboard-card-header dashboard-quick-links-header">
          <p className="stat-card-description dashboard-card-title text-sm font-medium">
            <DashboardTitle icon={Link}>Quick Links</DashboardTitle>
          </p>

          <div className="dashboard-quick-links-actions">
            {isEditingLinks ? (
              <button
                type="button"
                className="dashboard-icon-action"
                onClick={addQuickLink}
                aria-label="Add quick link"
                title="Add link"
              >
                <Plus />
              </button>
            ) : null}
            <button
              type="button"
              className="dashboard-icon-action"
              onClick={() => setIsEditingLinks((current) => !current)}
              aria-label={
                isEditingLinks ? "Done editing quick links" : "Edit quick links"
              }
              title={isEditingLinks ? "Done" : "Edit"}
            >
              {isEditingLinks ? <Check /> : <Pencil />}
            </button>
          </div>
        </div>

        <div className="dashboard-quick-links-list">
          {quickLinks.map((link) => {
            const faviconUrl = getFaviconUrl(link.url);

            return (
              <div key={link.id} className="dashboard-quick-link-row">
                {isEditingLinks ? (
                  <>
                    <label className="dashboard-quick-link-field">
                      <span className="dashboard-quick-link-input-label">
                        Name
                      </span>
                      <input
                        aria-label="Quick link label"
                        value={link.label}
                        onChange={(event) =>
                          updateQuickLink(link.id, "label", event.target.value)
                        }
                      />
                    </label>

                    <label className="dashboard-quick-link-field">
                      <span className="dashboard-quick-link-input-label">
                        Link
                      </span>
                      <input
                        aria-label="Quick link URL"
                        value={link.url}
                        onChange={(event) =>
                          updateQuickLink(link.id, "url", event.target.value)
                        }
                      />
                    </label>

                    <button
                      type="button"
                      className="dashboard-icon-action dashboard-quick-link-delete"
                      onClick={() => removeQuickLink(link.id)}
                      aria-label={`Remove ${link.label || "quick link"}`}
                      title="Remove"
                    >
                      <Trash2 />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="dashboard-quick-link-button"
                    onClick={() => openDashboardLink(link.url)}
                  >
                    <span className="dashboard-quick-link-main">
                      <span className="dashboard-quick-link-site-icon">
                        {faviconUrl ? (
                          <img
                            src={faviconUrl}
                            alt=""
                            loading="lazy"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <span className="dashboard-quick-link-fallback-icon">
                            {link.label?.charAt(0)?.toUpperCase() || "L"}
                          </span>
                        )}
                      </span>

                      <span className="dashboard-quick-link-label">
                        {link.label || "Untitled Link"}
                      </span>
                    </span>

                    <span className="dashboard-quick-link-open-icon">
                      <ExternalLink />
                    </span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={applyGoalCardRef}
      className="surface-card stat-card dashboard-metric-card dashboard-apply-goal-card dashboard-editable-card"
      role="button"
      tabIndex={0}
      onClick={startEditingApplyGoal}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          startEditingApplyGoal();
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
              onChange={(event) => {
                setApplyGoalDraft(event.target.value);
              }}
              onKeyDown={(event) => {
                event.stopPropagation();

                if (event.key === "Enter") {
                  event.preventDefault();
                  confirmApplyGoalEdit();
                }

                if (event.key === "Escape") {
                  event.preventDefault();
                  cancelApplyGoalEdit();
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

export default DashboardPreview;
