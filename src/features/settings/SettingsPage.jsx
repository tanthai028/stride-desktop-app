import { RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import PageShell from "../../components/page/PageShell.jsx";
import PageSection from "../../components/page/PageSection.jsx";
import SettingsToggleRow from "./components/SettingsToggleRow.jsx";
import SettingsChoiceRow from "./components/SettingsChoiceRow.jsx";
import { settingsSections } from "./config/settingsSections.js";
import ActionButton from "../../components/ui/ActionButton.jsx";

function SettingsPage({ settings, updateSetting, resetSettings }) {
  const motionProps = {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45 },
  };

  const resetButton = (
    <div className="settings-reset-action">
      <ActionButton onClick={resetSettings} tone="violet" withIcon>
        <RotateCcw size={16} className="shrink-0" />
        <span>Reset to Default</span>
      </ActionButton>
    </div>
  );

  return (
    <motion.div className="settings-page" {...motionProps}>
      <PageShell
        eyebrow="⚙️ Settings"
        title="App Preferences"
        description="Manage template behavior and local preferences."
      >
        <div className="settings-page-content">
          {settingsSections.map((section) => (
            <PageSection
              key={section.id}
              title={section.title}
              description={section.description}
              className="settings-page-section"
              headerAction={section.id === "display" ? resetButton : null}
            >
              <div className="settings-page-section-content">
                {section.items.map((item) => {
                  if (item.type === "choice") {
                    return (
                      <SettingsChoiceRow
                        key={item.id}
                        title={item.title}
                        description={item.description}
                        value={settings[item.id]}
                        options={item.options}
                        onChange={(value) => updateSetting(item.id, value)}
                      />
                    );
                  }

                  return (
                    <SettingsToggleRow
                      key={item.id}
                      title={item.title}
                      description={item.description}
                      checked={settings[item.id]}
                      onToggle={() =>
                        updateSetting(item.id, !settings[item.id])
                      }
                    />
                  );
                })}
              </div>
            </PageSection>
          ))}
        </div>
      </PageShell>
    </motion.div>
  );
}

export default SettingsPage;
