import PageShell from "../../../components/page/PageShell.jsx";
import PageSection from "../../../components/page/PageSection.jsx";
import PageCard from "../../../components/page/PageCard.jsx";
import SettingsToggleRow from "../components/SettingsToggleRow.jsx";

function SettingsPage({ settings, updateSetting, resetSettings }) {
  return (
    <PageShell
      eyebrow="Settings"
      title="App Preferences"
      description="Manage template behavior and local preferences."
      actions={
        <button
          type="button"
          onClick={resetSettings}
          className="rounded-2xl bg-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:scale-[1.01]"
        >
          Reset to Default
        </button>
      }
    >
      <PageSection
        title="Display"
        description="Basic UI preferences stored in local storage."
      >
        <PageCard>
          <div className="space-y-3">
            <SettingsToggleRow
              title="Animations"
              description="Turn entrance animations on or off."
              checked={settings.animationsEnabled}
              onToggle={() =>
                updateSetting(
                  "animationsEnabled",
                  !settings.animationsEnabled,
                )
              }
            />

            <SettingsToggleRow
              title="Compact mode"
              description="Use slightly tighter spacing in the main content area."
              checked={settings.compactMode}
              onToggle={() =>
                updateSetting("compactMode", !settings.compactMode)
              }
            />
          </div>
        </PageCard>
      </PageSection>
    </PageShell>
  );
}

export default SettingsPage;