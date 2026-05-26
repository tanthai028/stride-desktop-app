import { useEffect, useMemo, useRef, useState } from "react";
import {
  clearActiveApplicationSession,
  getActiveApplicationSession,
  saveActiveApplicationSession,
  saveApplicationSession,
} from "../../sessions/utils/applicationSessionsStore.js";
import { isApplied, isUnapplied } from "../utils/applyModeItemStatus.js";

function useApplyModeSession({ items, updateItem, deleteItem }) {
  const activeSession = getActiveApplicationSession();

  const sessionStartedAtRef = useRef(
    activeSession?.startedAt || new Date().toISOString(),
  );
  const hasSavedSessionRef = useRef(false);

  const [elapsedSeconds, setElapsedSeconds] = useState(
    Number(activeSession?.elapsedSeconds) || 0,
  );
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [skippedIds, setSkippedIds] = useState(activeSession?.skippedIds || []);
  const [completedItems, setCompletedItems] = useState(
    activeSession?.completedItems || [],
  );
  const [showAppliedRecent, setShowAppliedRecent] = useState(true);
  const [showSkippedRecent, setShowSkippedRecent] = useState(true);
  const [isMovingCard, setIsMovingCard] = useState(false);
  const [removedIds, setRemovedIds] = useState(activeSession?.removedIds || []);
  const [isRecentExpanded, setIsRecentExpanded] = useState(false);
  const [canShowFilteredEmpty, setCanShowFilteredEmpty] = useState(false);

  const queueItems = useMemo(
    () =>
      items.filter(
        (item) =>
          isUnapplied(item) &&
          !skippedIds.includes(item.id) &&
          !removedIds.includes(item.id),
      ),
    [items, skippedIds, removedIds],
  );

  const currentItem = queueItems[0] ?? null;

  const filteredCompletedItems = completedItems.filter((item) => {
    if (item.status === "Applied") return showAppliedRecent;
    if (item.status === "Skipped") return showSkippedRecent;
    return true;
  });

  const visibleRecentItems = isRecentExpanded
    ? filteredCompletedItems
    : filteredCompletedItems.slice(0, 1);

  const totalQueueCount = queueItems.length + completedItems.length;
  const completedCount = completedItems.length;
  const appliedCount = completedItems.filter(
    (item) => item.status === "Applied",
  ).length;
  const skippedCount = completedItems.filter(
    (item) => item.status === "Skipped",
  ).length;

  const progressText =
    totalQueueCount > 0 ? `${completedCount}/${totalQueueCount}` : "N/A";

  const shouldShowFilteredEmpty =
    completedItems.length > 0 && visibleRecentItems.length === 0;

  useEffect(() => {
    const cleanupShownListener = window.windowControls?.onApplyModeShown?.(
      () => {
        setIsTimerRunning(true);
      },
    );

    const cleanupHiddenListener = window.windowControls?.onApplyModeHidden?.(
      () => {
        setIsTimerRunning(false);
      },
    );

    return () => {
      cleanupShownListener?.();
      cleanupHiddenListener?.();
    };
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setElapsedSeconds((current) => (isTimerRunning ? current + 1 : current));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isTimerRunning]);

  useEffect(() => {
    setCompletedItems((currentCompletedItems) =>
      currentCompletedItems.filter((completedItem) => {
        const liveItem = items.find((item) => item.id === completedItem.id);

        if (!liveItem) return false;
        if (completedItem.status === "Applied") return isApplied(liveItem);

        return true;
      }),
    );
  }, [items]);

  useEffect(() => {
    if (!shouldShowFilteredEmpty) {
      setCanShowFilteredEmpty(false);
    }
  }, [shouldShowFilteredEmpty]);

  function getSessionPayload() {
    return {
      startedAt: sessionStartedAtRef.current,
      endedAt: new Date().toISOString(),
      durationSeconds: elapsedSeconds,
      appliedCount,
      skippedCount,
      totalCount: totalQueueCount,
      completedItems: completedItems.map((item) => ({
        id: item.id,
        company: item.company,
        role: item.role,
        status: item.status,
        appliedAt: item.appliedAt,
      })),
    };
  }

  function handleToggleTimer() {
    setIsTimerRunning((current) => !current);
  }

  function saveCurrentSession() {
    if (hasSavedSessionRef.current) return;

    const hasSessionWork = elapsedSeconds > 0 || completedItems.length > 0;
    if (!hasSessionWork) return;

    hasSavedSessionRef.current = true;
    saveApplicationSession(getSessionPayload());
    clearActiveApplicationSession();
  }

  function saveSessionForLater() {
    saveActiveApplicationSession({
      startedAt: sessionStartedAtRef.current,
      elapsedSeconds,
      skippedIds,
      completedItems,
      removedIds,
    });
  }

  function resetApplySession() {
    setIsApplying(false);
    setSkippedIds([]);
    setCompletedItems([]);
    setIsRecentExpanded(false);
    setShowAppliedRecent(true);
    setShowSkippedRecent(true);
    setIsMovingCard(false);
    setElapsedSeconds(0);
    setIsTimerRunning(false);
    setRemovedIds([]);
    sessionStartedAtRef.current = new Date().toISOString();
    hasSavedSessionRef.current = false;
    clearActiveApplicationSession();
  }

  function endAndSaveSession() {
    saveCurrentSession();
    resetApplySession();
  }

  function exitWithoutSavingSession() {
    resetApplySession();
  }

  function continueSessionLater() {
    setIsTimerRunning(false);
    saveSessionForLater();
  }

  function openJobUrl(item) {
    if (!item?.jobUrl) return;
    window.libraryApi?.openExternalUrl?.(item.jobUrl);
  }

  async function handleApply() {
    if (!currentItem?.jobUrl) return;

    setIsApplying(true);
    await window.libraryApi?.openExternalUrl?.(currentItem.jobUrl);
  }

  async function handleDone() {
    if (!currentItem || isMovingCard) return;

    setIsMovingCard(true);

    const appliedAt = new Date().toISOString();
    const completedItem = {
      ...currentItem,
      status: "Applied",
      appliedAt,
    };

    await updateItem(currentItem.id, completedItem);
    setIsApplying(false);

    window.setTimeout(() => {
      setCompletedItems((current) => [completedItem, ...current]);
      setIsMovingCard(false);
    }, 140);
  }

  function handleSkip() {
    if (!currentItem || isMovingCard) return;

    setIsMovingCard(true);

    const completedItem = {
      ...currentItem,
      status: "Skipped",
      appliedAt: new Date().toISOString(),
    };

    setSkippedIds((current) => [...current, currentItem.id]);
    setIsApplying(false);

    window.setTimeout(() => {
      setCompletedItems((current) => [completedItem, ...current]);
      setIsMovingCard(false);
    }, 140);
  }

  function handleUnskip() {
    if (isMovingCard) return;

    const lastSkipped = completedItems.find((item) => item.status === "Skipped");
    if (!lastSkipped) return;

    setIsMovingCard(true);
    setSkippedIds((current) => current.filter((id) => id !== lastSkipped.id));
    setIsApplying(false);

    window.setTimeout(() => {
      setCompletedItems((current) =>
        current.filter((item) => item.id !== lastSkipped.id),
      );
      setIsMovingCard(false);
    }, 140);
  }

  async function handleRemove() {
    if (!currentItem || isMovingCard) return;

    setIsMovingCard(true);
    setIsApplying(false);

    const removedId = currentItem.id;
    setRemovedIds((current) => [...current, removedId]);

    try {
      await deleteItem?.(removedId);
    } catch (error) {
      setRemovedIds((current) => current.filter((id) => id !== removedId));
      console.error("Failed to remove job from apply mode:", error);
    } finally {
      window.setTimeout(() => {
          setIsMovingCard(false);
      }, 140);
    }
  }

  return {
    elapsedSeconds,
    isTimerRunning,
    handleToggleTimer,
    saveCurrentSession,
    saveSessionForLater,
    endAndSaveSession,
    exitWithoutSavingSession,
    continueSessionLater,
    isApplying,
    isMovingCard,
    isRecentExpanded,
    setIsRecentExpanded,
    skippedIds,
    completedItems,
    filteredCompletedItems,
    visibleRecentItems,
    currentItem,
    queueItems,
    progressText,
    appliedCount,
    skippedCount,
    showAppliedRecent,
    setShowAppliedRecent,
    showSkippedRecent,
    setShowSkippedRecent,
    shouldShowFilteredEmpty,
    canShowFilteredEmpty,
    setCanShowFilteredEmpty,
    resetApplySession,
    openJobUrl,
    handleApply,
    handleDone,
    handleSkip,
    handleUnskip,
    canGoBack: completedItems.some((item) => item.status === "Skipped") && !isMovingCard,
    handleRemove,
  };
}

export default useApplyModeSession;
