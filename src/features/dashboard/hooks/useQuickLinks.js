import { useEffect, useRef, useState } from "react";
import {
  QUICK_LINKS_PER_PAGE,
  QUICK_LINKS_STORAGE_KEY,
} from "../constants/dashboardPreview.constants.js";
import { getSavedQuickLinks } from "../utils/dashboardPreview.utils.js";

function useQuickLinks({ isEditingLinks }) {
  const [quickLinks, setQuickLinks] = useState(getSavedQuickLinks);
  const [quickLinksPage, setQuickLinksPage] = useState(1);
  const quickLinksPerPage = QUICK_LINKS_PER_PAGE;

  const quickLinksListRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(QUICK_LINKS_STORAGE_KEY, JSON.stringify(quickLinks));
  }, [quickLinks]);

  useEffect(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(quickLinks.length / QUICK_LINKS_PER_PAGE),
    );

    setQuickLinksPage((page) => Math.min(page, totalPages));
  }, [quickLinks.length]);

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

      setQuickLinksPage(Math.ceil(nextLinks.length / QUICK_LINKS_PER_PAGE));
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
