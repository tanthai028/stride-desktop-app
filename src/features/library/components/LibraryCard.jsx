import { ExternalLink, MapPin } from "lucide-react";
import { getStatusMeta } from "../constants/libraryStatuses.js";

const STATE_ABBREVIATIONS = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
};

function formatLocation(location = "") {
  if (!location) return "";

  // "San Francisco, California" → ["San Francisco", "California"]
  const parts = location.split(",").map((p) => p.trim());

  if (parts.length < 2) return location;

  const city = parts[0];
  const stateFull = parts[1];

  const stateAbbr = STATE_ABBREVIATIONS[stateFull];

  return stateAbbr ? `${city}, ${stateAbbr}` : location;
}

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
    <div className="flex h-full w-full flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="library-card-title min-w-0 flex-1 truncate text-lg font-semibold">
              {title || "Untitled application"}
            </p>

            <span className="library-card-chip flex shrink-0 items-center gap-1 rounded-full px-3 py-1 pl-2 text-xs font-medium">
              <span>{statusMeta.emoji}</span>
              <span>{statusMeta.label}</span>
            </span>
          </div>

          <div className="mt-1 flex items-start justify-between gap-3 text-sm opacity-80">
            <span className="min-w-0 shrink-0">
              Applied: {formatAppliedDate(item.appliedAt)}
            </span>

            {item.location ? (
              <span className="flex min-w-0 items-start justify-end gap-1 text-right">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span className="min-w-0 break-words">
                  {formatLocation(item.location)}
                </span>
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <p className="library-card-description line-clamp-2 flex-1 text-sm leading-6">
        {item.notes || "No notes yet."}
      </p>

      {item.jobUrl ? (
        <button
          type="button"
          onClick={(event) => openJobUrl(event, item.jobUrl)}
          className="mt-auto inline-flex w-fit items-center gap-2 text-sm font-medium underline underline-offset-4 opacity-85 transition-opacity hover:opacity-100"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          <span>Open job post</span>
        </button>
      ) : null}
    </div>
  );
}

export default LibraryCard;
