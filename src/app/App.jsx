import { useState } from "react";
import { motion } from "framer-motion";
import WindowFrame from "../components/layout/WindowFrame.jsx";
import AppHeader from "../components/layout/AppHeader.jsx";
import SummaryCards from "../components/sections/SummaryCards.jsx";
import DashboardPreview from "../components/sections/DashboardPreview.jsx";
import QuickActionsPanel from "../components/sections/QuickActionsPanel.jsx";
import { useSettings } from "../features/settings/hooks/useSettings.js";
import SettingsPanel from "../features/settings/components/SettingsPanel.jsx";

function App() {
  const { settings, updateSetting, resetSettings } = useSettings();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const motionProps = settings.animationsEnabled
    ? {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45 },
      }
    : {};

  function handleQuickAction(actionId) {
    if (actionId === "settings") {
      setIsSettingsOpen(true);
    }
  }

  return (
    <WindowFrame>
      <div className="mx-auto max-w-6xl">
        <AppHeader />

        <motion.div
          {...motionProps}
          className={`rounded-[36px] border border-white/50 bg-white/45 shadow-[0_20px_80px_rgba(180,180,255,0.12)] backdrop-blur-3xl ${
            settings.compactMode ? "p-4" : "p-5"
          }`}
        >
          <SummaryCards />

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-[1.2fr_0.8fr]">
            <DashboardPreview />
            <QuickActionsPanel onAction={handleQuickAction} />
          </div>
        </motion.div>
      </div>

      <SettingsPanel
        isOpen={isSettingsOpen}
        settings={settings}
        updateSetting={updateSetting}
        resetSettings={resetSettings}
        onClose={() => setIsSettingsOpen(false)}
      />
    </WindowFrame>
  );
}

export default App;