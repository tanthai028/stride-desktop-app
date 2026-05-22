import { motion } from "framer-motion";
import { useEffect, useLayoutEffect, useMemo } from "react";
import PageShell from "../../components/page/PageShell.jsx";
import PageSection from "../../components/page/PageSection.jsx";
import DashboardPreview from "./components/DashboardPreview.jsx";
import NewGradFeedCard from "./components/NewGradFeedCard.jsx";
import SessionSummaryCard from "./components/SessionSummaryCard.jsx";
import { normalizeStatusValue } from "../library/constants/libraryStatuses.js";

function getStartOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function getAppliedDate(item) {
  const appliedDate = item?.appliedAt ? new Date(item.appliedAt) : null;

  return appliedDate && !Number.isNaN(appliedDate.getTime())
    ? appliedDate
    : null;
}

function isActuallyApplied(item) {
  return normalizeStatusValue(item?.status) === "applied";
}

function isSameDay(date, targetDate) {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate.getTime() === targetDate.getTime();
}

function formatLastUpdatedLabel(items) {
  if (!items || items.length === 0) return null;

  let latestDate = null;

  for (const item of items) {
    const candidateDateStr = item.updatedAt || item.createdAt;
    if (!candidateDateStr) continue;
    const d = new Date(candidateDateStr);
    if (!Number.isNaN(d.getTime()) && (!latestDate || d > latestDate)) {
      latestDate = d;
    }
  }

  if (!latestDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const itemDay = new Date(latestDate);
  itemDay.setHours(0, 0, 0, 0);

  if (itemDay.getTime() === today.getTime()) return "Last Updated: Today";
  if (itemDay.getTime() === yesterday.getTime()) return "Last Updated: Yesterday";

  return `Last Updated: ${latestDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })}`;
}

function DashboardPage({ libraryStore, onHeaderDescriptionChange }) {
  const { items, loadError } = libraryStore;

  const lastUpdatedDescription = useMemo(
    () => formatLastUpdatedLabel(items),
    [items],
  );

  useLayoutEffect(() => {
    onHeaderDescriptionChange?.(lastUpdatedDescription);
  }, [lastUpdatedDescription, onHeaderDescriptionChange]);

  useEffect(() => {
    return () => {
      onHeaderDescriptionChange?.(null);
    };
  }, []);

  const todayCount = useMemo(() => {
    const today = getStartOfToday();
    return items.filter((item) => {
      if (!isActuallyApplied(item)) return false;
      const appliedDate = getAppliedDate(item);
      return appliedDate ? isSameDay(appliedDate, today) : false;
    }).length;
  }, [items]);

  return (
    <motion.div
      initial={{ y: 14, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="flex min-h-0 flex-1 flex-col"
      style={{ willChange: "opacity, transform", isolation: "isolate" }}
    >
      <PageShell>
        {loadError ? (
          <div className="library-form-error">{loadError}</div>
        ) : null}

        <PageSection className="dashboard-overview-section">
          <div className="dashboard-overview-grid">
            <div className="dashboard-overview-left">
              <div className="dashboard-top-card-grid">
                <DashboardPreview
                  variant="applyGoal"
                  todayApplicationCount={todayCount}
                />
                <DashboardPreview variant="timer" />
              </div>

              <SessionSummaryCard />

              <DashboardPreview variant="quickLinks" />
            </div>

            <div className="dashboard-feed-column">
              <NewGradFeedCard
                libraryItems={items}
                onSaveJob={libraryStore.addItem}
              />
            </div>
          </div>
        </PageSection>
      </PageShell>
    </motion.div>
  );
}

export default DashboardPage;
