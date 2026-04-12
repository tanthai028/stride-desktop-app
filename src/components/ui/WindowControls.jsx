import {
  closeWindow,
  minimizeWindow,
  toggleMaximizeWindow,
} from "../../lib/windowControls.js";

function WindowControls() {
  return (
    <div className="window-controls-shell no-drag flex gap-2 rounded-full">
      <button
        type="button"
        aria-label="Minimize"
        onClick={minimizeWindow}
        className="window-control-dot window-control-minimize"
      />
      <button
        type="button"
        aria-label="Maximize"
        onClick={toggleMaximizeWindow}
        className="window-control-dot window-control-maximize"
      />
      <button
        type="button"
        aria-label="Close"
        onClick={closeWindow}
        className="window-control-dot window-control-close"
      />
    </div>
  );
}

export default WindowControls;
