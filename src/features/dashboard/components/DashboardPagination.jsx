import { ChevronLeft, ChevronRight } from "lucide-react";

function getPaginationItems(currentPage, totalPages) {
  if (totalPages <= 6) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "ellipsis-left",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis-right",
    totalPages,
  ];
}

function DashboardPagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pageItems = getPaginationItems(currentPage, totalPages);

  return (
    <div
      className="dashboard-pagination"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        className="dashboard-pagination-button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft />
      </button>

      {pageItems.map((item) =>
        String(item).startsWith("ellipsis") ? (
          <span key={item} className="dashboard-pagination-ellipsis">
            ...
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={`dashboard-pagination-button ${
              item === currentPage ? "dashboard-pagination-button--active" : ""
            }`}
            onClick={() => onPageChange(item)}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        className="dashboard-pagination-button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight />
      </button>
    </div>
  );
}

export default DashboardPagination;
