// ── Formatters ────────────────────────────────────────────

export function formatDuration(totalSeconds) {
  const s = Math.max(0, Number(totalSeconds) || 0);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

export function formatSessionDate(value) {
  if (!value) return "Unknown";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Unknown";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

export function formatShortTime(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

// ── Grouping ──────────────────────────────────────────────

export const GROUP_ORDER = ["Today", "Yesterday", "This Week", "Earlier"];

function getDateGroupLabel(dateString) {
  if (!dateString) return "Earlier";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "Earlier";
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  if (day >= today) return "Today";
  if (day >= yesterday) return "Yesterday";
  if (day >= weekAgo) return "This Week";
  return "Earlier";
}

export function groupSessionsByDate(sessions) {
  const map = {};
  for (const s of sessions) {
    const label = getDateGroupLabel(s.startedAt);
    if (!map[label]) map[label] = [];
    map[label].push(s);
  }
  return GROUP_ORDER.filter((l) => map[l]?.length > 0).map((l) => ({
    label: l,
    sessions: map[l],
  }));
}

// ── Activity data ─────────────────────────────────────────

export function buildActivityData(sessions, days = 14) {
  const now = new Date();
  return Array.from({ length: days }, (_, i) => {
    const start = new Date(now);
    start.setDate(start.getDate() - (days - 1 - i));
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    const applied = sessions.reduce((acc, s) => {
      const t = new Date(s.startedAt);
      return t >= start && t < end ? acc + (Number(s.appliedCount) || 0) : acc;
    }, 0);
    return {
      date: start,
      applied,
      level: applied === 0 ? 0 : applied <= 2 ? 1 : applied <= 5 ? 2 : 3,
    };
  });
}

// ── Filtering ─────────────────────────────────────────────

export function filterSessionsByPeriod(sessions, period) {
  if (period === "all") return sessions;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return sessions.filter((s) => {
    if (!s.startedAt) return false;
    const d = new Date(s.startedAt);
    if (Number.isNaN(d.getTime())) return false;
    if (period === "today") return d >= today;
    if (period === "week") {
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      return d >= weekAgo;
    }
    if (period === "month") {
      return d >= new Date(now.getFullYear(), now.getMonth(), 1);
    }
    return true;
  });
}
