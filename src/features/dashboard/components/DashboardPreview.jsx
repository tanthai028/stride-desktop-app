import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ExternalLink,
  Link,
  ListChecks,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Target,
  Trash2,
} from "lucide-react";
import { formatLibraryAppliedDate } from "../../library/utils/libraryDisplayFormatters.js";
import { getStatusMeta } from "../../library/constants/libraryStatuses.js";
import {
  playTimerAlarm,
  primeUiFeedbackAudio,
  stopTimerAlarm,
} from "../../../lib/uiFeedback.js";
const TIMER_STORAGE_KEY = "dashboardTimerMinutes";
const DEFAULT_TIMER_MINUTES = 30;

const APPLY_GOAL_STORAGE_KEY = "dashboardApplyGoalTarget";
const QUICK_LINKS_STORAGE_KEY = "dashboardQuickLinks";

const DEFAULT_APPLY_GOAL_TARGET = 3;
const DEFAULT_RECENT_APPS_PER_PAGE = 4;
const RECENT_APP_ROW_HEIGHT = 58;
const QUICK_LINKS_PER_PAGE = 5;
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

function getPaginationItems(currentPage, totalPages) {
  if (totalPages <= 6) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "ellipsis-left",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis-right",
    totalPages,
  ];
}

function DashboardPagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pageItems = getPaginationItems(currentPage, totalPages);

  return (
    <div
      className="dashboard-pagination"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        className="dashboard-pagination-button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft />
      </button>

      {pageItems.map((item) =>
        String(item).startsWith("ellipsis") ? (
          <span key={item} className="dashboard-pagination-ellipsis">
            ...
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={`dashboard-pagination-button ${
              item === currentPage ? "dashboard-pagination-button--active" : ""
            }`}
            onClick={() => onPageChange(item)}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        className="dashboard-pagination-button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight />
      </button>
    </div>
  );
}

function DashboardPreview({
  variant = "applyGoal",
  todayApplicationCount = 0,
  recentItems = [],
  recentPeriod = "today",
  onRecentPeriodClick,
  onRecentApplicationsClick,
  onAddApplicationClick,
}) {
  const [applyGoalTarget, setApplyGoalTarget] = useState(
    getSavedApplyGoalTarget,
  );
  const [quickLinks, setQuickLinks] = useState(getSavedQuickLinks);
  const [recentPage, setRecentPage] = useState(1);
  const [quickLinksPage, setQuickLinksPage] = useState(1);
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
  const hasTimerFinishedRef = useRef(false);
  const timerMinutesInputRef = useRef(null);
  const timerSecondsInputRef = useRef(null);
  const recentListRef = useRef(null);
  const [recentAppsPerPage, setRecentAppsPerPage] = useState(
    DEFAULT_RECENT_APPS_PER_PAGE,
  );

  const applyGoalCardRef = useRef(null);
  const applyGoalInputRef = useRef(null);
  const [isEditingApplyGoal, setIsEditingApplyGoal] = useState(false);
  const [applyGoalDraft, setApplyGoalDraft] = useState("");
  const timerTotalSeconds = Math.max(1, Math.round(timerMinutes * 60));

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
    if (timerSeconds > 0) {
      hasTimerFinishedRef.current = false;
      window.timerApi?.stopFlashTaskbar?.();
      return;
    }

    if (hasTimerFinishedRef.current) return;

    hasTimerFinishedRef.current = true;
    setIsTimerRunning(false);

    // reset instantly
    setTimerSeconds(timerTotalSeconds);
    hasTimerFinishedRef.current = false;

    // play sound after reset
    playTimerAlarm({ loopCount: 2 });

    window.timerApi?.flashTaskbar?.();
  }, [timerSeconds, timerTotalSeconds]);

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

  useEffect(() => {
    const listElement = recentListRef.current;
    if (!listElement) return undefined;

    const updateRecentAppsPerPage = () => {
      const availableHeight = listElement.clientHeight;
      const nextPerPage = Math.max(
        1,
        Math.floor(availableHeight / RECENT_APP_ROW_HEIGHT),
      );

      setRecentAppsPerPage(nextPerPage);
    };

    updateRecentAppsPerPage();

    const resizeObserver = new ResizeObserver(updateRecentAppsPerPage);
    resizeObserver.observe(listElement);

    return () => resizeObserver.disconnect();
  }, [variant]);

  useEffect(() => {
    setRecentPage(1);
  }, [recentItems.length, recentAppsPerPage]);

  useEffect(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(quickLinks.length / QUICK_LINKS_PER_PAGE),
    );

    setQuickLinksPage((page) => Math.min(page, totalPages));
  }, [quickLinks.length]);

  const applyGoalProgress = Math.min(
    100,
    Math.round((todayApplicationCount / applyGoalTarget) * 100),
  );

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
    setQuickLinks((links) => {
      const nextLinks = [
        ...links,
        {
          id: `link-${Date.now()}`,
          label: "New Link",
          url: "https://",
        },
      ];

      setQuickLinksPage(Math.ceil(nextLinks.length / QUICK_LINKS_PER_PAGE));
      return nextLinks;
    });

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
        className="surface-card stat-card dashboard-metric-card dashboard-timer-card dashboard-editable-card dashboard-clickable-card"
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
          </div>

          <div className="dashboard-timer-value-row">
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

            <div className="dashboard-timer-header-actions">
              <button
                type="button"
                className="dashboard-icon-action dashboard-timer-icon-button"
                onClick={(event) => {
                  event.stopPropagation();
                  void primeUiFeedbackAudio();
                  stopTimerAlarm();
                  window.timerApi?.stopFlashTaskbar?.();
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
                  stopTimerAlarm();
                  setIsTimerRunning(false);
                  setTimerSeconds(timerTotalSeconds);
                  window.timerApi?.stopFlashTaskbar?.();
                  hasTimerFinishedRef.current = false;
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

  if (variant === "recentApplications") {
    const periodLabel = recentPeriod === "today" ? "Today" : "This Week";
    const recentTotalPages = Math.max(
      1,
      Math.ceil(recentItems.length / recentAppsPerPage),
    );
    const visibleRecentItems = recentItems.slice(
      (recentPage - 1) * recentAppsPerPage,
      recentPage * recentAppsPerPage,
    );

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

        <div ref={recentListRef} className="dashboard-recent-list">
          {recentItems.length > 0 ? (
            visibleRecentItems.map((item) => {
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
        <DashboardPagination
          currentPage={recentPage}
          totalPages={recentTotalPages}
          onPageChange={setRecentPage}
        />
        <button
          type="button"
          className="dashboard-recent-add-button"
          onClick={(event) => {
            event.stopPropagation();
            onAddApplicationClick?.();
          }}
          aria-label="Add application"
          title="Add application"
        >
          <Plus />
        </button>
      </div>
    );
  }

  if (variant === "quickLinks") {
    const quickLinksTotalPages = Math.max(
      1,
      Math.ceil(quickLinks.length / QUICK_LINKS_PER_PAGE),
    );
    const visibleQuickLinks = quickLinks.slice(
      (quickLinksPage - 1) * QUICK_LINKS_PER_PAGE,
      quickLinksPage * QUICK_LINKS_PER_PAGE,
    );
    return (
      <div
        className="surface-card dashboard-card dashboard-quick-links-card dashboard-clickable-card"
        role="button"
        tabIndex={0}
        onClick={() => {
          if (!isEditingLinks) setIsEditingLinks(true);
        }}
        onKeyDown={(event) => {
          if (isEditingLinks) return;

          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsEditingLinks(true);
          }
        }}
      >
        <div className="dashboard-card-header dashboard-quick-links-header">
          <p className="stat-card-description dashboard-card-title text-sm font-medium">
            <DashboardTitle icon={Link}>Quick Links</DashboardTitle>
          </p>

          {isEditingLinks ? (
            <div className="dashboard-quick-links-actions">
              <button
                type="button"
                className="dashboard-icon-action"
                onClick={(event) => {
                  event.stopPropagation();
                  addQuickLink();
                }}
                aria-label="Add quick link"
                title="Add link"
              >
                <Plus />
              </button>

              <button
                type="button"
                className="dashboard-icon-action"
                onClick={(event) => {
                  event.stopPropagation();
                  setIsEditingLinks(false);
                }}
                aria-label="Done editing quick links"
                title="Done"
              >
                <Check />
              </button>
            </div>
          ) : null}
        </div>

        <div className="dashboard-quick-links-list">
          {isEditingLinks ? (
            <div
              className="dashboard-quick-links-edit-header"
              aria-hidden="true"
            >
              <span>Name</span>
              <span>Link</span>
              <span />
            </div>
          ) : null}
          {visibleQuickLinks.map((link) => {
            const faviconUrl = getFaviconUrl(link.url);

            return (
              <div key={link.id} className="dashboard-quick-link-row">
                {isEditingLinks ? (
                  <>
                    <input
                      aria-label="Quick link label"
                      value={link.label}
                      onClick={(event) => event.stopPropagation()}
                      onChange={(event) =>
                        updateQuickLink(link.id, "label", event.target.value)
                      }
                    />

                    <input
                      aria-label="Quick link URL"
                      value={link.url}
                      onClick={(event) => event.stopPropagation()}
                      onChange={(event) =>
                        updateQuickLink(link.id, "url", event.target.value)
                      }
                    />

                    <button
                      type="button"
                      className="dashboard-icon-action dashboard-quick-link-delete"
                      onClick={(event) => {
                        event.stopPropagation();
                        removeQuickLink(link.id);
                      }}
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
                    onClick={(event) => {
                      event.stopPropagation();
                      openDashboardLink(link.url);
                    }}
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
        <DashboardPagination
          currentPage={quickLinksPage}
          totalPages={quickLinksTotalPages}
          onPageChange={setQuickLinksPage}
        />
      </div>
    );
  }

  return (
    <div
      ref={applyGoalCardRef}
      className="surface-card stat-card dashboard-metric-card dashboard-apply-goal-card dashboard-editable-card dashboard-clickable-card"
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
