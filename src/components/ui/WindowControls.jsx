/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import {
  closeWindow,
  minimizeWindow,
  toggleMaximizeWindow,
} from "../../lib/windowControls.js";

function WindowControls() {
  return (
    <div className="window-controls-shell no-drag flex gap-2 rounded-full bg-white/20 px-3 py-2 backdrop-blur-md shadow-sm">
      <motion.button
        whileHover={{ scale: 1.08, y: -1 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 500, damping: 20 }}
        type="button"
        aria-label="Minimize"
        onClick={minimizeWindow}
        className="h-4.5 w-4.5 cursor-pointer rounded-full bg-emerald-400/80 shadow-sm hover:bg-emerald-400/90 focus:outline-none"
      />
      <motion.button
        whileHover={{ scale: 1.08, y: -1 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 500, damping: 20 }}
        type="button"
        aria-label="Maximize"
        onClick={toggleMaximizeWindow}
        className="h-4.5 w-4.5 cursor-pointer rounded-full bg-amber-400/80 shadow-sm hover:bg-amber-400/90 hover:shadow-md focus:outline-none"
      />
      <motion.button
        whileHover={{ scale: 1.08, y: -1 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 500, damping: 20 }}
        type="button"
        aria-label="Close"
        onClick={closeWindow}
        className="h-4.5 w-4.5 cursor-pointer rounded-full bg-rose-400/80 shadow-sm hover:bg-rose-400/90 hover:shadow-md focus:outline-none"
      />
    </div>
  );
}

export default WindowControls;
