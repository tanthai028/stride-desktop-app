import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import PageShell from "../../components/page/PageShell.jsx";
import PageSection from "../../components/page/PageSection.jsx";
import SummaryCards from "./components/SummaryCards.jsx";
import DashboardPreview from "./components/DashboardPreview.jsx";
import useLibraryItems from "../library/hooks/useLibraryItems.js";

function getWeekStart(date) {
  const weekStart = new Date(date);
  const day = weekStart.getDay();
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - day);
  return weekStart;
}

function DashboardPage({ settings, onAction }) {
  const { items, loadError } = useLibraryItems(settings.resetVersion);
  const [snapshotPeriod, setSnapshotPeriod] = useState("today");

  const dashboardData = useMemo(() => {
    const total = items.length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCount = items.filter((item) => {
      if (!item.appliedAt) return false;

      const appliedDate = new Date(item.appliedAt);
      if (Number.isNaN(appliedDate.getTime())) return false;

      appliedDate.setHours(0, 0, 0, 0);
      return appliedDate.getTime() === today.getTime();
    }).length;

    const thisWeekStart = getWeekStart(new Date());

    const thisWeek = items.filter((item) => {
      if (!item.appliedAt) return false;

      const appliedDate = new Date(item.appliedAt);

      return (
        !Number.isNaN(appliedDate.getTime()) && appliedDate >= thisWeekStart
      );
    }).length;

    const activePeriodCount =
      snapshotPeriod === "today" ? todayCount : thisWeek;

    const summaryCards = [
      {
        label: "Total",
        title: total,
        description: "Applications tracked",
        tone: "sky",
      },
      {
        label: snapshotPeriod === "today" ? "Today" : "This Week",
        title: activePeriodCount,
        description:
          snapshotPeriod === "today"
            ? "Submitted today"
            : "Submitted this week",
        tone: snapshotPeriod === "today" ? "pink" : "violet",
        onClick: () =>
          setSnapshotPeriod((current) =>
            current === "today" ? "week" : "today",
          ),
      },
    ];

    const recentItems = [...items]
      .sort((a, b) => new Date(b.appliedAt || 0) - new Date(a.appliedAt || 0))
      .slice(0, 6);

    return {
      summaryCards,
      recentItems,
    };
  }, [items, snapshotPeriod]);

  return (
    <motion.div
      initial={{ y: 14 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.45 }}
      className="flex min-h-0 flex-1 flex-col"
    >
      <PageShell>
        {loadError ? (
          <div className="library-form-error">{loadError}</div>
        ) : null}

        <PageSection className="dashboard-overview-section">
          <div className="dashboard-overview-grid">
            <div className="dashboard-overview-left">
              <SummaryCards cards={dashboardData.summaryCards} />

              <DashboardPreview variant="dailyGoal" />
            </div>

            <DashboardPreview
              variant="recentApplications"
              recentItems={dashboardData.recentItems}
              onRecentApplicationsClick={() => onAction("library")}
            />
          </div>
        </PageSection>
      </PageShell>
    </motion.div>
  );
}

export default DashboardPage;
