import { motion } from "framer-motion";
import {
  Archive,
  Calendar,
  CalendarPlus,
  Check,
  Hash,
  Mail,
  MapPin,
  Trash2,
} from "lucide-react";
import PageShell from "../../../components/page/PageShell.jsx";
import PageSection from "../../../components/page/PageSection.jsx";
import SelectMenu from "../../../components/ui/SelectMenu.jsx";
import EditableJobDetailCard from "../components/job-details/EditableJobDetailCard.jsx";
import JobDetailTextBlock from "../components/job-details/JobDetailTextBlock.jsx";
import { PRIORITY_OPTIONS } from "../constants/libraryPriorities.js";
import {
  getLibraryStatusOptions,
  normalizeStatusValue,
} from "../constants/libraryStatuses.js";
import {
  extractJobId,
  formatLibraryAppliedDate,
  formatLibraryLocation,
} from "../utils/libraryDisplayFormatters.js";

/* ─── Pipeline steps ─────────────────────────────────────── */

const PIPELINE_STEPS = [
  { value: "applied", label: "Applied" },
  { value: "oa", label: "OA" },
  { value: "interview", label: "Interview" },
  { value: "final", label: "Final" },
  { value: "offer", label: "Offer" },
];

function getJourneyIndex(status = "") {
  const normalized = normalizeStatusValue(status);
  if (!normalized || normalized === "unapplied" || normalized === "none") return -1;
  if (normalized === "applied") return 0;
  if (normalized === "oa") return 1;
  if (normalized === "interview") return 2;
  if (normalized === "final") return 3;
  if (normalized === "offer") return 4;
  return -1;
}

/* ─── Sub-components ─────────────────────────────────────── */

