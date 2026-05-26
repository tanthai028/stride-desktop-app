import { useEffect, useState } from "react";
import { X, Save, CircleX, PauseCircle } from "lucide-react";
import ApplyModeHeader from "./components/ApplyModeHeader.jsx";
import ApplyModeSettingsModal from "./components/ApplyModeSettingsModal.jsx";
import CompletedJobsSection from "./components/CompletedJobsSection.jsx";
import CurrentJobSection from "./components/CurrentJobSection.jsx";
import useApplyModeSession from "./hooks/useApplyModeSession.js";
import useApplyModeWindowEffects from "./hooks/useApplyModeWindowEffects.js";
import {
  exitApplyModeWindow,
  setApplyModeClickThrough,
} from "../../lib/windowControls.js";

function ApplyModeExitDialog({
  onEndSession,
  onJustExit,
  onContinueLater,
  onClose,
}) {
  return (
    <div
      className="apply-mode-settings-backdrop no-drag"
      data-apply-mode-hitbox="true"
    >
      <section className="apply-mode-settings-modal apply-mode-exit-modal">
        <header className="apply-mode-settings-header">
          <h2>Exit Apply Mode?</h2>

          <button
            type="button"
            aria-label="Close exit dialog"
            onClick={onClose}
          >
            <X size="1rem" />
          </button>
        </header>

        <div className="apply-mode-settings-content apply-mode-exit-content">
          <div className="apply-mode-exit-actions">
            <button type="button" onClick={onEndSession}>
              <Save size="0.82rem" />
              <span>End session</span>
            </button>

            <button type="button" onClick={onJustExit}>
              <CircleX size="0.82rem" />
              <span>Cancel session</span>
            </button>

            <button type="button" onClick={onContinueLater}>
              <PauseCircle size="0.82rem" />
              <span>Continue later</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function ApplyModePanel({
  items = [],
  updateItem,
  deleteItem,
  settings,
  updateSetting,
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
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
    showExitDialog,
  });

  useEffect(() => {
    const cleanupShownListener = window.windowControls?.onApplyModeShown?.(
      () => {
        setShowExitDialog(false);
        setShowSettings(false);
        setIsClickThrough(false);
      },
    );

    return () => cleanupShownListener?.();
  }, []);

  function exitApplyMode() {
    setShowExitDialog(false);
    setShowSettings(false);
    setIsClickThrough(false);
    setApplyModeClickThrough(false);
    exitApplyModeWindow();
  }

  function handleEndSession() {
    session.endAndSaveSession();
    exitApplyMode();
  }

  function handleJustExit() {
    session.exitWithoutSavingSession();
    exitApplyMode();
  }

  function handleContinueLater() {
    session.continueSessionLater();
    exitApplyMode();
  }

  return (
    <section className="apply-mode-screen">
      <div className="apply-mode-panel no-drag">
        <ApplyModeHeader
          isApplying={session.isApplying}
          isClickThrough={isClickThrough}
          setIsClickThrough={setIsClickThrough}
          elapsedSeconds={session.elapsedSeconds}
          isTimerRunning={session.isTimerRunning}
          onToggleTimer={session.handleToggleTimer}
          onToggleSettings={() => setShowSettings((current) => !current)}
          onExitRequest={() => setShowExitDialog(true)}
        />

        {showSettings ? (
          <ApplyModeSettingsModal
            applyModeScale={applyModeScale}
            applyModeOpacity={applyModeOpacity}
            updateSetting={updateSetting}
            onClose={() => setShowSettings(false)}
          />
        ) : null}

        {showExitDialog ? (
          <ApplyModeExitDialog
            onEndSession={handleEndSession}
            onJustExit={handleJustExit}
            onContinueLater={handleContinueLater}
            onClose={() => setShowExitDialog(false)}
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
              canGoBack={session.canGoBack}
              onApply={session.handleApply}
              onDone={session.handleDone}
              onSkip={session.handleSkip}
              onUnskip={session.handleUnskip}
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
