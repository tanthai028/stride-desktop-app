import { useMemo, useState } from "react";
import {
  Briefcase,
  CheckCircle2,
  ChevronDown,
  Clock3,
  History,
  SkipForward,
  TrendingUp,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import PageShell from "../../components/page/PageShell.jsx";
import {
  deleteApplicationSession,
  getApplicationSessions,
} from "./utils/applicationSessionsStore.js";
import {
  buildActivityData,
  filterSessionsByPeriod,
  formatDuration,
  formatSessionDate,
  formatShortTime,
  groupSessionsByDate,
} from "./utils/sessionUtils.js";

// ── Sub-components ────────────────────────────────────────

function RatioBar({ applied, skipped }) {
  const total = applied + skipped;
  const aPct = total > 0 ? (applied / total) * 100 : 0;
  const sPct = total > 0 ? (skipped / total) * 100 : 0;
  return (
    <div className="ah-ratio-track">
      {aPct > 0 && (
        <div className="ah-ratio-applied" style={{ width: `${aPct}%` }} />
      )}
      {sPct > 0 && (
        <div className="ah-ratio-skipped" style={{ width: `${sPct}%` }} />
      )}
    </div>
  );
}

function SessionCard({ session, onDelete, animDelay }) {
  const [expanded, setExpanded] = useState(false);
  const applied = session.appliedCount || 0;
  const skipped = session.skippedCount || 0;
  const total = applied + skipped;
  const rate = total > 0 ? Math.round((applied / total) * 100) : null;
  const hasItems = session.completedItems?.length > 0;

  return (
    <motion.article
      className={`ah-card${hasItems ? " ah-card--expandable" : ""}`}
      onClick={hasItems ? () => setExpanded((v) => !v) : undefined}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animDelay, duration: 0.26 }}
      layout
    >
      <div className="ah-card-head">
        <div className="ah-card-meta">
          <span className="ah-card-date">
            {formatSessionDate(session.startedAt)}
          </span>
          <span className="ah-card-dot" />
          <span className="ah-card-sub">
            {formatDuration(session.durationSeconds)}
          </span>
          <span className="ah-card-dot" />
          <span className="ah-card-sub">{session.totalCount || 0} jobs</span>
        </div>
        <div className="ah-card-actions">
          {hasItems && (
            <button
              type="button"
              className="ah-icon-btn"
              aria-label={expanded ? "Collapse" : "Expand"}
              onClick={(e) => {
                e.stopPropagation();
                setExpanded((v) => !v);
              }}
            >
              <motion.span
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.18 }}
                style={{ display: "flex" }}
              >
                <ChevronDown size={13} />
              </motion.span>
            </button>
          )}
          <button
            type="button"
            className="ah-icon-btn ah-icon-btn--danger"
            aria-label="Delete session"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(session.id);
            }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="ah-card-foot">
        <RatioBar applied={applied} skipped={skipped} />
        <div className="ah-chips">
          <span className="ah-chip ah-chip--green">
            <CheckCircle2 size={10} />
            {applied} applied
          </span>
          <span className="ah-chip ah-chip--amber">
            <SkipForward size={10} />
            {skipped} skipped
          </span>
          {rate !== null && (
            <span className="ah-chip ah-chip--pink">{rate}% rate</span>
          )}
        </div>
      </div>

      <AnimatePresence>
        {expanded && hasItems && (
          <motion.div
            className="ah-jobs-wrap"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          >
            <ul className="ah-jobs">
              {session.completedItems.map((item, i) => (
                <motion.li
                  key={item.id}
                  className="ah-job"
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.025, duration: 0.18 }}
                >
                  <div className="ah-job-info">
                    <span className="ah-job-role">
                      {item.role || "Unknown Role"}
                    </span>
                    {item.company && (
                      <>
                        <span className="ah-job-sep">·</span>
                        <span className="ah-job-company">{item.company}</span>
                      </>
                    )}
                  </div>
                  <div className="ah-job-right">
                    {item.appliedAt && (
                      <span className="ah-job-time">
                        {formatShortTime(item.appliedAt)}
                      </span>
                    )}
                    <span
                      className={
                        item.status === "Applied"
                          ? "ah-job-badge ah-job-badge--applied"
                          : "ah-job-badge ah-job-badge--skipped"
                      }
                    >
                      {item.status}
                    </span>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

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

// ── Page ──────────────────────────────────────────────────

const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
];

function ApplicationHistoryPage() {
  const [sessions, setSessions] = useState(() => getApplicationSessions());
  const [filterPeriod, setFilterPeriod] = useState("all");

  const filteredSessions = useMemo(
    () => filterSessionsByPeriod(sessions, filterPeriod),
    [sessions, filterPeriod],
  );

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
    sessions.length > 0 ? Math.round(totals.appliedCount / sessions.length) : 0;

  const activityData = useMemo(
    () => buildActivityData(sessions, 14),
    [sessions],
  );
  const grouped = useMemo(
    () => groupSessionsByDate(filteredSessions),
    [filteredSessions],
  );

  function handleDeleteSession(id) {
    setSessions(deleteApplicationSession(id));
  }

  return (
    <motion.div
      className="ah-page"
      initial={{ y: 14 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <PageShell scrollable={false}>
        <div className="ah-layout">
          {/* ── Left: Summary panel ──────────────── */}
          <motion.aside
            className="ah-summary"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.38, delay: 0.05 }}
          >
            <p className="ah-summary-eyebrow">Overview</p>

            <div className="ah-summary-hero">
              <span className="ah-summary-hero-value">
                {totals.appliedCount}
              </span>
              <span className="ah-summary-hero-label">Applications Sent</span>
            </div>

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

          {/* ── Right: History panel ─────────────── */}
          <div className="ah-history">
            <div className="ah-history-head">
              <div className="ah-filter-tabs">
                {FILTER_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`ah-filter-tab${filterPeriod === tab.id ? " is-active" : ""}`}
                    onClick={() => setFilterPeriod(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="ah-history-body">
              {sessions.length === 0 ? (
                <motion.div
                  className="ah-empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="ah-empty-icon">
                    <Briefcase size={20} />
                  </div>
                  <p className="ah-empty-title">No sessions yet</p>
                  <span className="ah-empty-desc">
                    Open Apply Mode, work through jobs, then exit to log your
                    first session here.
                  </span>
                </motion.div>
              ) : (
                <div className="ah-groups">
                  {grouped.map((group, gi) => (
                    <div key={group.label} className="ah-group">
                      <motion.p
                        className="ah-group-label"
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.18 + gi * 0.05 }}
                      >
                        {group.label}
                      </motion.p>
                      <div className="ah-group-list">
                        {group.sessions.map((session, si) => (
                          <SessionCard
                            key={session.id}
                            session={session}
                            onDelete={handleDeleteSession}
                            animDelay={0.22 + gi * 0.05 + si * 0.035}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </PageShell>
    </motion.div>
  );
}

export default ApplicationHistoryPage;
