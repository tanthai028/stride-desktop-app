import { useCallback, useEffect, useRef, useState } from "react";

const SCROLLBAR_HIDE_DELAY_MS = 650;
const MIN_THUMB_HEIGHT_PX = 44;

function PageShell({ eyebrow, title, description, actions, children }) {
  const scrollRef = useRef(null);
  const hideTimerRef = useRef(null);

  const [isScrollbarVisible, setIsScrollbarVisible] = useState(false);
  const [scrollMetrics, setScrollMetrics] = useState({
    isScrollable: false,
    thumbHeight: 0,
    thumbTop: 0,
  });

  const updateScrollMetrics = useCallback(() => {
    const element = scrollRef.current;

    if (!element) return;

    const { scrollTop, scrollHeight, clientHeight } = element;
    const isScrollable = scrollHeight > clientHeight + 1;

    if (!isScrollable) {
      setScrollMetrics({
        isScrollable: false,
        thumbHeight: 0,
        thumbTop: 0,
      });
      return;
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
  }, []);

  useEffect(() => {
    updateScrollMetrics();

    function handleResize() {
      updateScrollMetrics();
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, [updateScrollMetrics]);

  function revealScrollbarTemporarily() {
    setIsScrollbarVisible(true);

    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }

    hideTimerRef.current = setTimeout(() => {
      setIsScrollbarVisible(false);
    }, SCROLLBAR_HIDE_DELAY_MS);
  }

  function handleScroll() {
    updateScrollMetrics();
    revealScrollbarTemporarily();
  }

  return (
    <div className="surface-panel flex min-h-0 flex-1 flex-col overflow-hidden rounded-[36px] border border-white/50 bg-white/45 p-6 backdrop-blur-3xl">
      <div className="flex shrink-0 flex-col gap-4 border-b border-white/40 pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          {eyebrow ? (
            <p className="text-sm font-medium text-violet-500">{eyebrow}</p>
          ) : null}

          <h2 className="text-2xl font-semibold text-slate-800">{title}</h2>

          {description ? (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          ) : null}
        </div>

        {actions ? <div className="flex gap-3">{actions}</div> : null}
      </div>

      <div className="relative mt-6 min-h-0 flex-1">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-full min-h-0 overflow-y-auto scrollbar-hide"
        >
          <div className="flex min-h-full flex-col">{children}</div>
        </div>

        <div
          className={`pointer-events-none absolute bottom-1 -right-4 top-1 w-2.5 transition-opacity duration-300 ease-out ${
            scrollMetrics.isScrollable && isScrollbarVisible
              ? "opacity-100"
              : "opacity-0"
          }`}
        >
          <div className="absolute inset-y-0 right-0 w-1.5 rounded-full bg-black/5 backdrop-blur-sm" />
          <div
            className="absolute right-0 w-1.5 rounded-full bg-slate-400/70 shadow-[0_0_0_1px_rgba(255,255,255,0.18)] transition-[transform,height] duration-300 ease-out"
            style={{
              height: `${scrollMetrics.thumbHeight}px`,
              transform: `translateY(${scrollMetrics.thumbTop}px)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default PageShell;
