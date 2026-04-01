import { motion, AnimatePresence } from "framer-motion";
import SettingsToggleRow from "./SettingsToggleRow.jsx";

function SettingsPanel({
  isOpen,
  settings,
  updateSetting,
  resetSettings,
  onClose,
}) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="settings-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 px-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg rounded-[32px] border border-white/60 bg-white/75 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.12)] backdrop-blur-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-pink-400">Settings</p>
                <h2 className="text-2xl font-semibold text-slate-800">
                  App Preferences
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Small template settings stored locally in your browser.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-white/70 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white"
              >
                Close
              </button>
            </div>

            <div className="mt-6 space-y-3">
              <SettingsToggleRow
                label="Animations"
                description="Turn entrance animations on or off."
                checked={settings.animationsEnabled}
                onChange={() =>
                  updateSetting("animationsEnabled", !settings.animationsEnabled)
                }
              />

              <SettingsToggleRow
                label="Compact mode"
                description="Use slightly tighter spacing in the main content area."
                checked={settings.compactMode}
                onChange={() =>
                  updateSetting("compactMode", !settings.compactMode)
                }
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={resetSettings}
                className="rounded-2xl bg-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:scale-[1.01]"
              >
                Reset to Default
              </button>

              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl bg-pink-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:scale-[1.01]"
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default SettingsPanel;