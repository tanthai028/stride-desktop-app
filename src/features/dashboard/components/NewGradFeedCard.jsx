import { BookmarkPlus, Check, RefreshCw } from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import DashboardPagination from "./DashboardPagination.jsx";
import { openDashboardLink } from "../utils/dashboardPreview.utils.js";
import { fetchSimplifyNewGradJobs } from "../utils/jobFeed.utils.js";
import { fetchAtsBoardJobs } from "../utils/atsBoards.utils.js";
import { FEED_SOURCE_STORAGE_KEY } from "../constants/jobFeed.constants.js";
import {
  getCompanyIconUrl,
  handleCompanyIconFallback,
} from "../utils/companyIcon.utils.js";

// Convert a job's date info into milliseconds-ago for unified sorting.
// ATS jobs carry a numeric postedAt; Simplify jobs carry a datePosted string.
function msAgo(job) {
  if (Number.isFinite(job.postedAt) && job.postedAt > 0) {
    return Date.now() - job.postedAt;
  }
  const s = (job.datePosted ?? "").toLowerCase().trim();
  if (s === "today") return 0;
  const d = s.match(/^(\d+)d$/);
  if (d) return Number(d[1]) * 86_400_000;
  const w = s.match(/^(\d+)w$/);
  if (w) return Number(w[1]) * 7 * 86_400_000;
  const mo = s.match(/^(\d+)mo$/);
  if (mo) return Number(mo[1]) * 30 * 86_400_000;
  const parsed = Date.parse(job.datePosted ?? "");
  if (Number.isFinite(parsed)) return Date.now() - parsed;
  return Infinity; // "Recently" / unknown → sort to end
}

async function fetchAllJobs({ force = false } = {}) {
  const [simplify, ats] = await Promise.allSettled([
    fetchSimplifyNewGradJobs(),
    fetchAtsBoardJobs({ force }),
  ]);
  const simplifyJobs = simplify.status === "fulfilled" ? simplify.value : [];
  const atsJobs = ats.status === "fulfilled" ? ats.value : [];
  const seen = new Set();
  const combined = [];
  for (const job of [...simplifyJobs, ...atsJobs]) {
    if (job.url && seen.has(job.url)) continue;
    if (job.url) seen.add(job.url);
    combined.push(job);
  }
  combined.sort((a, b) => msAgo(a) - msAgo(b));
  return combined;
}

const FEED_SOURCES = [
  { id: "all", label: "All", fetch: fetchAllJobs },
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
  const isFirstLoad = useRef(true);

  const savedJobUrls = useMemo(
    () => new Set(libraryItems.map((item) => item.jobUrl).filter(Boolean)),
    [libraryItems],
  );

  const totalPages = Math.max(1, Math.ceil(jobs.length / jobsPerPage));
  const visibleJobs = jobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage,
  );

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

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

  function handleSourceChange(idx) {
    if (idx === sourceIndex) return;
    setCurrentPage(1);
    setSourceIndex(idx);
    try {
      localStorage.setItem(FEED_SOURCE_STORAGE_KEY, FEED_SOURCES[idx].id);
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    const force = isFirstLoad.current;
    isFirstLoad.current = false;
    loadFeed({ force });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceIndex]);

  useLayoutEffect(() => {
    const listEl = listRef.current;
    if (!listEl) return undefined;

    let rafId = 0;

    const measure = () => {
      window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(() => {
        const availableHeight = listEl.clientHeight;
        if (availableHeight === 0) return;

        const firstItem = listEl.querySelector(".dashboard-new-grad-feed-item");
        const itemHeight = firstItem
          ? firstItem.getBoundingClientRect().height
          : 56;

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
    const retryId = setTimeout(measure, 0);

    const ro = new ResizeObserver(measure);
    ro.observe(listEl);
    if (cardRef.current) ro.observe(cardRef.current);

    return () => {
      clearTimeout(retryId);
      window.cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [status]);

  return (
    <div
      ref={cardRef}
      className="surface-card dashboard-card dashboard-new-grad-feed-card"
    >
      <div className="dashboard-new-grad-feed-header">
        <div className="feed-source-tabs" role="tablist" aria-label="Feed source">
          {FEED_SOURCES.map((src, idx) => (
            <button
              key={src.id}
              type="button"
              role="tab"
              aria-selected={sourceIndex === idx}
              className={`feed-source-tab${sourceIndex === idx ? " is-active" : ""}`}
              onClick={() => handleSourceChange(idx)}
            >
              {src.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={`feed-refresh-btn${status === "loading" ? " is-loading" : ""}`}
          onClick={() => loadFeed({ force: true })}
          disabled={status === "loading"}
          aria-label="Refresh feed"
          title="Refresh feed"
        >
          <RefreshCw />
        </button>
      </div>

      <div ref={listRef} className="dashboard-new-grad-feed-list">
        {status === "loading"
          ? Array.from({ length: jobsPerPage }).map((_, i) => (
              <div key={i} className="dashboard-new-grad-feed-skeleton-item">
                <div className="dashboard-new-grad-feed-skeleton-icon" />
                <div className="dashboard-new-grad-feed-skeleton-main">
                  <div className="dashboard-new-grad-feed-skeleton-line dashboard-new-grad-feed-skeleton-line--wide" />
                  <div className="dashboard-new-grad-feed-skeleton-line dashboard-new-grad-feed-skeleton-line--narrow" />
                </div>
              </div>
            ))
          : null}

        {status === "error" ? (
          <p className="stat-card-description text-sm">
            Could not load the feed. Try refreshing.
          </p>
        ) : null}

        {status === "ready" && jobs.length === 0 ? (
          <p className="stat-card-description text-sm">No roles found.</p>
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
                    <img
                      className="dashboard-company-icon dashboard-feed-company-icon"
                      src={getCompanyIconUrl(job.company)}
                      onError={(event) =>
                        handleCompanyIconFallback(event, job.url)
                      }
                      alt=""
                      loading="lazy"
                    />
                    <div className="dashboard-new-grad-feed-main">
                      <p className="dashboard-new-grad-feed-role-line">
                        {job.role || "Software role"}
                      </p>
                      <p className="dashboard-new-grad-feed-meta-line">
                        {job.company || "Unknown"} · {job.location || "Unknown"}
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
        <span className="feed-result-count">
          {status === "ready" && jobs.length > 0 ? `${jobs.length} roles` : ""}
        </span>
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
