import { ArrowLeft, ExternalLink } from "lucide-react";
import ActionButton from "../../../components/ui/ActionButton.jsx";
import PageShell from "../../../components/page/PageShell.jsx";
import PageSection from "../../../components/page/PageSection.jsx";
import {
  extractJobId,
  openLibraryJobUrl,
} from "../utils/libraryDisplayFormatters.js";

function DetailBlock({ title, children }) {
  return (
    <section className="job-detail-block">
      <h2 className="job-detail-block-title">{title}</h2>
      <div className="job-detail-block-body">{children}</div>
    </section>
  );
}

function EmptyText({ children }) {
  return <p className="job-detail-empty">{children}</p>;
}

function JobDetailsPage({ activeJob, onBackToLibrary }) {
  if (!activeJob) {
    return (
      <PageShell>
        <PageSection
          title="Job not found"
          description="This application no longer exists."
          headerAction={
            <ActionButton onClick={onBackToLibrary} tone="slate" withIcon>
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </ActionButton>
          }
        >
          <EmptyText>Go back to the library and select another job.</EmptyText>
        </PageSection>
      </PageShell>
    );
  }

  const jobId = extractJobId(activeJob.jobUrl) || activeJob.id;

  return (
    <PageShell>
      <PageSection
        title="Application Details"
        description="Parsed job info, requirements, contact info, and follow-up plan."
        headerAction={
          <div className="job-detail-actions">
            <ActionButton onClick={onBackToLibrary} tone="slate" withIcon>
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </ActionButton>

            {activeJob.jobUrl ? (
              <ActionButton
                onClick={(event) => openLibraryJobUrl(event, activeJob.jobUrl)}
                tone="pink"
                withIcon
              >
                <ExternalLink className="h-4 w-4" />
                <span>Open Post</span>
              </ActionButton>
            ) : null}
          </div>
        }
      >
        <div className="job-detail-grid">
          <DetailBlock title="Job Description">
            {activeJob.jobDescription ? (
              <p>{activeJob.jobDescription}</p>
            ) : (
              <EmptyText>No parsed job description yet.</EmptyText>
            )}
          </DetailBlock>

          <DetailBlock title="Requirements">
            {activeJob.requirements ? (
              <p>{activeJob.requirements}</p>
            ) : (
              <EmptyText>No parsed requirements yet.</EmptyText>
            )}
          </DetailBlock>

          <DetailBlock title="Contact Info">
            {activeJob.contactInfo ? (
              <p>{activeJob.contactInfo}</p>
            ) : (
              <EmptyText>No recruiter or contact info found.</EmptyText>
            )}
          </DetailBlock>

          <DetailBlock title="Next Steps / Follow-up">
            {activeJob.nextSteps ? (
              <p>{activeJob.nextSteps}</p>
            ) : (
              <EmptyText>
                Add follow-up notes later: recruiter message, OA deadline,
                interview prep, or resume version.
              </EmptyText>
            )}
          </DetailBlock>

          <DetailBlock title="Metadata">
            <dl className="job-detail-meta-list">
              <div>
                <dt>Status</dt>
                <dd>{activeJob.status || "-"}</dd>
              </div>

              <div>
                <dt>Priority</dt>
                <dd>{activeJob.priority || "Medium"}</dd>
              </div>

              <div>
                <dt>Location</dt>
                <dd>{activeJob.location || "-"}</dd>
              </div>

              <div>
                <dt>Job ID</dt>
                <dd>{jobId}</dd>
              </div>
            </dl>
          </DetailBlock>
        </div>
      </PageSection>
    </PageShell>
  );
}

export default JobDetailsPage;
