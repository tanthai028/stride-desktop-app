import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  playTimerAlarm,
  primeUiFeedbackAudio,
  stopTimerAlarm,
} from "../../../lib/uiFeedback.js";
import ApplyGoalCard from "./ApplyGoalCard.jsx";
import QuickLinksCard from "./QuickLinksCard.jsx";
import RecentApplicationsCard from "./RecentApplicationsCard.jsx";
import TimerCard from "./TimerCard.jsx";
import {
  APPLY_GOAL_STORAGE_KEY,
  DEFAULT_APPLY_GOAL_TARGET,
  DEFAULT_RECENT_APPS_PER_PAGE,
  QUICK_LINKS_PER_PAGE,
  QUICK_LINKS_STORAGE_KEY,
  RECENT_APP_ROW_HEIGHT,
  TIMER_STORAGE_KEY,
} from "../constants/dashboardPreview.constants.js";
import {
  getSavedApplyGoalTarget,
  getSavedQuickLinks,
  getSavedTimerMinutes,
} from "../utils/dashboardPreview.utils.js";

function DashboardPreview({
  variant = "applyGoal",
  todayApplicationCount = 0,
  recentItems = [],
  recentPeriod = "today",
  onRecentPeriodClick,
  onRecentApplicationsClick,
  onAddApplicationClick,
}) {
  const [applyGoalTarget, setApplyGoalTarget] = useState(
    getSavedApplyGoalTarget,
  );
  const [applyGoalDraft, setApplyGoalDraft] = useState("");
  const [isEditingApplyGoal, setIsEditingApplyGoal] = useState(false);

  const [quickLinks, setQuickLinks] = useState(getSavedQuickLinks);
  const [quickLinksPage, setQuickLinksPage] = useState(1);
  const [isEditingLinks, setIsEditingLinks] = useState(false);

  const [recentPage, setRecentPage] = useState(1);
  const [recentAppsPerPage, setRecentAppsPerPage] = useState(
    DEFAULT_RECENT_APPS_PER_PAGE,
  );

  const [timerMinutes, setTimerMinutes] = useState(getSavedTimerMinutes);
  const [timerSeconds, setTimerSeconds] = useState(
    () => getSavedTimerMinutes() * 60,
  );
  const [timerDraftMinutes, setTimerDraftMinutes] = useState("");
  const [timerDraftSeconds, setTimerDraftSeconds] = useState("");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isEditingTimer, setIsEditingTimer] = useState(false);

  const applyGoalCardRef = useRef(null);
  const applyGoalInputRef = useRef(null);
  const hasTimerFinishedRef = useRef(false);
  const recentListRef = useRef(null);
  const timerCardRef = useRef(null);
  const timerMinutesInputRef = useRef(null);
  const timerSecondsInputRef = useRef(null);
  const quickLinksListRef = useRef(null);
  const recentCardRef = useRef(null);

  const timerTotalSeconds = Math.max(1, Math.round(timerMinutes * 60));
  const applyGoalProgress = Math.min(
    100,
    Math.round((todayApplicationCount / applyGoalTarget) * 100),
  );
  const timerProgress = Math.min(
    100,
    Math.round((timerSeconds / timerTotalSeconds) * 100),
  );
  const [quickLinksPerPage, setQuickLinksPerPage] =
    useState(QUICK_LINKS_PER_PAGE);

  useEffect(() => {
    localStorage.setItem(APPLY_GOAL_STORAGE_KEY, String(applyGoalTarget));
  }, [applyGoalTarget]);

  useEffect(() => {
    localStorage.setItem(QUICK_LINKS_STORAGE_KEY, JSON.stringify(quickLinks));
  }, [quickLinks]);

  useEffect(() => {
    localStorage.setItem(TIMER_STORAGE_KEY, String(timerMinutes));
  }, [timerMinutes]);

  useEffect(() => {
    if (!isTimerRunning) return undefined;

    const intervalId = window.setInterval(() => {
      setTimerSeconds((currentSeconds) => {
        if (currentSeconds <= 1) {
          setIsTimerRunning(false);
          return 0;
        }

        return currentSeconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isTimerRunning]);

  useEffect(() => {
    if (timerSeconds > 0) {
      hasTimerFinishedRef.current = false;
      window.timerApi?.stopFlashTaskbar?.();
      return;
    }

    if (hasTimerFinishedRef.current) return;

    hasTimerFinishedRef.current = true;
    setIsTimerRunning(false);
    setTimerSeconds(timerTotalSeconds);
    hasTimerFinishedRef.current = false;
    playTimerAlarm({ loopCount: 2 });
    window.timerApi?.flashTaskbar?.();
  }, [timerSeconds, timerTotalSeconds]);

  useEffect(() => {
    if (!isEditingTimer) return;

    timerMinutesInputRef.current?.focus();
    timerMinutesInputRef.current?.select();
  }, [isEditingTimer]);

  useEffect(() => {
    if (!isEditingApplyGoal) return;

    applyGoalInputRef.current?.focus();
    applyGoalInputRef.current?.select();
  }, [isEditingApplyGoal]);

  useEffect(() => {
    if (!isEditingTimer && !isEditingApplyGoal) return undefined;

    function handlePointerDown(event) {
      if (
        isEditingTimer &&
        timerCardRef.current &&
        !timerCardRef.current.contains(event.target)
      ) {
        cancelTimerEdit();
      }

      if (
        isEditingApplyGoal &&
        applyGoalCardRef.current &&
        !applyGoalCardRef.current.contains(event.target)
      ) {
        cancelApplyGoalEdit();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isEditingTimer, isEditingApplyGoal]);

  useLayoutEffect(() => {
    const listElement = recentListRef.current;
    const cardElement = recentCardRef.current;

    if (!listElement || !cardElement) return undefined;

    let animationFrameId = 0;

    const updateRecentAppsPerPage = () => {
      window.cancelAnimationFrame(animationFrameId);

      animationFrameId = window.requestAnimationFrame(() => {
        const availableHeight = listElement.clientHeight;

        const nextPerPage = Math.max(
          1,
          Math.floor(availableHeight / RECENT_APP_ROW_HEIGHT),
        );

        setRecentAppsPerPage((currentPerPage) =>
          currentPerPage === nextPerPage ? currentPerPage : nextPerPage,
        );
      });
    };

    updateRecentAppsPerPage();

    const resizeObserver = new ResizeObserver(updateRecentAppsPerPage);
    resizeObserver.observe(cardElement);
    resizeObserver.observe(listElement);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [variant, recentItems.length]);

  useEffect(() => {
    setRecentPage(1);
  }, [recentItems.length, recentAppsPerPage]);

  useEffect(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(quickLinks.length / quickLinksPerPage),
    );

    setQuickLinksPage((page) => Math.min(page, totalPages));
  }, [quickLinks.length, quickLinksPerPage]);

  useEffect(() => {
    const listElement = quickLinksListRef.current;
    if (!listElement) return undefined;

    const updateQuickLinksPerPage = () => {
      const itemHeight = isEditingLinks ? 112 : 56;
      const headerHeight = isEditingLinks ? 22 : 0;
      const availableHeight = listElement.clientHeight - headerHeight;

      const nextPerPage = Math.max(1, Math.floor(availableHeight / itemHeight));

      setQuickLinksPerPage(nextPerPage);
    };

    updateQuickLinksPerPage();

    const resizeObserver = new ResizeObserver(updateQuickLinksPerPage);
    resizeObserver.observe(listElement);

    return () => resizeObserver.disconnect();
  }, [variant, isEditingLinks]);

  const updateQuickLink = (linkId, field, value) => {
    setQuickLinks((links) =>
      links.map((link) =>
        link.id === linkId ? { ...link, [field]: value } : link,
      ),
    );
  };

  const addQuickLink = () => {
    setQuickLinks((links) => {
      const nextLinks = [
        ...links,
        {
          id: `link-${Date.now()}`,
          label: "New Link",
          url: "https://",
        },
      ];

      setQuickLinksPage(Math.ceil(nextLinks.length / quickLinksPerPage));
      return nextLinks;
    });

    setIsEditingLinks(true);
  };

  const removeQuickLink = (linkId) => {
    setQuickLinks((links) =>
      links.length > 1 ? links.filter((link) => link.id !== linkId) : links,
    );
  };

  const startEditingTimer = () => {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;

    setTimerDraftMinutes(String(minutes));
    setTimerDraftSeconds(String(seconds).padStart(2, "0"));
    setIsEditingTimer(true);
  };

  const confirmTimerEdit = (
    nextDraftMinutes = timerDraftMinutes,
    nextDraftSeconds = timerDraftSeconds,
  ) => {
    const minutes = Number(nextDraftMinutes || 0);
    const seconds = Math.min(59, Number(nextDraftSeconds || 0));
    const nextSeconds = Math.max(1, Math.round(minutes * 60 + seconds));

    setTimerMinutes(nextSeconds / 60);
    setTimerSeconds(nextSeconds);
    setIsTimerRunning(false);
    setIsEditingTimer(false);
  };

  const cancelTimerEdit = () => {
    setIsEditingTimer(false);
  };

  const toggleTimer = () => {
    void primeUiFeedbackAudio();
    stopTimerAlarm();
    window.timerApi?.stopFlashTaskbar?.();
    setIsTimerRunning((current) => !current);
  };

  const resetTimer = () => {
    stopTimerAlarm();
    setIsTimerRunning(false);
    setTimerSeconds(timerTotalSeconds);
    window.timerApi?.stopFlashTaskbar?.();
    hasTimerFinishedRef.current = false;
  };

  const startEditingApplyGoal = () => {
    setApplyGoalDraft(String(applyGoalTarget));
    setIsEditingApplyGoal(true);
  };

  const confirmApplyGoalEdit = () => {
    const nextGoal = Number(applyGoalDraft);

    setApplyGoalTarget(
      Number.isFinite(nextGoal) && nextGoal > 0
        ? nextGoal
        : DEFAULT_APPLY_GOAL_TARGET,
    );

    setIsEditingApplyGoal(false);
  };

  const cancelApplyGoalEdit = () => {
    setApplyGoalDraft(String(applyGoalTarget));
    setIsEditingApplyGoal(false);
  };

  if (variant === "timer") {
    return (
      <TimerCard
        timerCardRef={timerCardRef}
        timerMinutesInputRef={timerMinutesInputRef}
        timerSecondsInputRef={timerSecondsInputRef}
        timerSeconds={timerSeconds}
        timerTotalSeconds={timerTotalSeconds}
        timerProgress={timerProgress}
        timerDraftMinutes={timerDraftMinutes}
        timerDraftSeconds={timerDraftSeconds}
        isEditingTimer={isEditingTimer}
        isTimerRunning={isTimerRunning}
        onStartEditing={startEditingTimer}
        onCancelEdit={cancelTimerEdit}
        onConfirmEdit={confirmTimerEdit}
        onMinutesDraftChange={setTimerDraftMinutes}
        onSecondsDraftChange={setTimerDraftSeconds}
        onToggleTimer={toggleTimer}
        onResetTimer={resetTimer}
      />
    );
  }

  if (variant === "recentApplications") {
    return (
      <RecentApplicationsCard
        recentCardRef={recentCardRef}
        recentItems={recentItems}
        recentPeriod={recentPeriod}
        recentPage={recentPage}
        recentAppsPerPage={recentAppsPerPage}
        recentListRef={recentListRef}
        onRecentPeriodClick={onRecentPeriodClick}
        onRecentApplicationsClick={onRecentApplicationsClick}
        onAddApplicationClick={onAddApplicationClick}
        onPageChange={setRecentPage}
      />
    );
  }

  if (variant === "quickLinks") {
    return (
      <QuickLinksCard
        quickLinks={quickLinks}
        currentPage={quickLinksPage}
        quickLinksPerPage={quickLinksPerPage}
        quickLinksListRef={quickLinksListRef}
        isEditingLinks={isEditingLinks}
        onAddLink={addQuickLink}
        onUpdateLink={updateQuickLink}
        onRemoveLink={removeQuickLink}
        onPageChange={setQuickLinksPage}
        onStartEditing={() => setIsEditingLinks(true)}
        onStopEditing={() => setIsEditingLinks(false)}
      />
    );
  }

  return (
    <ApplyGoalCard
      applyGoalCardRef={applyGoalCardRef}
      applyGoalInputRef={applyGoalInputRef}
      todayApplicationCount={todayApplicationCount}
      applyGoalTarget={applyGoalTarget}
      applyGoalProgress={applyGoalProgress}
      applyGoalDraft={applyGoalDraft}
      isEditingApplyGoal={isEditingApplyGoal}
      onStartEditing={startEditingApplyGoal}
      onDraftChange={setApplyGoalDraft}
      onConfirmEdit={confirmApplyGoalEdit}
      onCancelEdit={cancelApplyGoalEdit}
    />
  );
}

export default DashboardPreview;
