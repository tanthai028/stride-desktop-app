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
      setIsScrollbarVisible(false);
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

        if (hideAfterReveal) {
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

  const handleScroll = useCallback(() => {
    scheduleScrollMeasurement({ reveal: true, hideAfterReveal: true });
  }, [scheduleScrollMeasurement]);

  const handlePointerEnter = useCallback(() => {
    scheduleScrollMeasurement({ reveal: true, hideAfterReveal: false });
  }, [scheduleScrollMeasurement]);

  const handlePointerLeave = useCallback(() => {
    if (!latestMetricsRef.current.isScrollable) return;
    scheduleHide();
  }, [scheduleHide]);

  useEffect(() => {
    scheduleScrollMeasurement();

    function handleResize() {
      scheduleScrollMeasurement();
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
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
  };
}

export default usePageScrollbar;
