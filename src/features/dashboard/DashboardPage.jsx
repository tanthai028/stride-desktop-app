import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import PageShell from "../../components/page/PageShell.jsx";
import PageSection from "../../components/page/PageSection.jsx";
import DashboardPreview from "./components/DashboardPreview.jsx";
import useLibraryItems from "../library/hooks/useLibraryItems.js";

function getStartOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function getWeekStart(date) {
  const weekStart = new Date(date);
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  return weekStart;
}

function getAppliedDate(item) {
  const appliedDate = item?.appliedAt ? new Date(item.appliedAt) : null;

  return appliedDate && !Number.isNaN(appliedDate.getTime())
    ? appliedDate
    : null;
}

function isSameDay(date, targetDate) {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate.getTime() === targetDate.getTime();
}

function DashboardPage({ settings, onAction }) {
  const { items, loadError } = useLibraryItems(settings.resetVersion);
  const [recentPeriod, setRecentPeriod] = useState("today");

  const dashboardData = useMemo(() => {
    const today = getStartOfToday();
    const weekStart = getWeekStart(new Date());

    const todayCount = items.filter((item) => {
      const appliedDate = getAppliedDate(item);
      return appliedDate ? isSameDay(appliedDate, today) : false;
    }).length;

    const recentItems = [...items]
      .filter((item) => {
        const appliedDate = getAppliedDate(item);

        if (!appliedDate) return false;

        return recentPeriod === "today"
          ? isSameDay(appliedDate, today)
          : appliedDate >= weekStart;
      })
      .sort((firstItem, secondItem) => {
        const firstDate = getAppliedDate(firstItem)?.getTime() ?? 0;
        const secondDate = getAppliedDate(secondItem)?.getTime() ?? 0;
        return secondDate - firstDate;
      })
      .slice(0, 6);

    return {
      todayCount,
      recentItems,
    };
  }, [items, recentPeriod]);

  function cycleRecentPeriod() {
    setRecentPeriod((currentPeriod) =>
      currentPeriod === "today" ? "week" : "today",
    );
  }

  return (
    <motion.div
      initial={{ y: 14 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.45 }}
      className="flex min-h-0 flex-1 flex-col"
    >
      <PageShell
        eyebrow="🏠 Dashboard"
        title="Overview"
        description="Track today's application push, quick links, and recent activity."
      >
        {loadError ? (
          <div className="library-form-error">{loadError}</div>
        ) : null}

        <PageSection className="dashboard-overview-section">
          <div className="dashboard-overview-grid">
            <div className="dashboard-overview-left">
              <div className="dashboard-top-card-grid">
                <DashboardPreview variant="timer" />

                <DashboardPreview
                  variant="applyGoal"
                  todayApplicationCount={dashboardData.todayCount}
                />
              </div>

              <DashboardPreview variant="quickLinks" />
            </div>

            <DashboardPreview
              variant="recentApplications"
              recentItems={dashboardData.recentItems}
              recentPeriod={recentPeriod}
              onRecentPeriodClick={cycleRecentPeriod}
              onRecentApplicationsClick={() => onAction("library")}
            />
          </div>
        </PageSection>
      </PageShell>
    </motion.div>
  );
}

export default DashboardPage;
