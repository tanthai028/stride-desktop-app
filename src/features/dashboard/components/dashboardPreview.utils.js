import {
  APPLY_GOAL_STORAGE_KEY,
  DEFAULT_APPLY_GOAL_TARGET,
  DEFAULT_QUICK_LINKS,
  DEFAULT_TIMER_MINUTES,
  QUICK_LINKS_STORAGE_KEY,
  TIMER_STORAGE_KEY,
} from "./dashboardPreview.constants.js";

export function getSavedApplyGoalTarget() {
  const savedTarget = Number(localStorage.getItem(APPLY_GOAL_STORAGE_KEY));

  return Number.isFinite(savedTarget) && savedTarget > 0
    ? savedTarget
    : DEFAULT_APPLY_GOAL_TARGET;
}

export function getSavedTimerMinutes() {
  const savedMinutes = Number(localStorage.getItem(TIMER_STORAGE_KEY));

  return Number.isFinite(savedMinutes) && savedMinutes > 0
    ? savedMinutes
    : DEFAULT_TIMER_MINUTES;
}

export function getSavedQuickLinks() {
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

export function formatTimerSeconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

export function formatTimerDurationLabel(seconds) {
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

export function normalizeUrl(url) {
  const trimmedUrl = String(url || "").trim();

  if (!trimmedUrl) return "";

  if (/^https?:\/\//i.test(trimmedUrl)) {
    return trimmedUrl;
  }

  return `https://${trimmedUrl}`;
}

export function getFaviconUrl(url) {
  const normalizedUrl = normalizeUrl(url);

  if (!normalizedUrl) return "";

  try {
    const { origin } = new URL(normalizedUrl);

    return `${origin}/favicon.ico`;
  } catch {
    return "";
  }
}

export function openDashboardLink(url) {
  const normalizedUrl = normalizeUrl(url);

  if (!normalizedUrl) return;

  if (window.libraryApi?.openExternalUrl) {
    window.libraryApi.openExternalUrl(normalizedUrl);
    return;
  }

  window.open(normalizedUrl, "_blank", "noopener,noreferrer");
}
