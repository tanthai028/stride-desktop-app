import { RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import PageShell from "../../components/page/PageShell.jsx";
import PageSection from "../../components/page/PageSection.jsx";
import ApplicationBackupPanel from "./components/ApplicationBackupPanel.jsx";
import ActionButton from "../../components/ui/ActionButton.jsx";

function SettingsResetCard({ onReset }) {
  return (
    <div className="settings-reset-card">
      <div className="settings-reset-card-copy">
        <p className="settings-card-title">Reset All Data</p>
        <p className="settings-card-description">
          Clear all applications and restore default settings
        </p>
      </div>

      <ActionButton onClick={onReset} tone="violet" withIcon>
        <RotateCcw size={14} className="shrink-0" />
        <span>Reset Default Settings</span>
      </ActionButton>
    </div>
  );
}

function SettingsPage({ settings, updateSetting, resetSettings }) {
  const motionProps = {
    initial: { y: 14, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.45, ease: "easeOut" },
    style: { willChange: "opacity, transform", isolation: "isolate" },
  };

  return (
    <motion.div className="settings-page" {...motionProps}>
      <PageShell>
        <div className="settings-page-content">
          <PageSection
            title="Data"
            description="Back up, restore, import, and export your application tracker."
            className="settings-page-section"
          >
            <div className="settings-page-section-content">
              <ApplicationBackupPanel />
              <SettingsResetCard onReset={resetSettings} />
            </div>
          </PageSection>
        </div>
      </PageShell>
    </motion.div>
  );
}

export default SettingsPage;
