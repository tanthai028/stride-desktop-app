import { motion } from "framer-motion";
import PageShell from "../../../components/page/PageShell.jsx";
import PageSection from "../../../components/page/PageSection.jsx";
import PageCard from "../../../components/page/PageCard.jsx";
import SettingsToggleRow from "../components/SettingsToggleRow.jsx";
import { settingsSections } from "../config/settingsSections.js";

function SettingsPage({ settings, updateSetting, resetSettings }) {
  const motionProps = settings.animationsEnabled
    ? {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45 },
      }
    : {};

  return (
    <motion.div {...motionProps}>
      <PageShell
        eyebrow="Settings"
        title="App Preferences"
        description="Manage template behavior and local preferences."
        actions={
          <button
            type="button"
            onClick={resetSettings}
            className="interactive rounded-2xl bg-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:scale-[1.01]"
          >
            Reset to Default
          </button>
        }
      >
        <div className="space-y-6">
          {settingsSections.map((section) => (
            <PageSection
              key={section.id}
              title={section.title}
              description={section.description}
            >
              <PageCard>
                <div className="space-y-3">
                  {section.items.map((item) => (
                    <SettingsToggleRow
                      key={item.id}
                      title={item.title}
                      description={item.description}
                      checked={settings[item.id]}
                      onToggle={() =>
                        updateSetting(item.id, !settings[item.id])
                      }
                    />
                  ))}
                </div>
              </PageCard>
            </PageSection>
          ))}
        </div>
      </PageShell>
    </motion.div>
  );
}

export default SettingsPage;