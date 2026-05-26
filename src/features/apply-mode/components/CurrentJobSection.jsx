import { Check, SkipBack, SkipForward, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  getCompanyIconUrl,
  handleCompanyIconFallback,
} from "../../dashboard/utils/companyIcon.utils.js";

function CurrentJobSection({
  currentItem,
  progressText,
  skippedCount,
  isMovingCard,
  canGoBack,
  onApply,
  onDone,
  onSkip,
  onUnskip,
  onRemove,
}) {
  return (
    <section className="apply-mode-current-section">
      <div className="apply-mode-section-header">
        <div className="apply-mode-section-title">
          <span>Job Queue</span>
          <div className="apply-mode-progress-pill">{progressText}</div>

          {skippedCount > 0 ? (
            <div className="apply-mode-skipped-pill">
              <SkipForward size="0.75rem" />
              {skippedCount}
            </div>
          ) : null}
        </div>

        <div className="apply-mode-inline-actions">
          <button
            type="button"
            onClick={onDone}
            disabled={!currentItem || isMovingCard}
          >
            <Check size="0.75rem" />
            Done
          </button>

          <button
            type="button"
            onClick={onSkip}
            disabled={!currentItem || isMovingCard}
            aria-label="Skip"
          >
            <SkipForward size="0.75rem" />
            Skip
          </button>

          <button
            type="button"
            onClick={onUnskip}
            disabled={!canGoBack}
            aria-label="Go back to previous skipped job"
            title="Go back"
          >
            <SkipBack size="0.75rem" />
          </button>

          <button
            type="button"
            className="apply-mode-danger-action"
            onClick={onRemove}
            disabled={!currentItem || isMovingCard}
            aria-label="Remove job"
            title="Remove job"
          >
            <Trash2 size="0.75rem" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {currentItem ? (
          <motion.button
            key={currentItem.id}
            type="button"
            className="apply-mode-current-card"
            onClick={onApply}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <span className="apply-mode-current-main">
              <span className="apply-mode-company-row">
                <img
                  className="apply-mode-company-icon"
                  src={getCompanyIconUrl(currentItem.company)}
                  alt=""
                  loading="lazy"
                  onError={(event) =>
                    handleCompanyIconFallback(event, currentItem.jobUrl)
                  }
                />

                <strong>{currentItem.company || "Unknown Company"}</strong>
              </span>

              <span>{currentItem.role || "Unknown Role"}</span>
              <em>{currentItem.location || "\u00A0"}</em>
            </span>

            <span className="apply-mode-current-action">Apply</span>
          </motion.button>
        ) : (
          <div className="apply-mode-empty">
            <strong>No unapplied jobs queued</strong>
            <span>Dump job URLs in Library first</span>
            <em>{"\u00A0"}</em>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default CurrentJobSection;