function Pipeline({ status }) {
  const activeIndex = getJourneyIndex(status);

  return (
    <div className="jp-pipeline">
      {PIPELINE_STEPS.map((step, index) => {
        const isDone = index < activeIndex;
        const isActive = index === activeIndex;
        const isFirst = index === 0;
        const isLast = index === PIPELINE_STEPS.length - 1;
        const leftFilled = isDone || isActive;
        const rightFilled = isDone;

        return (
          <div
            key={step.value}
            className={[
              "jp-pipeline-item",
              isDone ? "is-done" : "",
              isActive ? "is-active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="jp-pipeline-node">
              <div
                className={[
                  "jp-pipeline-line",
                  isFirst ? "is-invisible" : "",
                  leftFilled ? "is-filled" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              />
              <span className="jp-pipeline-dot">
                {isDone && <Check size={9} strokeWidth={2.5} />}
              </span>
              <div
                className={[
                  "jp-pipeline-line",
                  isLast ? "is-invisible" : "",
                  rightFilled ? "is-filled" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              />
            </div>
            <span className="jp-pipeline-label">{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function StatRow({ icon: Icon, label, value }) {
  return (
    <div className="jp-stat-row">
      <Icon size={12} className="jp-stat-icon" />
      <span className="jp-stat-label">{label}</span>
      <span className="jp-stat-value" title={value}>
        {value}
      </span>
    </div>
  );
}

function EmptyText({ children }) {
  return <p className="jp-empty">{children}</p>;
}

/* ─── Page ───────────────────────────────────────────────── */

function JobDetailsPage({ activeJob, libraryStore, onBackToLibrary }) {
  if (!activeJob) {
    return (
      <PageShell scrollable={false}>
        <PageSection>
          <JobDetailTextBlock title="Job not found">
            <EmptyText>Go back to the library and select another job.</EmptyText>
          </JobDetailTextBlock>
        </PageSection>
      </PageShell>
    );
  }

  const statusOptions = getLibraryStatusOptions();
  const currentStatusValue =
    normalizeStatusValue(activeJob.status) || "unapplied";

  const selectedStatusOption =
    statusOptions.find((option) => option.value === currentStatusValue) ??
    statusOptions[0];

  const statusSelectOptions = statusOptions.map((option) => ({
    value: option.rawLabel,
    label: option.label,
  }));

  const extractedJobId = extractJobId(activeJob.jobUrl);
  const numericJobId = extractedJobId?.match(/\d+/)?.[0];
  const jobId = numericJobId || "N/A";

  const appliedDate = formatLibraryAppliedDate(activeJob.appliedAt, {
    fallback: "—",
    year: "numeric",
  });

  const createdDate = formatLibraryAppliedDate(activeJob.createdAt, {
    fallback: "—",
    year: "numeric",
  });

  const locationText = formatLibraryLocation(activeJob.location, "—");

  async function updateJob(changes) {
    await libraryStore.updateItem(activeJob.id, {
      ...activeJob,
      ...changes,
    });
  }

  async function handleStatusChange(nextRawLabel) {
    const nextOption = statusOptions.find(
      (option) => option.rawLabel === nextRawLabel,
    );
    if (!nextOption) return;

    const wasUnapplied = currentStatusValue === "unapplied";
    const becomingActive = nextOption.value !== "unapplied";

    const changes = { status: nextOption.rawLabel };

    if (wasUnapplied && becomingActive && !activeJob.appliedAt) {
      changes.appliedAt = new Date().toISOString();
    }

    await updateJob(changes);
  }

  async function handlePriorityChange(nextPriority) {
    await updateJob({ priority: nextPriority });
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
    <motion.div
      className="jp-page"
      initial={{ y: 14 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <PageShell scrollable={false}>
        {/* ── Pipeline + Controls ───────────────────────── */}
        <motion.div
          className="jp-toolbar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <Pipeline status={selectedStatusOption?.rawLabel} />

          <div className="jp-toolbar-controls">
            <div className="jp-hero-picks">
              <SelectMenu
                value={selectedStatusOption?.rawLabel ?? "Unapplied"}
                onChange={handleStatusChange}
                options={statusSelectOptions}
                className="jp-hero-pick"
              />
              <SelectMenu
                value={activeJob.priority || "Medium"}
                onChange={handlePriorityChange}
                options={PRIORITY_OPTIONS}
                className="jp-hero-pick"
              />
            </div>
            <div className="jp-hero-sep" />
            <div className="jp-hero-actions">
              <button
                type="button"
                className="jp-hero-btn"
                onClick={handleTemporaryArchive}
                title="Archive"
              >
                <Archive size={14} />
              </button>
              <button
                type="button"
                className="jp-hero-btn jp-hero-btn--destructive"
                onClick={handleDeleteApplication}
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Body ─────────────────────────────────────── */}
        <motion.div
          className="jp-body"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, delay: 0.1 }}
        >
          {/* Sidebar */}
          <aside className="jp-sidebar">
            <p className="jp-sidebar-eyebrow">Details</p>

            <div className="jp-stats">
              <StatRow icon={Calendar} label="Applied" value={appliedDate} />
              <StatRow icon={CalendarPlus} label="Added" value={createdDate} />
              <StatRow icon={Hash} label="Job ID" value={jobId} />
              <StatRow icon={MapPin} label="Location" value={locationText} />
            </div>

            <div className="jp-sidebar-rule" />

            <div className="jp-sidebar-contact">
              <EditableJobDetailCard
                title="Contact"
                value={activeJob.contactInfo}
                placeholder="Recruiter name, email, LinkedIn, or follow-up notes"
                emptyText={
                  <span className="jp-contact-empty">
                    <Mail size={13} />
                    No contact on file
                  </span>
                }
                multiline={false}
                onSave={(contactInfo) => updateJob({ contactInfo })}
              />
            </div>
          </aside>

          {/* Notes */}
          <div className="jp-main">
            <EditableJobDetailCard
              title="Notes"
              value={activeJob.notes}
              placeholder={`# Follow-up plan\n\n- Tailor resume\n- Apply\n- Follow up in 1 week`}
              emptyText="Click here to add notes"
              onSave={(notes) => updateJob({ notes })}
            />
          </div>
        </motion.div>
      </PageShell>
    </motion.div>
  );
}

export default JobDetailsPage;
