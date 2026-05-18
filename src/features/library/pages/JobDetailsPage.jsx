import { motion } from "framer-motion";
import {
  Archive,
  Calendar,
  Check,
  Circle,
  Flag,
  Hash,
  Mail,
  Tag,
  Trash2,
} from "lucide-react";
import PageShell from "../../../components/page/PageShell.jsx";
import PageSection from "../../../components/page/PageSection.jsx";
import EditableJobDetailCard from "../components/job-details/EditableJobDetailCard.jsx";
import JobDetailTextBlock from "../components/job-details/JobDetailTextBlock.jsx";
import {
  extractJobId,
  formatLibraryAppliedDate,
} from "../utils/libraryDisplayFormatters.js";

const JOURNEY_STEPS = [
  { value: "applied", label: "Applied" },
  { value: "oa", label: "Screen" },
  { value: "interview", label: "Technical" },
  { value: "final", label: "Final Round" },
  { value: "offer", label: "Offer" },
];

function EmptyText({ children }) {
  return <p className="job-detail-empty">{children}</p>;
}

function getPriorityClass(priority = "medium") {
  return `job-detail-priority-pill is-${String(priority).toLowerCase()}`;
}

function getJourneyIndex(status = "") {
  const normalized = String(status).toLowerCase();

  if (!normalized || normalized === "unapplied" || normalized === "none") {
    return -1;
  }

  if (normalized === "applied") return 0;
  if (normalized === "oa") return 1;
  if (normalized === "interview") return 2;
  if (normalized === "final") return 3;
  if (normalized === "offer") return 4;

  return -1;
}

function JobJourney({ status }) {
  const activeIndex = getJourneyIndex(status);

  return (
    <section className="job-detail-journey-card">
      <p className="job-detail-eyebrow">Application Journey</p>

      <div className="job-detail-journey-steps">
        {JOURNEY_STEPS.map((step, index) => {
          const isDone = index < activeIndex;
          const isActive = index === activeIndex;

          return (
            <div
              key={step.value}
              className={[
                "job-detail-journey-step",
                isDone ? "is-done" : "",
                isActive ? "is-active" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="job-detail-journey-dot">
                {isDone ? <Check size={13} /> : <Circle size={9} />}
              </span>
              <span>{step.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function JobMetadataCard({ activeJob, appliedDate, jobId }) {
  return (
    <JobDetailTextBlock title="Metadata">
      <dl className="job-detail-meta-list">
        <div>
          <dt>
            <Calendar size={14} />
            Applied Date
          </dt>
          <dd>{appliedDate}</dd>
        </div>

        <div>
          <dt>
            <Tag size={14} />
            Status
          </dt>
          <dd>
            <span className="job-detail-status-pill">
              {activeJob.status || "unapplied"}
            </span>
          </dd>
        </div>

        <div>
          <dt>
            <Flag size={14} />
            Priority
          </dt>
          <dd>
            <span className={getPriorityClass(activeJob.priority)}>
              {activeJob.priority || "Medium"}
            </span>
          </dd>
        </div>

        <div>
          <dt>
            <Hash size={14} />
            Job ID
          </dt>
          <dd>{jobId}</dd>
        </div>
      </dl>
    </JobDetailTextBlock>
  );
}

function JobDangerActions({ onArchive, onDelete }) {
  return (
    <div className="job-detail-danger-actions">
      <button
        className="job-detail-archive-button"
        type="button"
        onClick={onArchive}
      >
        <Archive size={14} />
        Archive
      </button>

      <button
        className="job-detail-delete-button"
        type="button"
        onClick={onDelete}
      >
        <Trash2 size={14} />
        Delete
      </button>
    </div>
  );
}

function JobDetailsPage({ activeJob, libraryStore, onBackToLibrary }) {
  if (!activeJob) {
    return (
      <PageShell scrollable={false}>
        <PageSection>
          <JobDetailTextBlock title="Job not found">
            <EmptyText>
              Go back to the library and select another job.
            </EmptyText>
          </JobDetailTextBlock>
        </PageSection>
      </PageShell>
    );
  }

  const extractedJobId = extractJobId(activeJob.jobUrl);
  const numericJobId = extractedJobId?.match(/\d+/)?.[0];
  const jobId = numericJobId || "N/A";

  const appliedDate = formatLibraryAppliedDate(activeJob.appliedAt, {
    fallback: "Not applied yet",
    year: "numeric",
  });

  async function updateJob(changes) {
    await libraryStore.updateItem(activeJob.id, {
      ...activeJob,
      ...changes,
    });
  }

  async function handleDeleteApplication() {
    const shouldDelete = window.confirm(
      "Delete this application? This cannot be undone.",
    );

    if (!shouldDelete) return;

    await libraryStore.deleteItem(activeJob.id);
    onBackToLibrary?.();
  }

  async function handleTemporaryArchive() {
    await updateJob({ pinned: false });
    onBackToLibrary?.();
  }

  return (
    <PageShell scrollable={false}>
      <PageSection>
        <motion.div
          className="job-detail-shell"
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35 }}
        >
          <JobJourney status={activeJob.status} />

          <div className="job-detail-layout">
            <main className="job-detail-main-column">
              <EditableJobDetailCard
                title="Notes"
                value={activeJob.notes}
                placeholder={`# Follow-up plan\n\n- Tailor resume\n- Apply\n- Follow up in 1 week`}
                emptyText="Click here to add notes"
                onSave={(notes) => updateJob({ notes })}
              />
            </main>

            <aside className="job-detail-side-column">
              <EditableJobDetailCard
                title="Contact Info"
                value={activeJob.contactInfo}
                placeholder="Recruiter name, email, LinkedIn, or follow-up notes"
                emptyText={
                  <span className="job-detail-contact-empty">
                    <Mail size={16} />
                    No recruiter or contact email found
                  </span>
                }
                multiline={false}
                onSave={(contactInfo) => updateJob({ contactInfo })}
              />

              <JobMetadataCard
                activeJob={activeJob}
                appliedDate={appliedDate}
                jobId={jobId}
              />

              <JobDangerActions
                onArchive={handleTemporaryArchive}
                onDelete={handleDeleteApplication}
              />
            </aside>
          </div>
        </motion.div>
      </PageSection>
    </PageShell>
  );
}

export default JobDetailsPage;
