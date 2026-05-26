import {
  APPLY_GOAL_STORAGE_KEY,
  DEFAULT_APPLY_GOAL_TARGET,
  DEFAULT_QUICK_LINKS,
  QUICK_LINKS_STORAGE_KEY,
} from "../constants/dashboardPreview.constants.js";

export function getSavedApplyGoalTarget() {
  const savedTarget = Number(localStorage.getItem(APPLY_GOAL_STORAGE_KEY));

  return Number.isFinite(savedTarget) && savedTarget > 0
    ? savedTarget
    : DEFAULT_APPLY_GOAL_TARGET;
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
