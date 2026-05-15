import { useEffect, useRef, useState } from "react";
import {
  QUICK_LINKS_PER_PAGE,
  QUICK_LINKS_STORAGE_KEY,
} from "../constants/dashboardPreview.constants.js";
import { getSavedQuickLinks } from "../utils/dashboardPreview.utils.js";

function useQuickLinks({ variant, isEditingLinks }) {
  const [quickLinks, setQuickLinks] = useState(getSavedQuickLinks);
  const [quickLinksPage, setQuickLinksPage] = useState(1);
  const [quickLinksPerPage, setQuickLinksPerPage] =
    useState(QUICK_LINKS_PER_PAGE);

  const quickLinksListRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(QUICK_LINKS_STORAGE_KEY, JSON.stringify(quickLinks));
  }, [quickLinks]);

  useEffect(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(quickLinks.length / quickLinksPerPage),
    );

    setQuickLinksPage((page) => Math.min(page, totalPages));
  }, [quickLinks.length, quickLinksPerPage]);

  useEffect(() => {
    const listElement = quickLinksListRef.current;
    if (!listElement) return undefined;

    function updateQuickLinksPerPage() {
      const itemHeight = isEditingLinks ? 112 : 56;
      const headerHeight = isEditingLinks ? 22 : 0;
      const availableHeight = listElement.clientHeight - headerHeight;
      const nextPerPage = Math.max(1, Math.floor(availableHeight / itemHeight));

      setQuickLinksPerPage(nextPerPage);
    }

    updateQuickLinksPerPage();

    const resizeObserver = new ResizeObserver(updateQuickLinksPerPage);
    resizeObserver.observe(listElement);

    return () => resizeObserver.disconnect();
  }, [variant, isEditingLinks]);

  function updateQuickLink(linkId, field, value) {
    setQuickLinks((links) =>
      links.map((link) =>
        link.id === linkId ? { ...link, [field]: value } : link,
      ),
    );
  }

  function addQuickLink() {
    setQuickLinks((links) => {
      const nextLinks = [
        ...links,
        {
          id: `link-${Date.now()}`,
          label: "New Link",
          url: "https://",
        },
      ];

      setQuickLinksPage(Math.ceil(nextLinks.length / quickLinksPerPage));
      return nextLinks;
    });
  }

  function removeQuickLink(linkId) {
    setQuickLinks((links) =>
      links.length > 1 ? links.filter((link) => link.id !== linkId) : links,
    );
  }

  return {
    quickLinks,
    quickLinksPage,
    quickLinksPerPage,
    quickLinksListRef,
    setQuickLinksPage,
    updateQuickLink,
    addQuickLink,
    removeQuickLink,
  };
}

export default useQuickLinks;
