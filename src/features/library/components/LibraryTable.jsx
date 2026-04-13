import { ExternalLink } from "lucide-react";
import PageScrollbar from "../../../components/page/PageScrollbar.jsx";
import usePageScrollbar from "../../../components/page/usePageScrollbar.js";
import { getStatusMeta } from "../constants/libraryStatuses.js";

function formatAppliedDate(appliedAt) {
  if (!appliedAt) return "-";

  const parsedDate = new Date(appliedAt);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function openJobUrl(event, jobUrl) {
  event.stopPropagation();

  if (!jobUrl) return;

  if (window.libraryApi?.openExternalUrl) {
    window.libraryApi.openExternalUrl(jobUrl);
    return;
  }

  window.open(jobUrl, "_blank", "noopener,noreferrer");
}

function LibraryTable({ items, isPageReady, onItemClick }) {
  const {
    scrollRef,
    scrollMetrics,
    isScrollbarVisible,
    handleScroll,
    handlePointerEnter,
    handlePointerLeave,
  } = usePageScrollbar();

  return (
    <div className="library-table-shell">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        className="library-table-scroll scrollbar-hide"
      >
        <table className="library-table">
          <thead>
            <tr className="library-table-header-row">
              <th className="library-table-header-cell">Company</th>
              <th className="library-table-header-cell">Role</th>
              <th className="library-table-header-cell">Status</th>
              <th className="library-table-header-cell">Location</th>
              <th className="library-table-header-cell">Applied</th>
              <th className="library-table-header-cell">Job Post</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => {
              const statusMeta = getStatusMeta(item.status);
              const isClickable = isPageReady && onItemClick;

              return (
                <tr
                  key={item.id}
                  onClick={isClickable ? () => onItemClick(item) : undefined}
                  className={`library-table-row ${
                    isClickable ? "is-clickable" : ""
                  }`}
                >
                  <td className="library-table-cell">{item.company || "-"}</td>
                  <td className="library-table-cell">{item.role || "-"}</td>
                  <td className="library-table-cell">
                    <span className="library-table-status-chip">
                      <span>{statusMeta.emoji}</span>
                      <span>{statusMeta.label || "-"}</span>
                    </span>
                  </td>
                  <td className="library-table-cell">{item.location || "-"}</td>
                  <td className="library-table-cell">
                    {formatAppliedDate(item.appliedAt)}
                  </td>
                  <td className="library-table-cell">
                    {item.jobUrl ? (
                      <button
                        type="button"
                        onClick={(event) => openJobUrl(event, item.jobUrl)}
                        className="library-table-link-button"
                      >
                        <ExternalLink className="library-table-link-icon" />
                        <span>Open</span>
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <PageScrollbar
        isVisible={isScrollbarVisible}
        scrollMetrics={scrollMetrics}
      />
    </div>
  );
}

export default LibraryTable;
