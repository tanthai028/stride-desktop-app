import { motion } from "framer-motion";
import {
  closeWindow,
  minimizeWindow,
  toggleMaximizeWindow,
} from "../../lib/windowControls.js";

function WindowControls() {
  return (
    <div className="window-controls-shell surface-card-soft no-drag flex gap-2 rounded-full">
      <motion.button
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.12 }}
        type="button"
        aria-label="Minimize"
        onClick={minimizeWindow}
        className="window-control-dot window-control-minimize"
      />
      <motion.button
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.12 }}
        type="button"
        aria-label="Maximize"
        onClick={toggleMaximizeWindow}
        className="window-control-dot window-control-maximize"
      />
      <motion.button
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.12 }}
        type="button"
        aria-label="Close"
        onClick={closeWindow}
        className="window-control-dot window-control-close"
      />
    </div>
  );
}

export default WindowControls;
