import { useEffect, useRef } from "react";
import {
  primeUiFeedbackAudio,
  triggerHoverFeedback,
} from "../lib/uiFeedback.js";

const INTERACTIVE_SELECTOR = [
  ".interactive",
  ".interactive-input",
  ".interactive-toggle",
  "[role='button']",
  "[role='option']",
  "button",
].join(",");

function isEligibleTarget(element) {
  if (!element) return false;

  if (
    element.matches(
      "[disabled], [aria-disabled='true'], [data-ui-silent='true']",
    )
  ) {
    return false;
  }

  return true;
}

export default function useUiFeedback(hoverSoundProfile = "click") {
  const lastHoveredElementRef = useRef(null);
  const hasPrimedAudioRef = useRef(false);

  useEffect(() => {
    if (hoverSoundProfile === "off") return;

    function getTarget(target) {
      if (!(target instanceof Element)) return null;

      const interactiveElement = target.closest(INTERACTIVE_SELECTOR);

      if (!interactiveElement || !isEligibleTarget(interactiveElement)) {
        return null;
      }

      return interactiveElement;
    }

    function handlePointerOver(event) {
      const target = getTarget(event.target);

      if (!target) {
        lastHoveredElementRef.current = null;
        return;
      }

      if (lastHoveredElementRef.current === target) return;

      lastHoveredElementRef.current = target;

      if (!hasPrimedAudioRef.current) {
        primeUiFeedbackAudio();
        hasPrimedAudioRef.current = true;
      }

      triggerHoverFeedback(hoverSoundProfile);
    }

    function handlePointerLeave(event) {
      const target = getTarget(event.target);

      if (!target) return;

      if (lastHoveredElementRef.current === target) {
        lastHoveredElementRef.current = null;
      }
    }

    window.addEventListener("pointerover", handlePointerOver, true);
    window.addEventListener("pointerleave", handlePointerLeave, true);

    return () => {
      window.removeEventListener("pointerover", handlePointerOver, true);
      window.removeEventListener("pointerleave", handlePointerLeave, true);
    };
  }, [hoverSoundProfile]);
}
