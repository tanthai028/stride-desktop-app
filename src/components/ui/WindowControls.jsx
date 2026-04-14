import {
  closeWindow,
  minimizeWindow,
  toggleMaximizeWindow,
} from "../../lib/windowControls.js";
import { getHoverFeedbackHandlers } from "../../lib/uiFeedback.js";

function WindowControls() {
  const hoverFeedbackHandlers = getHoverFeedbackHandlers();

  return (
    <div className="window-controls-shell no-drag flex gap-2 rounded-full">
      <button
        type="button"
        aria-label="Minimize"
        onClick={minimizeWindow}
        className="window-control-dot window-control-minimize"
        {...hoverFeedbackHandlers}
      />
      <button
        type="button"
        aria-label="Maximize"
        onClick={toggleMaximizeWindow}
        className="window-control-dot window-control-maximize"
        {...hoverFeedbackHandlers}
      />
      <button
        type="button"
        aria-label="Close"
        onClick={closeWindow}
        className="window-control-dot window-control-close"
        {...hoverFeedbackHandlers}
      />
    </div>
  );
}

export default WindowControls;
