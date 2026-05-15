import { useEffect, useMemo, useState } from "react";
import { isApplied, isUnapplied } from "../utils/applyModeItemStatus.js";

function useApplyModeSession({ items, updateItem, deleteItem }) {
  const [isApplying, setIsApplying] = useState(false);
  const [skippedIds, setSkippedIds] = useState([]);
  const [completedItems, setCompletedItems] = useState([]);
  const [recentPage, setRecentPage] = useState(0);
  const [showAppliedRecent, setShowAppliedRecent] = useState(true);
  const [showSkippedRecent, setShowSkippedRecent] = useState(true);
  const [isMovingCard, setIsMovingCard] = useState(false);
  const [removedIds, setRemovedIds] = useState([]);
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
    setRecentPage(0);
  }, [showAppliedRecent, showSkippedRecent]);

  useEffect(() => {
    if (!shouldShowFilteredEmpty) {
      setCanShowFilteredEmpty(false);
    }
  }, [shouldShowFilteredEmpty]);

  function resetApplySession() {
    setIsApplying(false);
    setSkippedIds([]);
    setCompletedItems([]);
    setRecentPage(0);
    setIsRecentExpanded(false);
    setShowAppliedRecent(true);
    setShowSkippedRecent(true);
    setIsMovingCard(false);
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
      setRecentPage(0);
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
      setRecentPage(0);
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
        setRecentPage(0);
        setIsMovingCard(false);
      }, 140);
    }
  }

  return {
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
    handleRemove,
  };
}

export default useApplyModeSession;
