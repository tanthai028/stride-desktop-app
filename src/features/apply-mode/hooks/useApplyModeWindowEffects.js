import { useEffect } from "react";
import {
  setApplyModeClickThrough,
  setApplyModeHitboxes,
  setApplyModeOpacity,
} from "../../../lib/windowControls.js";

function useApplyModeWindowEffects({
  applyModeScale,
  applyModeOpacity,
  isClickThrough,
  showSettings,
  showExitDialog,
}) {
  const isModalOpen = showSettings || showExitDialog;

  useEffect(() => {
    setApplyModeOpacity(isModalOpen ? 100 : applyModeOpacity);
  }, [applyModeOpacity, isModalOpen]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${16 * (applyModeScale / 50)}px`;
    window.windowControls?.setApplyModeScale?.(applyModeScale);

    return () => {
      document.documentElement.style.fontSize = "";
    };
  }, [applyModeScale]);

  useEffect(() => {
    setApplyModeHitboxes({
      headerHeight: 42,
      settingsOpen: isModalOpen,
    });

    if (!isClickThrough || isModalOpen) {
      setApplyModeClickThrough(false);
      return undefined;
    }

    setApplyModeClickThrough(true);

    return () => {
      setApplyModeClickThrough(false);
    };
  }, [isClickThrough, isModalOpen]);
}

export default useApplyModeWindowEffects;
