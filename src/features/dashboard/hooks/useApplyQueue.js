import { useMemo } from "react";
import { isUnapplied } from "../../apply-mode/utils/applyModeItemStatus.js";

const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };

function getPriorityRank(item) {
  const value = String(item?.priority ?? "")
    .trim()
    .toLowerCase();
  return PRIORITY_RANK[value] ?? PRIORITY_RANK.medium;
}

function getRecencyTimestamp(item) {
  const candidate = item?.appliedAt || item?.createdAt || item?.updatedAt;
  const parsed = candidate ? new Date(candidate).getTime() : NaN;
  return Number.isNaN(parsed) ? 0 : parsed;
}

function sortQueueItems(items) {
  return [...items].sort((a, b) => {
    const priorityDelta = getPriorityRank(a) - getPriorityRank(b);
    if (priorityDelta !== 0) return priorityDelta;
    return getRecencyTimestamp(b) - getRecencyTimestamp(a);
  });
}

function useApplyQueue({ items, queueSize }) {
  const unappliedSorted = useMemo(
    () => sortQueueItems(items.filter(isUnapplied)),
    [items],
  );

  const safeSize = Math.max(1, Number(queueSize) || 6);
  const visibleQueue = unappliedSorted.slice(0, safeSize);

  return {
    visibleQueue,
    totalUnapplied: unappliedSorted.length,
  };
}

export default useApplyQueue;
