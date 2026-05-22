import { useEffect, useState } from "react";
import ApplyGoalCard from "./ApplyGoalCard.jsx";
import QuickLinksCard from "./QuickLinksCard.jsx";
import RecentApplicationsCard from "./RecentApplicationsCard.jsx";
import TimerCard from "./TimerCard.jsx";
import useApplyGoal from "../hooks/useApplyGoal.js";
import useDashboardTimer from "../hooks/useDashboardTimer.js";
import useQuickLinks from "../hooks/useQuickLinks.js";
import useRecentAppsPagination from "../hooks/useRecentAppsPagination.js";

function DashboardPreview({
  variant = "applyGoal",
  todayApplicationCount = 0,
  recentItems = [],
  recentPeriod = "today",
  onRecentPeriodClick,
  onRecentApplicationsClick,
  onAddApplicationClick,
}) {
  const [isEditingLinks, setIsEditingLinks] = useState(false);

  const applyGoal = useApplyGoal(todayApplicationCount);
  const timer = useDashboardTimer();
  const quickLinks = useQuickLinks({ isEditingLinks });
  const recentApps = useRecentAppsPagination({ variant, recentItems });

  const isEditingAny = timer.isEditingTimer || applyGoal.isEditingApplyGoal;

  useEffect(() => {
    if (!isEditingAny) return undefined;

    // Refs and setter-based functions are stable across renders, so closing
    // over the current timer/applyGoal objects is safe here.
    function handlePointerDown(event) {
      if (
        timer.isEditingTimer &&
        timer.timerCardRef.current &&
        !timer.timerCardRef.current.contains(event.target)
      ) {
        timer.cancelTimerEdit();
      }

      if (
        applyGoal.isEditingApplyGoal &&
        applyGoal.applyGoalCardRef.current &&
        !applyGoal.applyGoalCardRef.current.contains(event.target)
      ) {
        applyGoal.cancelApplyGoalEdit();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditingAny]);

  if (variant === "timer") {
    return (
      <TimerCard
        timerCardRef={timer.timerCardRef}
        timerMinutesInputRef={timer.timerMinutesInputRef}
        timerSecondsInputRef={timer.timerSecondsInputRef}
        timerSeconds={timer.timerSeconds}
        timerTotalSeconds={timer.timerTotalSeconds}
        timerProgress={timer.timerProgress}
        timerDraftMinutes={timer.timerDraftMinutes}
        timerDraftSeconds={timer.timerDraftSeconds}
        isEditingTimer={timer.isEditingTimer}
        isTimerRunning={timer.isTimerRunning}
        onStartEditing={timer.startEditingTimer}
        onCancelEdit={timer.cancelTimerEdit}
        onConfirmEdit={timer.confirmTimerEdit}
        onMinutesDraftChange={timer.setTimerDraftMinutes}
        onSecondsDraftChange={timer.setTimerDraftSeconds}
        onToggleTimer={timer.toggleTimer}
        onResetTimer={timer.resetTimer}
      />
    );
  }

  if (variant === "recentApplications") {
    return (
      <RecentApplicationsCard
        recentCardRef={recentApps.recentCardRef}
        recentItems={recentItems}
        recentPeriod={recentPeriod}
        recentPage={recentApps.recentPage}
        recentAppsPerPage={recentApps.recentAppsPerPage}
        recentListRef={recentApps.recentListRef}
        onRecentPeriodClick={onRecentPeriodClick}
        onRecentApplicationsClick={onRecentApplicationsClick}
        onAddApplicationClick={onAddApplicationClick}
        onPageChange={recentApps.setRecentPage}
      />
    );
  }

  if (variant === "quickLinks") {
    return (
      <QuickLinksCard
        quickLinks={quickLinks.quickLinks}
        currentPage={quickLinks.quickLinksPage}
        quickLinksPerPage={quickLinks.quickLinksPerPage}
        quickLinksListRef={quickLinks.quickLinksListRef}
        isEditingLinks={isEditingLinks}
        onAddLink={() => {
          quickLinks.addQuickLink();
          setIsEditingLinks(true);
        }}
        onUpdateLink={quickLinks.updateQuickLink}
        onRemoveLink={quickLinks.removeQuickLink}
        onPageChange={quickLinks.setQuickLinksPage}
        onStartEditing={() => setIsEditingLinks(true)}
        onStopEditing={() => setIsEditingLinks(false)}
      />
    );
  }

  return (
    <ApplyGoalCard
      applyGoalCardRef={applyGoal.applyGoalCardRef}
      applyGoalInputRef={applyGoal.applyGoalInputRef}
      todayApplicationCount={todayApplicationCount}
      applyGoalTarget={applyGoal.applyGoalTarget}
      applyGoalProgress={applyGoal.applyGoalProgress}
      applyGoalDraft={applyGoal.applyGoalDraft}
      isEditingApplyGoal={applyGoal.isEditingApplyGoal}
      onStartEditing={applyGoal.startEditingApplyGoal}
      onDraftChange={applyGoal.setApplyGoalDraft}
      onConfirmEdit={applyGoal.confirmApplyGoalEdit}
      onCancelEdit={applyGoal.cancelApplyGoalEdit}
    />
  );
}

export default DashboardPreview;
