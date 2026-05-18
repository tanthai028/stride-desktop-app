import { BriefcaseBusiness, ExternalLink } from "lucide-react";
import HeaderClock from "./HeaderClock.jsx";
import {
  getCompanyIconUrl,
  handleCompanyIconFallback,
} from "../../features/dashboard/utils/companyIcon.utils.js";
import { openLibraryJobUrl } from "../../features/library/utils/libraryDisplayFormatters.js";

function AppHeaderBrand({ eyebrow, title, description }) {
  return (
    <div className="app-header-brand-copy">
      <p className="app-header-kicker text-sm font-medium tracking-wide">
        {eyebrow}
      </p>

      <h1 className="app-header-title text-3xl font-semibold">{title}</h1>

      {description ? (
        <p className="app-header-description">{description}</p>
      ) : null}
    </div>
  );
}

function JobHeaderBrand({ job }) {
  const companyIconUrl = getCompanyIconUrl(job.company);

  return (
    <button
      className="app-header-job-brand"
      type="button"
      onClick={(event) => openLibraryJobUrl(event, job.jobUrl)}
      disabled={!job.jobUrl}
    >
      <div className="job-detail-company-icon">
        {job.company ? (
          <img
            src={companyIconUrl}
            alt=""
            onError={(event) => handleCompanyIconFallback(event, job.jobUrl)}
          />
        ) : (
          <BriefcaseBusiness size={26} />
        )}
      </div>

      <div className="app-header-brand-copy">
        <p className="app-header-kicker text-sm font-medium tracking-wide">
          {[job.company || "Unknown company", job.location]
            .filter(Boolean)
            .join(" @ ")}
        </p>

        <h1 className="app-header-title text-3xl font-semibold">
          {job.role || "Untitled Role"}
        </h1>
      </div>

      <ExternalLink className="app-header-job-open-icon" size={18} />
    </button>
  );
}

function AppHeader({ eyebrow, title, description, jobHeader }) {
  return (
    <div className="app-header">
      <div
        className={`app-header-brand app-header-brand-responsive app-header-brand-mask surface-card relative ${
          jobHeader ? "is-job-header" : ""
        }`}
      >
        {jobHeader ? (
          <JobHeaderBrand job={jobHeader} />
        ) : (
          <AppHeaderBrand
            eyebrow={eyebrow}
            title={title}
            description={description}
          />
        )}
      </div>

      <HeaderClock />
    </div>
  );
}

export default AppHeader;
