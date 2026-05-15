import { X } from "lucide-react";
import { setApplyModeOpacity } from "../../../lib/windowControls.js";

function ApplyModeSettingsModal({
  applyModeScale,
  applyModeOpacity,
  updateSetting,
  onClose,
}) {
  function handleScaleChange(event) {
    const nextScale = Number(event.target.value);

    updateSetting?.("applyModeScale", nextScale);
    window.windowControls?.setApplyModeScale?.(nextScale);
  }

  function handleOpacityChange(event) {
    const nextOpacity = Number(event.target.value);

    updateSetting?.("applyModeOpacity", nextOpacity);
    setApplyModeOpacity(nextOpacity);
  }

  return (
    <div
      className="apply-mode-settings-backdrop no-drag"
      data-apply-mode-hitbox="true"
    >
      <section className="apply-mode-settings-modal">
        <header className="apply-mode-settings-header">
          <h2>Apply Mode Settings</h2>

          <button type="button" aria-label="Close settings" onClick={onClose}>
            <X size="1rem" />
          </button>
        </header>

        <div className="apply-mode-settings-content">
          <div className="apply-mode-settings-row">
            <span>Scale</span>
            <strong>{applyModeScale}%</strong>
          </div>

          <input
            type="range"
            min="50"
            max="100"
            step="5"
            value={applyModeScale}
            onChange={handleScaleChange}
          />

          <p className="apply-mode-settings-help">Window size and font size</p>

          <div className="apply-mode-settings-row">
            <span>Opacity</span>
            <strong>{applyModeOpacity}%</strong>
          </div>

          <input
            type="range"
            min="35"
            max="100"
            step="5"
            value={applyModeOpacity}
            onChange={handleOpacityChange}
          />

          <p className="apply-mode-settings-help">Window transparency</p>
        </div>
      </section>
    </div>
  );
}

export default ApplyModeSettingsModal;
