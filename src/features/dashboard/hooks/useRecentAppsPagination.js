import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  DEFAULT_RECENT_APPS_PER_PAGE,
  RECENT_APP_ROW_HEIGHT,
} from "../constants/dashboardPreview.constants.js";

function useRecentAppsPagination({ variant, recentItems }) {
  const [recentPage, setRecentPage] = useState(1);
  const [recentAppsPerPage, setRecentAppsPerPage] = useState(
    DEFAULT_RECENT_APPS_PER_PAGE,
  );

  const recentListRef = useRef(null);
  const recentCardRef = useRef(null);

  useLayoutEffect(() => {
    const listElement = recentListRef.current;
    const cardElement = recentCardRef.current;

    if (!listElement || !cardElement) return undefined;

    let animationFrameId = 0;

    function updateRecentAppsPerPage() {
      window.cancelAnimationFrame(animationFrameId);

      animationFrameId = window.requestAnimationFrame(() => {
        const availableHeight = listElement.clientHeight;

        const nextPerPage = Math.max(
          1,
          Math.floor(availableHeight / RECENT_APP_ROW_HEIGHT),
        );

        setRecentAppsPerPage((currentPerPage) =>
          currentPerPage === nextPerPage ? currentPerPage : nextPerPage,
        );
      });
    }

    updateRecentAppsPerPage();

    const resizeObserver = new ResizeObserver(updateRecentAppsPerPage);
    resizeObserver.observe(cardElement);
    resizeObserver.observe(listElement);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [variant]);

  // Reset to page 1 when the items list changes (new data).
  useEffect(() => {
    setRecentPage(1);
  }, [recentItems.length]);

  // On resize, only clamp to the last valid page — don't reset to 1.
  useEffect(() => {
    setRecentPage((page) => {
      const totalPages = Math.max(
        1,
        Math.ceil(recentItems.length / recentAppsPerPage),
      );
      return page > totalPages ? totalPages : page;
    });
  }, [recentAppsPerPage, recentItems.length]);

  return {
    recentPage,
    recentAppsPerPage,
    recentListRef,
    recentCardRef,
    setRecentPage,
  };
}

export default useRecentAppsPagination;
