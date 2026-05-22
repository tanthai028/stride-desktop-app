import { useCallback, useEffect, useRef, useState } from "react";

const SCROLLBAR_HIDE_DELAY_MS = 650;
const MIN_THUMB_HEIGHT_PX = 44;

function areScrollMetricsEqual(leftMetrics, rightMetrics) {
  return (
    leftMetrics.isScrollable === rightMetrics.isScrollable &&
    leftMetrics.thumbHeight === rightMetrics.thumbHeight &&
    leftMetrics.thumbTop === rightMetrics.thumbTop
  );
}

function usePageScrollbar() {
  const scrollRef = useRef(null);
  const hideTimerRef = useRef(null);
  const frameRef = useRef(null);
  const isPointerInsideRef = useRef(false);

  const dragStateRef = useRef({
    isDragging: false,
    pointerId: null,
    thumbOffsetY: 0,
    trackRect: null,
  });

  const latestMetricsRef = useRef({
    isScrollable: false,
    thumbHeight: 0,
    thumbTop: 0,
  });

  const [isScrollbarVisible, setIsScrollbarVisible] = useState(false);
  const [scrollMetrics, setScrollMetrics] = useState(latestMetricsRef.current);

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const cancelScheduledFrame = useCallback(() => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  const scheduleHide = useCallback(() => {
    clearHideTimer();

    hideTimerRef.current = window.setTimeout(() => {
      if (!isPointerInsideRef.current && !dragStateRef.current.isDragging) {
        setIsScrollbarVisible(false);
      }
    }, SCROLLBAR_HIDE_DELAY_MS);
  }, [clearHideTimer]);

  const readScrollMetrics = useCallback(() => {
    const element = scrollRef.current;

    if (!element) return null;

    const { scrollTop, scrollHeight, clientHeight } = element;
    const isScrollable = scrollHeight > clientHeight + 1;

    if (!isScrollable) {
      return {
        isScrollable: false,
        thumbHeight: 0,
        thumbTop: 0,
      };
    }

    const trackHeight = clientHeight;
    const rawThumbHeight = (clientHeight / scrollHeight) * trackHeight;
    const thumbHeight = Math.max(MIN_THUMB_HEIGHT_PX, rawThumbHeight);
    const maxThumbTop = Math.max(0, trackHeight - thumbHeight);
    const maxScrollTop = Math.max(1, scrollHeight - clientHeight);
    const thumbTop = (scrollTop / maxScrollTop) * maxThumbTop;

    return {
      isScrollable: true,
      thumbHeight,
      thumbTop,
    };
  }, []);

  const commitScrollMetrics = useCallback((nextMetrics) => {
    if (!nextMetrics) return false;

    const previousMetrics = latestMetricsRef.current;
    latestMetricsRef.current = nextMetrics;

    if (!areScrollMetricsEqual(previousMetrics, nextMetrics)) {
      setScrollMetrics(nextMetrics);
    }

    return nextMetrics.isScrollable;
  }, []);

  const runScrollMeasurement = useCallback(
    ({ reveal = false, hideAfterReveal = false } = {}) => {
      const nextMetrics = readScrollMetrics();
      const isScrollable = commitScrollMetrics(nextMetrics);

      if (!isScrollable) {
        setIsScrollbarVisible(false);
        clearHideTimer();
        return;
      }

      if (reveal) {
        setIsScrollbarVisible(true);

        if (hideAfterReveal && !isPointerInsideRef.current) {
          scheduleHide();
        } else {
          clearHideTimer();
        }
      }
    },
    [clearHideTimer, commitScrollMetrics, readScrollMetrics, scheduleHide],
  );

  const scheduleScrollMeasurement = useCallback(
    (options = {}) => {
      cancelScheduledFrame();

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        runScrollMeasurement(options);
      });
    },
    [cancelScheduledFrame, runScrollMeasurement],
  );

  const scrollToThumbPosition = useCallback(
    (clientY, trackRect, thumbOffsetY) => {
      const element = scrollRef.current;
      const metrics = latestMetricsRef.current;

      if (!element || !metrics.isScrollable || !trackRect) return;

      const maxThumbTop = Math.max(1, trackRect.height - metrics.thumbHeight);
      const maxScrollTop = Math.max(
        1,
        element.scrollHeight - element.clientHeight,
      );

      const nextThumbTop = Math.min(
        maxThumbTop,
        Math.max(0, clientY - trackRect.top - thumbOffsetY),
      );

      element.scrollTop = (nextThumbTop / maxThumbTop) * maxScrollTop;
      scheduleScrollMeasurement({ reveal: true, hideAfterReveal: false });
    },
    [scheduleScrollMeasurement],
  );

  const handleScrollbarPointerDown = useCallback(
    (event) => {
      const element = scrollRef.current;
      const metrics = latestMetricsRef.current;

      if (!element || !metrics.isScrollable || event.button !== 0) return;

      event.preventDefault();
      event.stopPropagation();

      const trackRect = event.currentTarget.getBoundingClientRect();
      const clickedThumb = event.target.closest(
        "[data-page-scrollbar-thumb='true']",
      );
      const thumbOffsetY = clickedThumb
        ? event.clientY - trackRect.top - metrics.thumbTop
        : metrics.thumbHeight / 2;

      dragStateRef.current = {
        isDragging: true,
        pointerId: event.pointerId,
        thumbOffsetY,
        trackRect,
      };

      isPointerInsideRef.current = true;
      clearHideTimer();
      setIsScrollbarVisible(true);

      event.currentTarget.setPointerCapture?.(event.pointerId);
      scrollToThumbPosition(event.clientY, trackRect, thumbOffsetY);
    },
    [clearHideTimer, scrollToThumbPosition],
  );

  const handleScroll = useCallback(() => {
    scheduleScrollMeasurement({
      reveal: true,
      hideAfterReveal: !isPointerInsideRef.current,
    });
  }, [scheduleScrollMeasurement]);

  const handlePointerEnter = useCallback(() => {
    isPointerInsideRef.current = true;
    clearHideTimer();
    scheduleScrollMeasurement({ reveal: true, hideAfterReveal: false });
  }, [clearHideTimer, scheduleScrollMeasurement]);

  const handlePointerLeave = useCallback(() => {
    isPointerInsideRef.current = false;

    if (!latestMetricsRef.current.isScrollable) return;

    scheduleHide();
  }, [scheduleHide]);

  useEffect(() => {
    function handlePointerMove(event) {
      const dragState = dragStateRef.current;

      if (!dragState.isDragging || event.pointerId !== dragState.pointerId)
        return;

      event.preventDefault();
      scrollToThumbPosition(
        event.clientY,
        dragState.trackRect,
        dragState.thumbOffsetY,
      );
    }

    function handlePointerUp(event) {
      const dragState = dragStateRef.current;

      if (!dragState.isDragging || event.pointerId !== dragState.pointerId)
        return;

      dragStateRef.current = {
        isDragging: false,
        pointerId: null,
        thumbOffsetY: 0,
        trackRect: null,
      };

      if (!isPointerInsideRef.current) {
        scheduleHide();
      }
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [scheduleHide, scrollToThumbPosition]);

  useEffect(() => {
    const element = scrollRef.current;

    scheduleScrollMeasurement();

    if (!element) return;

    const observer = new ResizeObserver(() => {
      scheduleScrollMeasurement();
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
      clearHideTimer();
      cancelScheduledFrame();
    };
  }, [cancelScheduledFrame, clearHideTimer, scheduleScrollMeasurement]);

  return {
    scrollRef,
    scrollMetrics,
    isScrollbarVisible,
    handleScroll,
    handlePointerEnter,
    handlePointerLeave,
    handleScrollbarPointerDown,
  };
}

export default usePageScrollbar;
