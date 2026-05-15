import { useEffect, useRef, useState } from "react";
import {
  APPLY_GOAL_STORAGE_KEY,
  DEFAULT_APPLY_GOAL_TARGET,
} from "../constants/dashboardPreview.constants.js";
import { getSavedApplyGoalTarget } from "../utils/dashboardPreview.utils.js";

function useApplyGoal(todayApplicationCount) {
  const [applyGoalTarget, setApplyGoalTarget] = useState(
    getSavedApplyGoalTarget,
  );
  const [applyGoalDraft, setApplyGoalDraft] = useState("");
  const [isEditingApplyGoal, setIsEditingApplyGoal] = useState(false);

  const applyGoalCardRef = useRef(null);
  const applyGoalInputRef = useRef(null);

  const applyGoalProgress = Math.min(
    100,
    Math.round((todayApplicationCount / applyGoalTarget) * 100),
  );

  useEffect(() => {
    localStorage.setItem(APPLY_GOAL_STORAGE_KEY, String(applyGoalTarget));
  }, [applyGoalTarget]);

  useEffect(() => {
    if (!isEditingApplyGoal) return;

    applyGoalInputRef.current?.focus();
    applyGoalInputRef.current?.select();
  }, [isEditingApplyGoal]);

  function startEditingApplyGoal() {
    setApplyGoalDraft(String(applyGoalTarget));
    setIsEditingApplyGoal(true);
  }

  function confirmApplyGoalEdit() {
    const nextGoal = Number(applyGoalDraft);

    setApplyGoalTarget(
      Number.isFinite(nextGoal) && nextGoal > 0
        ? nextGoal
        : DEFAULT_APPLY_GOAL_TARGET,
    );

    setIsEditingApplyGoal(false);
  }

  function cancelApplyGoalEdit() {
    setApplyGoalDraft(String(applyGoalTarget));
    setIsEditingApplyGoal(false);
  }

  return {
    applyGoalCardRef,
    applyGoalInputRef,
    applyGoalTarget,
    applyGoalProgress,
    applyGoalDraft,
    isEditingApplyGoal,
    setApplyGoalDraft,
    startEditingApplyGoal,
    confirmApplyGoalEdit,
    cancelApplyGoalEdit,
  };
}

export default useApplyGoal;
