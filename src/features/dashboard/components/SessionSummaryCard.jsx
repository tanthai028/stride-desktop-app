import { useMemo } from "react";
import { Clock3, History, SkipForward, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { getApplicationSessions } from "../../sessions/utils/applicationSessionsStore.js";
import {
  buildActivityData,
  formatDuration,
} from "../../sessions/utils/sessionUtils.js";

function ActivityGrid({ data }) {
  return (
    <div className="ah-heatmap">
      {data.map((day, i) => (
        <div
          key={i}
          className={`ah-heatmap-cell ah-heatmap-cell--${day.level}`}
          title={`${day.date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}: ${day.applied} applied`}
        />
      ))}
    </div>
  );
}

function SessionSummaryCard({ onOpen }) {
  const sessions = useMemo(() => getApplicationSessions(), []);

  function handleClick() {
    onOpen?.();
  }

  function handleKeyDown(event) {
    if (!onOpen) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen();
    }
  }

  const totals = useMemo(
    () =>
      sessions.reduce(
        (acc, s) => ({
          durationSeconds:
            acc.durationSeconds + (Number(s.durationSeconds) || 0),
          appliedCount: acc.appliedCount + (Number(s.appliedCount) || 0),
          skippedCount: acc.skippedCount + (Number(s.skippedCount) || 0),
        }),
        { durationSeconds: 0, appliedCount: 0, skippedCount: 0 },
      ),
    [sessions],
  );

  const applyRate = useMemo(() => {
    const t = totals.appliedCount + totals.skippedCount;
    return t > 0 ? Math.round((totals.appliedCount / t) * 100) : 0;
  }, [totals]);

  const avgPerSession =
    sessions.length > 0
      ? Math.round(totals.appliedCount / sessions.length)
      : 0;

  const activityData = useMemo(() => buildActivityData(sessions, 14), [sessions]);

  return (
    <motion.aside
      className={`ah-summary ah-summary--dashboard${
        onOpen ? " ah-summary--clickable" : ""
      }`}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.38, delay: 0.05 }}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onClick={onOpen ? handleClick : undefined}
      onKeyDown={onOpen ? handleKeyDown : undefined}
      aria-label={onOpen ? "Open application history" : undefined}
    >
      <p className="ah-summary-eyebrow">Overview</p>

      <div className="ah-summary-hero">
        <span className="ah-summary-hero-value">{totals.appliedCount}</span>
        <span className="ah-summary-hero-label">Applications Sent</span>
      </div>

      <div className="ah-summary-rule" />

      <div className="ah-rate">
        <div className="ah-rate-row">
          <span className="ah-rate-value">{applyRate}%</span>
          <span className="ah-rate-label">Apply Rate</span>
        </div>
        <div className="ah-rate-track">
          <motion.div
            className="ah-rate-fill"
            initial={{ width: 0 }}
            animate={{ width: `${applyRate}%` }}
            transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="ah-summary-rule" />

      <div className="ah-mini-grid">
        <div className="ah-mini-stat">
          <div className="ah-mini-stat-head">
            <Clock3 size={12} className="ah-mini-icon" />
            <span className="ah-mini-val">
              {formatDuration(totals.durationSeconds)}
            </span>
          </div>
        </div>
        <div className="ah-mini-stat">
          <div className="ah-mini-stat-head">
            <History size={12} className="ah-mini-icon" />
            <span className="ah-mini-val">{sessions.length}</span>
          </div>
          <span className="ah-mini-lbl">Sessions</span>
        </div>
        <div className="ah-mini-stat">
          <div className="ah-mini-stat-head">
            <SkipForward size={12} className="ah-mini-icon" />
            <span className="ah-mini-val">{totals.skippedCount}</span>
          </div>
          <span className="ah-mini-lbl">Skipped</span>
        </div>
        <div className="ah-mini-stat">
          <div className="ah-mini-stat-head">
            <TrendingUp size={12} className="ah-mini-icon" />
            <span className="ah-mini-val">{avgPerSession}</span>
          </div>
          <span className="ah-mini-lbl">Avg / Session</span>
        </div>
      </div>

      <div className="ah-summary-rule" />

      <div className="ah-heatmap-section">
        <p className="ah-heatmap-label">14-day activity</p>
        <ActivityGrid data={activityData} />
        <div className="ah-heatmap-legend">
          <span>Less</span>
          <div className="ah-heatmap-cell ah-heatmap-cell--0" />
          <div className="ah-heatmap-cell ah-heatmap-cell--1" />
          <div className="ah-heatmap-cell ah-heatmap-cell--2" />
          <div className="ah-heatmap-cell ah-heatmap-cell--3" />
          <span>More</span>
        </div>
      </div>
    </motion.aside>
  );
}

export default SessionSummaryCard;
