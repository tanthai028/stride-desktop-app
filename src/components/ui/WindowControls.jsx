/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import {
  closeWindow,
  minimizeWindow,
  toggleMaximizeWindow,
} from "../../lib/windowControls.js";

function WindowControls() {
  return (
    <div className="window-controls-shell no-drag flex gap-2 rounded-full bg-white/40 px-3 py-2 backdrop-blur-md">
      <motion.button
        whileHover={{ scale: 1.12, y: -1 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 500, damping: 20 }}
        type="button"
        aria-label="Minimize"
        onClick={minimizeWindow}
        className="h-4 w-4 cursor-pointer rounded-full bg-amber-300 shadow-sm hover:brightness-110 hover:shadow-md focus:outline-none"
      />
      <motion.button
        whileHover={{ scale: 1.12, y: -1 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 500, damping: 20 }}
        type="button"
        aria-label="Maximize"
        onClick={toggleMaximizeWindow}
        className="h-4 w-4 cursor-pointer rounded-full bg-emerald-300 shadow-sm hover:brightness-110 hover:shadow-md focus:outline-none"
      />
      <motion.button
        whileHover={{ scale: 1.12, y: -1 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 500, damping: 20 }}
        type="button"
        aria-label="Close"
        onClick={closeWindow}
        className="h-4 w-4 cursor-pointer rounded-full bg-rose-300 shadow-sm hover:brightness-110 hover:shadow-md focus:outline-none"
      />
    </div>
  );
}

export default WindowControls;
