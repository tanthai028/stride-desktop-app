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

  const parts = location.split(",").map((part) => part.trim());

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
    <div className="library-card-content">
      <div className="library-card-top">
        <div className="library-card-main">
          <div className="library-card-header">
            <p className="library-card-title">
              {title || "Untitled application"}
            </p>

            <span className="library-card-chip">
              <span>{statusMeta.emoji}</span>
              <span>{statusMeta.label}</span>
            </span>
          </div>

          <div className="library-card-meta">
            <span className="library-card-applied">
              Applied: {formatAppliedDate(item.appliedAt)}
            </span>

            {item.location ? (
              <span className="library-card-location">
                <MapPin className="library-card-location-icon" />
                <span className="library-card-location-text">
                  {formatLocation(item.location)}
                </span>
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <p className="library-card-description line-clamp-2">
        {item.notes || "No notes yet."}
      </p>

      {item.jobUrl ? (
        <button
          type="button"
          onClick={(event) => openJobUrl(event, item.jobUrl)}
          className="library-card-link"
        >
          <ExternalLink className="library-card-link-icon" />
          <span>Open job post</span>
        </button>
      ) : null}
    </div>
  );
}

export default LibraryCard;
