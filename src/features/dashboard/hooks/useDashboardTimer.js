import { useEffect, useRef, useState } from "react";
import {
  playTimerAlarm,
  primeUiFeedbackAudio,
  stopTimerAlarm,
} from "../../../lib/uiFeedback.js";
import { TIMER_STORAGE_KEY } from "../constants/dashboardPreview.constants.js";
import { getSavedTimerMinutes } from "../utils/dashboardPreview.utils.js";

function useDashboardTimer() {
  const [timerMinutes, setTimerMinutes] = useState(getSavedTimerMinutes);
  const [timerSeconds, setTimerSeconds] = useState(
    () => getSavedTimerMinutes() * 60,
  );
  const [timerDraftMinutes, setTimerDraftMinutes] = useState("");
  const [timerDraftSeconds, setTimerDraftSeconds] = useState("");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isEditingTimer, setIsEditingTimer] = useState(false);

  const timerCardRef = useRef(null);
  const timerMinutesInputRef = useRef(null);
  const timerSecondsInputRef = useRef(null);
  const hasTimerFinishedRef = useRef(false);

  const timerTotalSeconds = Math.max(1, Math.round(timerMinutes * 60));
  const timerProgress = Math.min(
    100,
    Math.round((timerSeconds / timerTotalSeconds) * 100),
  );

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

  function startEditingTimer() {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;

    setTimerDraftMinutes(String(minutes));
    setTimerDraftSeconds(String(seconds).padStart(2, "0"));
    setIsEditingTimer(true);
  }

  function confirmTimerEdit(
    nextDraftMinutes = timerDraftMinutes,
    nextDraftSeconds = timerDraftSeconds,
  ) {
    const minutes = Number(nextDraftMinutes || 0);
    const seconds = Math.min(59, Number(nextDraftSeconds || 0));
    const nextSeconds = Math.max(1, Math.round(minutes * 60 + seconds));

    setTimerMinutes(nextSeconds / 60);
    setTimerSeconds(nextSeconds);
    setIsTimerRunning(false);
    setIsEditingTimer(false);
  }

  function cancelTimerEdit() {
    setIsEditingTimer(false);
  }

  function toggleTimer() {
    void primeUiFeedbackAudio();
    stopTimerAlarm();
    window.timerApi?.stopFlashTaskbar?.();
    setIsTimerRunning((current) => !current);
  }

  function resetTimer() {
    stopTimerAlarm();
    setIsTimerRunning(false);
    setTimerSeconds(timerTotalSeconds);
    window.timerApi?.stopFlashTaskbar?.();
    hasTimerFinishedRef.current = false;
  }

  return {
    timerCardRef,
    timerMinutesInputRef,
    timerSecondsInputRef,
    timerSeconds,
    timerTotalSeconds,
    timerProgress,
    timerDraftMinutes,
    timerDraftSeconds,
    isTimerRunning,
    isEditingTimer,
    setTimerDraftMinutes,
    setTimerDraftSeconds,
    startEditingTimer,
    confirmTimerEdit,
    cancelTimerEdit,
    toggleTimer,
    resetTimer,
  };
}

export default useDashboardTimer;
