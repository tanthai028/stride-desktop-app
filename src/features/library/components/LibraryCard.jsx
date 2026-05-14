import { ExternalLink, MapPin } from "lucide-react";
import { getStatusMeta } from "../constants/libraryStatuses.js";
import {
  formatLibraryAppliedDate,
  formatLibraryLocation,
  openLibraryJobUrl,
} from "../utils/libraryDisplayFormatters.js";

function LibraryCard({ item }) {
  const statusMeta = getStatusMeta(item.status);
  const title = [item.company, item.role].filter(Boolean).join(" — ");

  return (
    <div className={`library-card-content ${item.pinned ? "is-pinned" : ""}`}>
      <div className="library-card-top">
        <div className="library-card-main">
          <div className="library-card-header">
            <p className="library-card-title">
              {title || "Untitled application"}
            </p>

            <div className="library-card-header-actions">
              <span className="library-card-chip">
                <span>{statusMeta.emoji}</span>
                <span>{statusMeta.label}</span>
              </span>
            </div>
          </div>

          <div className="library-card-meta">
            <span className="library-card-applied">
              Applied:{" "}
              {formatLibraryAppliedDate(item.appliedAt, {
                fallback: "Not applied yet",
                year: "numeric",
              })}
            </span>

            {item.location ? (
              <span className="library-card-location">
                <MapPin className="library-card-location-icon" />
                <span className="library-card-location-text">
                  {formatLibraryLocation(item.location, "")}
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
          onClick={(event) => openLibraryJobUrl(event, item.jobUrl)}
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
