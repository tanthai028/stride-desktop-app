import { ExternalLink } from "lucide-react";
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
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full min-w-[860px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="px-4 py-3 font-medium">Company</th>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Location</th>
            <th className="px-4 py-3 font-medium">Applied</th>
            <th className="px-4 py-3 font-medium">Job Post</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => {
            const statusMeta = getStatusMeta(item.status);

            return (
              <tr
                key={item.id}
                onClick={
                  isPageReady && onItemClick
                    ? () => onItemClick(item)
                    : undefined
                }
                className={`border-b border-white/5 transition ${
                  isPageReady && onItemClick
                    ? "cursor-pointer hover:bg-white/5"
                    : ""
                }`}
              >
                <td className="px-4 py-3">{item.company || "-"}</td>
                <td className="px-4 py-3">{item.role || "-"}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-1 text-xs font-medium">
                    <span>{statusMeta.emoji}</span>
                    <span>{statusMeta.label || "-"}</span>
                  </span>
                </td>
                <td className="px-4 py-3">{item.location || "-"}</td>
                <td className="px-4 py-3">
                  {formatAppliedDate(item.appliedAt)}
                </td>
                <td className="px-4 py-3">
                  {item.jobUrl ? (
                    <button
                      type="button"
                      onClick={(event) => openJobUrl(event, item.jobUrl)}
                      className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 opacity-85 transition-opacity hover:opacity-100"
                    >
                      <ExternalLink className="h-4 w-4 shrink-0" />
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
  );
}

export default LibraryTable;
