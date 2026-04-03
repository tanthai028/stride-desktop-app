import { useCallback, useEffect, useRef, useState } from "react";

const SCROLLBAR_HIDE_DELAY_MS = 650;
const MIN_THUMB_HEIGHT_PX = 44;

function usePageScrollbar() {
  const scrollRef = useRef(null);
  const hideTimerRef = useRef(null);

  const [isScrollbarVisible, setIsScrollbarVisible] = useState(false);
  const [scrollMetrics, setScrollMetrics] = useState({
    isScrollable: false,
    thumbHeight: 0,
    thumbTop: 0,
  });

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const scheduleHide = useCallback(() => {
    clearHideTimer();

    hideTimerRef.current = setTimeout(() => {
      setIsScrollbarVisible(false);
    }, SCROLLBAR_HIDE_DELAY_MS);
  }, [clearHideTimer]);

  const updateScrollMetrics = useCallback(() => {
    const element = scrollRef.current;

    if (!element) return false;

    const { scrollTop, scrollHeight, clientHeight } = element;
    const isScrollable = scrollHeight > clientHeight + 1;

    if (!isScrollable) {
      setScrollMetrics({
        isScrollable: false,
        thumbHeight: 0,
        thumbTop: 0,
      });
      return false;
    }

    const trackHeight = clientHeight;
    const rawThumbHeight = (clientHeight / scrollHeight) * trackHeight;
    const thumbHeight = Math.max(MIN_THUMB_HEIGHT_PX, rawThumbHeight);
    const maxThumbTop = Math.max(0, trackHeight - thumbHeight);
    const maxScrollTop = Math.max(1, scrollHeight - clientHeight);
    const thumbTop = (scrollTop / maxScrollTop) * maxThumbTop;

    setScrollMetrics({
      isScrollable: true,
      thumbHeight,
      thumbTop,
    });

    return true;
  }, []);

  const revealScrollbarTemporarily = useCallback(() => {
    const isScrollable = updateScrollMetrics();

    if (!isScrollable) return;

    setIsScrollbarVisible(true);
    scheduleHide();
  }, [scheduleHide, updateScrollMetrics]);

  const handleScroll = useCallback(() => {
    revealScrollbarTemporarily();
  }, [revealScrollbarTemporarily]);

  const handlePointerEnter = useCallback(() => {
    const isScrollable = updateScrollMetrics();

    if (!isScrollable) return;

    clearHideTimer();
    setIsScrollbarVisible(true);
  }, [clearHideTimer, updateScrollMetrics]);

  const handlePointerLeave = useCallback(() => {
    if (!scrollMetrics.isScrollable) return;
    scheduleHide();
  }, [scheduleHide, scrollMetrics.isScrollable]);

  useEffect(() => {
    updateScrollMetrics();

    function handleResize() {
      updateScrollMetrics();
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearHideTimer();
    };
  }, [clearHideTimer, updateScrollMetrics]);

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
