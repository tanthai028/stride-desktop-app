import { useState } from "react";
import ApplyModeHeader from "./components/ApplyModeHeader.jsx";
import ApplyModeSettingsModal from "./components/ApplyModeSettingsModal.jsx";
import CompletedJobsSection from "./components/CompletedJobsSection.jsx";
import CurrentJobSection from "./components/CurrentJobSection.jsx";
import useApplyModeSession from "./hooks/useApplyModeSession.js";
import useApplyModeWindowEffects from "./hooks/useApplyModeWindowEffects.js";

function ApplyModePanel({
  items = [],
  updateItem,
  deleteItem,
  settings,
  updateSetting,
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [isClickThrough, setIsClickThrough] = useState(false);

  const applyModeScale = settings?.applyModeScale ?? 100;
  const applyModeOpacity = settings?.applyModeOpacity ?? 100;

  const session = useApplyModeSession({
    items,
    updateItem,
    deleteItem,
  });

  useApplyModeWindowEffects({
    applyModeScale,
    applyModeOpacity,
    isClickThrough,
    showSettings,
  });

  return (
    <section className="apply-mode-screen">
      <div className="apply-mode-panel no-drag">
        <ApplyModeHeader
          isApplying={session.isApplying}
          currentItem={session.currentItem}
          isClickThrough={isClickThrough}
          setIsClickThrough={setIsClickThrough}
          onApply={session.handleApply}
          onToggleSettings={() => setShowSettings((current) => !current)}
          queueItems={session.queueItems}
          skippedIds={session.skippedIds}
          resetApplySession={session.resetApplySession}
        />

        {showSettings ? (
          <ApplyModeSettingsModal
            applyModeScale={applyModeScale}
            applyModeOpacity={applyModeOpacity}
            updateSetting={updateSetting}
            onClose={() => setShowSettings(false)}
          />
        ) : null}

        <main
          className={`apply-mode-body ${
            session.isRecentExpanded ? "is-recent-expanded" : ""
          }`}
        >
          {!session.isRecentExpanded ? (
            <CurrentJobSection
              currentItem={session.currentItem}
              progressText={session.progressText}
              skippedCount={session.skippedCount}
              isMovingCard={session.isMovingCard}
              onApply={session.handleApply}
              onDone={session.handleDone}
              onSkip={session.handleSkip}
              onRemove={session.handleRemove}
            />
          ) : null}

          <CompletedJobsSection
            completedItems={session.completedItems}
            filteredCompletedItems={session.filteredCompletedItems}
            visibleRecentItems={session.visibleRecentItems}
            isRecentExpanded={session.isRecentExpanded}
            setIsRecentExpanded={session.setIsRecentExpanded}
            showAppliedRecent={session.showAppliedRecent}
            setShowAppliedRecent={session.setShowAppliedRecent}
            showSkippedRecent={session.showSkippedRecent}
            setShowSkippedRecent={session.setShowSkippedRecent}
            shouldShowFilteredEmpty={session.shouldShowFilteredEmpty}
            canShowFilteredEmpty={session.canShowFilteredEmpty}
            setCanShowFilteredEmpty={session.setCanShowFilteredEmpty}
            openJobUrl={session.openJobUrl}
          />
        </main>
      </div>
    </section>
  );
}

export default ApplyModePanel;
