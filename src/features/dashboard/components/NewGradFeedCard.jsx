import { Briefcase, ExternalLink, RefreshCw } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import DashboardPagination from "./DashboardPagination.jsx";
import DashboardTitle from "./DashboardTitle.jsx";
import { openDashboardLink } from "../utils/dashboardPreview.utils.js";
import { fetchSimplifyNewGradJobs } from "../utils/jobFeed.utils.js";
import {
  getCompanyIconUrl,
  handleCompanyIconFallback,
} from "../utils/companyIcon.utils.js";

const NEW_GRAD_FEED_ROW_HEIGHT = 64;

function NewGradFeedCard() {
  const [jobs, setJobs] = useState([]);
  const [status, setStatus] = useState("loading");
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage, setJobsPerPage] = useState(3);

  const cardRef = useRef(null);
  const listRef = useRef(null);

  const totalPages = Math.max(1, Math.ceil(jobs.length / jobsPerPage));
  const visibleJobs = jobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage,
  );

  async function loadFeed() {
    try {
      setStatus("loading");
      const nextJobs = await fetchSimplifyNewGradJobs();
      setJobs(nextJobs);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }

  useEffect(() => {
    loadFeed();
  }, []);

  useLayoutEffect(() => {
    const cardElement = cardRef.current;
    const listElement = listRef.current;

    if (!cardElement || !listElement) return undefined;

    let animationFrameId = 0;

    const updateJobsPerPage = () => {
      window.cancelAnimationFrame(animationFrameId);

      animationFrameId = window.requestAnimationFrame(() => {
        const availableHeight = listElement.clientHeight;
        const nextPerPage = Math.max(
          1,
          Math.floor(availableHeight / NEW_GRAD_FEED_ROW_HEIGHT),
        );

        setJobsPerPage((current) =>
          current === nextPerPage ? current : nextPerPage,
        );
      });
    };

    updateJobsPerPage();

    const resizeObserver = new ResizeObserver(updateJobsPerPage);
    resizeObserver.observe(cardElement);
    resizeObserver.observe(listElement);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [jobs.length]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  return (
    <div
      ref={cardRef}
      className="surface-card dashboard-card dashboard-new-grad-feed-card"
    >
      <div className="dashboard-new-grad-feed-header">
        <p className="stat-card-description dashboard-card-title dashboard-new-grad-feed-title text-sm font-medium">
          <DashboardTitle icon={Briefcase}>New Grad Feed</DashboardTitle>

          <span className="dashboard-new-grad-feed-source-chip">
            SimplifyJobs
          </span>
        </p>

        <button
          type="button"
          className="dashboard-new-grad-feed-refresh-button"
          onClick={loadFeed}
          aria-label="Refresh new grad feed"
          title="Refresh feed"
        >
          <RefreshCw />
        </button>
      </div>

      <div ref={listRef} className="dashboard-new-grad-feed-list">
        {status === "loading" ? (
          <p className="stat-card-description text-sm">Loading new roles...</p>
        ) : null}

        {status === "error" ? (
          <p className="stat-card-description text-sm">
            Could not load the feed. Try refreshing.
          </p>
        ) : null}

        {status === "ready" && jobs.length === 0 ? (
          <p className="stat-card-description text-sm">
            No new grad roles found
          </p>
        ) : null}

        {status === "ready"
          ? visibleJobs.map((job) => (
              <button
                key={job.id}
                type="button"
                className="dashboard-new-grad-feed-item"
                onClick={() => openDashboardLink(job.url)}
              >
                <div className="dashboard-new-grad-feed-main">
                  <p className="dashboard-new-grad-feed-title-line">
                    <img
                      className="dashboard-company-icon"
                      src={getCompanyIconUrl(job.company)}
                      onError={(event) =>
                        handleCompanyIconFallback(event, job.url)
                      }
                      alt=""
                      loading="lazy"
                    />

                    <span className="dashboard-new-grad-feed-title-text">
                      {job.company || "Unknown Company"} ·{" "}
                      {job.role || "New grad role"}
                    </span>
                  </p>

                  <p className="dashboard-new-grad-feed-location">
                    {job.location || "Unknown"}
                  </p>
                </div>

                <div className="dashboard-new-grad-feed-side">
                  <span className="dashboard-new-grad-feed-date">
                    {job.datePosted}
                  </span>

                  <ExternalLink />
                </div>
              </button>
            ))
          : null}
      </div>

      <div className="dashboard-new-grad-feed-pagination-slot">
        <DashboardPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default NewGradFeedCard;
