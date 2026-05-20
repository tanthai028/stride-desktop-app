const SESSIONS_STORAGE_KEY = "stride.applicationSessions";
const ACTIVE_SESSION_STORAGE_KEY = "stride.activeApplicationSession";

function safeParseArray(rawValue) {
  try {
    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

function safeParseObject(rawValue) {
  try {
    const parsedValue = JSON.parse(rawValue);
    return parsedValue && typeof parsedValue === "object" ? parsedValue : null;
  } catch {
    return null;
  }
}

export function getApplicationSessions() {
  if (typeof window === "undefined") return [];

  return safeParseArray(window.localStorage.getItem(SESSIONS_STORAGE_KEY));
}

export function saveApplicationSession(session) {
  if (typeof window === "undefined" || !session) return null;

  const sessions = getApplicationSessions();
  const nextSession = {
    id:
      session.id ||
      `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    startedAt: session.startedAt,
    endedAt: session.endedAt,
    durationSeconds: Math.max(0, Number(session.durationSeconds) || 0),
    appliedCount: Math.max(0, Number(session.appliedCount) || 0),
    skippedCount: Math.max(0, Number(session.skippedCount) || 0),
    totalCount: Math.max(0, Number(session.totalCount) || 0),
    completedItems: Array.isArray(session.completedItems)
      ? session.completedItems
      : [],
  };

  window.localStorage.setItem(
    SESSIONS_STORAGE_KEY,
    JSON.stringify([nextSession, ...sessions].slice(0, 100)),
  );

  return nextSession;
}

export function deleteApplicationSession(sessionId) {
  if (typeof window === "undefined") return [];

  const nextSessions = getApplicationSessions().filter(
    (session) => session.id !== sessionId,
  );

  window.localStorage.setItem(
    SESSIONS_STORAGE_KEY,
    JSON.stringify(nextSessions),
  );

  return nextSessions;
}

export function clearApplicationSessions() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(SESSIONS_STORAGE_KEY);
}

export function getActiveApplicationSession() {
  if (typeof window === "undefined") return null;

  return safeParseObject(
    window.localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY),
  );
}

export function saveActiveApplicationSession(session) {
  if (typeof window === "undefined" || !session) return null;

  window.localStorage.setItem(
    ACTIVE_SESSION_STORAGE_KEY,
    JSON.stringify(session),
  );

  return session;
}

export function clearActiveApplicationSession() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
}
