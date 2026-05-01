import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import PageShell from "../../components/page/PageShell.jsx";
import PageSection from "../../components/page/PageSection.jsx";
import DashboardPreview from "./components/DashboardPreview.jsx";
import SummaryCards from "./components/SummaryCards.jsx";
import useLibraryItems from "../library/hooks/useLibraryItems.js";

const SNAPSHOT_PERIODS = ["today", "week", "total"];

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
  const [snapshotPeriod, setSnapshotPeriod] = useState("today");

  const dashboardData = useMemo(() => {
    const today = getStartOfToday();
    const weekStart = getWeekStart(new Date());

    const todayCount = items.filter((item) => {
      const appliedDate = getAppliedDate(item);
      return appliedDate ? isSameDay(appliedDate, today) : false;
    }).length;

    const weekCount = items.filter((item) => {
      const appliedDate = getAppliedDate(item);
      return appliedDate ? appliedDate >= weekStart : false;
    }).length;

    const totalCount = items.length;

    const snapshotCardsByPeriod = {
      today: {
        label: "Jobs Applied",
        title: todayCount,
        description: "Today",
        tone: "pink",
      },
      week: {
        label: "Jobs Applied",
        title: weekCount,
        description: "This Week",
        tone: "violet",
      },
      total: {
        label: "Jobs Applied",
        title: totalCount,
        description: "Total",
        tone: "sky",
      },
    };

    const recentItems = [...items]
      .sort((firstItem, secondItem) => {
        const firstDate = getAppliedDate(firstItem)?.getTime() ?? 0;
        const secondDate = getAppliedDate(secondItem)?.getTime() ?? 0;
        return secondDate - firstDate;
      })
      .slice(0, 6);

    return {
      snapshotCard: snapshotCardsByPeriod[snapshotPeriod],
      todayCount,
      recentItems,
    };
  }, [items, snapshotPeriod]);

  function cycleSnapshotPeriod() {
    setSnapshotPeriod((currentPeriod) => {
      const currentIndex = SNAPSHOT_PERIODS.indexOf(currentPeriod);
      const nextIndex = (currentIndex + 1) % SNAPSHOT_PERIODS.length;
      return SNAPSHOT_PERIODS[nextIndex];
    });
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
                <SummaryCards
                  cards={[
                    {
                      ...dashboardData.snapshotCard,
                      onClick: cycleSnapshotPeriod,
                    },
                  ]}
                />

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
              onRecentApplicationsClick={() => onAction("library")}
            />
          </div>
        </PageSection>
      </PageShell>
    </motion.div>
  );
}

export default DashboardPage;
