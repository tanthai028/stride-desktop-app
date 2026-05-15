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
}) {
  useEffect(() => {
    setApplyModeOpacity(applyModeOpacity);
  }, [applyModeOpacity]);

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
      settingsOpen: showSettings,
    });

    if (!isClickThrough) {
      setApplyModeClickThrough(false);
      return undefined;
    }

    setApplyModeClickThrough(true);

    return () => {
      setApplyModeClickThrough(false);
    };
  }, [isClickThrough, showSettings]);
}

export default useApplyModeWindowEffects;
