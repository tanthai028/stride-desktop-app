import { useMemo, useState } from "react";
import { Clock3, ListChecks, RotateCcw, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import PageShell from "../../components/page/PageShell.jsx";
import PageSection from "../../components/page/PageSection.jsx";
import ActionButton from "../../components/ui/ActionButton.jsx";
import {
  clearApplicationSessions,
  deleteApplicationSession,
  getApplicationSessions,
} from "./utils/applicationSessionsStore.js";

function formatDuration(totalSeconds) {
  const safeSeconds = Math.max(0, Number(totalSeconds) || 0);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
}

function formatSessionDate(value) {
  if (!value) return "Unknown";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Unknown";

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function SessionsPage() {
  const [sessions, setSessions] = useState(() => getApplicationSessions());

  const totals = useMemo(
    () =>
      sessions.reduce(
        (summary, session) => ({
          durationSeconds:
            summary.durationSeconds + (Number(session.durationSeconds) || 0),
          appliedCount:
            summary.appliedCount + (Number(session.appliedCount) || 0),
          skippedCount:
            summary.skippedCount + (Number(session.skippedCount) || 0),
        }),
        {
          durationSeconds: 0,
          appliedCount: 0,
          skippedCount: 0,
        },
      ),
    [sessions],
  );

  function handleDeleteSession(sessionId) {
    setSessions(deleteApplicationSession(sessionId));
  }

  function handleClearSessions() {
    clearApplicationSessions();
    setSessions([]);
  }

  return (
    <motion.div
      className="sessions-page"
      initial={{ y: 14 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <PageShell>
        <div className="sessions-summary-grid">
          <article className="sessions-summary-card">
            <Clock3 size={18} />
            <div>
              <p>Total Time</p>
              <strong>{formatDuration(totals.durationSeconds)}</strong>
            </div>
          </article>

          <article className="sessions-summary-card">
            <ListChecks size={18} />
            <div>
              <p>Applied</p>
              <strong>{totals.appliedCount}</strong>
            </div>
          </article>

          <article className="sessions-summary-card">
            <RotateCcw size={18} />
            <div>
              <p>Skipped</p>
              <strong>{totals.skippedCount}</strong>
            </div>
          </article>
        </div>

        <PageSection
          title="Recent Sessions"
          description="Saved when you exit Apply Mode."
          className="sessions-section"
          headerAction={
            sessions.length > 0 ? (
              <ActionButton tone="ghost" onClick={handleClearSessions}>
                Clear
              </ActionButton>
            ) : null
          }
        >
          {sessions.length === 0 ? (
            <div className="sessions-empty-state">
              <p>No sessions yet.</p>
              <span>
                Open Apply Mode, work through jobs, then exit back here.
              </span>
            </div>
          ) : (
            <div className="sessions-list">
              {sessions.map((session) => (
                <article key={session.id} className="sessions-list-item">
                  <div className="sessions-list-item-main">
                    <strong>{formatSessionDate(session.startedAt)}</strong>
                    <span>
                      {formatDuration(session.durationSeconds)} ·{" "}
                      {session.totalCount || 0} jobs
                    </span>
                  </div>

                  <div className="sessions-list-item-actions">
                    <div className="sessions-list-item-stats">
                      <span>{session.appliedCount || 0} applied</span>
                      <span>{session.skippedCount || 0} skipped</span>
                    </div>

                    <button
                      type="button"
                      className="sessions-delete-button"
                      aria-label="Delete session"
                      title="Delete session"
                      onClick={() => handleDeleteSession(session.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </PageSection>
      </PageShell>
    </motion.div>
  );
}

export default SessionsPage;
