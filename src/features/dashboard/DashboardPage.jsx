import { motion } from "framer-motion";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import LibraryFormModal from "../library/components/form/LibraryFormModal.jsx";
import PageShell from "../../components/page/PageShell.jsx";
import PageSection from "../../components/page/PageSection.jsx";
import DashboardPreview from "./components/DashboardPreview.jsx";
import NewGradFeedCard from "./components/NewGradFeedCard.jsx";
import { normalizeStatusValue } from "../library/constants/libraryStatuses.js";

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

function DashboardPage({ onAction, libraryStore, onHeaderDescriptionChange }) {
  const { items, loadError, addItem } = libraryStore;
  const [recentPeriod, setRecentPeriod] = useState("today");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalErrorMessage, setModalErrorMessage] = useState("");

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

  const dashboardData = useMemo(() => {
    const today = getStartOfToday();
    const weekStart = getWeekStart(new Date());

    const todayCount = items.filter((item) => {
      if (!isActuallyApplied(item)) return false;

      const appliedDate = getAppliedDate(item);
      return appliedDate ? isSameDay(appliedDate, today) : false;
    }).length;

    const recentItems = [...items]
      .filter((item) => {
        if (!isActuallyApplied(item)) return false;

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
      });

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

  function clearModalError() {
    setModalErrorMessage("");
  }

  function handleOpenAddModal() {
    clearModalError();
    setIsAddModalOpen(true);
  }

  function handleCloseAddModal() {
    clearModalError();
    setIsAddModalOpen(false);
  }

  async function handleAddItem(formValues) {
    if (formValues?.__clientValidationError) {
      setModalErrorMessage(formValues.__clientValidationError);
      return;
    }

    try {
      await addItem(formValues);
      handleCloseAddModal();
    } catch (error) {
      setModalErrorMessage(
        error?.message || "Something went wrong. Please try again.",
      );
    }
  }

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
              <div className="dashboard-top-card-grid">
                <DashboardPreview
                  variant="applyGoal"
                  todayApplicationCount={dashboardData.todayCount}
                />
                <DashboardPreview variant="timer" />
              </div>

              <DashboardPreview variant="quickLinks" />
            </div>

            <div className="dashboard-feed-column">
              <NewGradFeedCard />

              <DashboardPreview
                variant="recentApplications"
                recentItems={dashboardData.recentItems}
                recentPeriod={recentPeriod}
                onRecentPeriodClick={cycleRecentPeriod}
                onRecentApplicationsClick={() => onAction("library")}
                onAddApplicationClick={handleOpenAddModal}
              />
            </div>
          </div>
        </PageSection>
      </PageShell>
      <LibraryFormModal
        isOpen={isAddModalOpen}
        mode="add"
        item={null}
        errorMessage={modalErrorMessage}
        onClearError={clearModalError}
        onClose={handleCloseAddModal}
        onSubmit={handleAddItem}
        onDelete={undefined}
      />
    </motion.div>
  );
}

export default DashboardPage;
