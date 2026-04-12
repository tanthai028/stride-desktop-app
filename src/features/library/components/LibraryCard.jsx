import { ExternalLink, MapPin } from "lucide-react";
import { getStatusMeta } from "../constants/libraryStatuses.js";

function formatAppliedDate(appliedAt) {
  if (!appliedAt) return "Not applied yet";

  const parsedDate = new Date(appliedAt);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
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

function LibraryCard({ item }) {
  const statusMeta = getStatusMeta(item.status);
  const title = [item.company, item.role].filter(Boolean).join(" — ");

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="library-card-title min-w-0 flex-1 truncate text-lg font-semibold">
              {title || "Untitled application"}
            </p>

            <span className="library-card-chip shrink-0 flex items-center rounded-full gap-1 px-3 py-1 pl-2 text-xs font-medium">
              <span>{statusMeta.emoji}</span>
              <span>{statusMeta.label}</span>
            </span>
          </div>

          <div className="mt-1 flex items-center gap-x-3 text-sm opacity-80">
            <span>Applied: {formatAppliedDate(item.appliedAt)}</span>

            {item.location ? (
              <span className="ml-auto flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{item.location}</span>
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <p className="library-card-description line-clamp-2 text-sm leading-6">
        {item.notes || "No notes yet."}
      </p>

      {item.jobUrl ? (
        <button
          type="button"
          onClick={(event) => openJobUrl(event, item.jobUrl)}
          className="inline-flex w-fit items-center gap-2 text-sm font-medium underline underline-offset-4 opacity-85 transition-opacity hover:opacity-100"
        >
          <ExternalLink className="h-4 w-4" />
          <span>Open job post</span>
        </button>
      ) : null}
    </div>
  );
}

export default LibraryCard;
