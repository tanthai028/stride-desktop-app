import { Briefcase, BookmarkPlus, Check, RefreshCw } from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import DashboardPagination from "./DashboardPagination.jsx";
import DashboardTitle from "./DashboardTitle.jsx";
import { openDashboardLink } from "../utils/dashboardPreview.utils.js";
import { fetchSimplifyNewGradJobs } from "../utils/jobFeed.utils.js";
import { fetchAtsBoardJobs } from "../utils/atsBoards.utils.js";
import { FEED_SOURCE_STORAGE_KEY } from "../constants/jobFeed.constants.js";
import {
  getCompanyIconUrl,
  handleCompanyIconFallback,
} from "../utils/companyIcon.utils.js";

const FEED_SOURCES = [
  { id: "simplify", label: "SimplifyJobs", fetch: fetchSimplifyNewGradJobs },
  { id: "ats", label: "ATS Boards", fetch: fetchAtsBoardJobs },
];

function readStoredSourceIndex() {
  try {
    const stored = localStorage.getItem(FEED_SOURCE_STORAGE_KEY);
    if (!stored) return 0;
    const idx = FEED_SOURCES.findIndex((s) => s.id === stored);
    return idx >= 0 ? idx : 0;
  } catch {
    return 0;
  }
}

function NewGradFeedCard({ libraryItems = [], onSaveJob }) {
  const [sourceIndex, setSourceIndex] = useState(readStoredSourceIndex);
  const source = FEED_SOURCES[sourceIndex];
  const [jobs, setJobs] = useState([]);
  const [status, setStatus] = useState("loading");
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage, setJobsPerPage] = useState(3);
  const [savedFeedIds, setSavedFeedIds] = useState(new Set());

  const cardRef = useRef(null);
  const listRef = useRef(null);

  const totalPages = Math.max(1, Math.ceil(jobs.length / jobsPerPage));
  const visibleJobs = jobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage,
  );

  const savedJobUrls = useMemo(
    () => new Set(libraryItems.map((item) => item.jobUrl).filter(Boolean)),
    [libraryItems],
  );

  function isJobSaved(job) {
    return savedFeedIds.has(job.id) || savedJobUrls.has(job.url);
  }

  async function handleSaveJob(job) {
    if (isJobSaved(job) || !onSaveJob) return;
    try {
      await onSaveJob({
        company: job.company,
        role: job.role,
        location: job.location,
        jobUrl: job.url,
        status: "unapplied",
      });
      setSavedFeedIds((prev) => new Set([...prev, job.id]));
    } catch {
      // silent — user can retry
    }
  }

  async function loadFeed({ force = false } = {}) {
    try {
      setStatus("loading");
      const nextJobs = await source.fetch({ force });
      setJobs(nextJobs);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }

  useEffect(() => {
    loadFeed();
    // Refetch whenever the active source changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceIndex]);

  function cycleSource() {
    setCurrentPage(1);
    const nextIdx = (sourceIndex + 1) % FEED_SOURCES.length;
    setSourceIndex(nextIdx);
    try {
      localStorage.setItem(FEED_SOURCE_STORAGE_KEY, FEED_SOURCES[nextIdx].id);
    } catch {
      // ignore — chip selection just won't persist
    }
  }

  useLayoutEffect(() => {
    const listEl = listRef.current;
    if (!listEl) return undefined;

    let rafId = 0;

    const measure = () => {
      window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(() => {
        const availableHeight = listEl.clientHeight;
        if (availableHeight === 0) return;

        // Read actual item height from DOM — no magic constant needed.
        const firstItem = listEl.querySelector(".dashboard-new-grad-feed-item");
        const itemHeight = firstItem
          ? firstItem.getBoundingClientRect().height
          : 56; // fallback: 3.5rem at 16px base

        // Read actual gap from computed styles so it stays in sync with CSS.
        const gapHeight =
          parseFloat(getComputedStyle(listEl).rowGap) || 9.6;

        const next = Math.max(
          1,
          Math.floor((availableHeight + gapHeight) / (itemHeight + gapHeight)),
        );

        setJobsPerPage((prev) => (prev === next ? prev : next));
      });
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(listEl);

    return () => {
      window.cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [status]);

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

          <button
            type="button"
            className="dashboard-new-grad-feed-source-chip"
            onClick={cycleSource}
            title="Switch source"
            aria-label={`Switch source (current: ${source.label})`}
          >
            {source.label}
          </button>
        </p>

        <button
          type="button"
          className="dashboard-new-grad-feed-refresh-button"
          onClick={() => loadFeed({ force: true })}
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
          ? visibleJobs.map((job) => {
              const saved = isJobSaved(job);
              return (
                <div key={job.id} className="dashboard-new-grad-feed-item">
                  <button
                    type="button"
                    className="dashboard-new-grad-feed-item-link"
                    onClick={() => openDashboardLink(job.url)}
                    aria-label={`Open ${job.company} job posting`}
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
                  </button>

                  <div className="dashboard-new-grad-feed-side">
                    <button
                      type="button"
                      className={`dashboard-new-grad-feed-save-btn${saved ? " is-saved" : ""}`}
                      onClick={() => handleSaveJob(job)}
                      disabled={saved}
                      title={saved ? "Saved to library" : "Save to library"}
                      aria-label={saved ? "Saved to library" : "Save to library"}
                    >
                      {saved ? <Check /> : <BookmarkPlus />}
                    </button>

                    <span className="dashboard-new-grad-feed-date">
                      {job.datePosted}
                    </span>
                  </div>
                </div>
              );
            })
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
