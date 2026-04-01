/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

function StatCard({
  label,
  title,
  description,
  className = "",
  labelClassName = "",
}) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className={`rounded-[28px] border border-white/70 p-5 shadow-lg ${className}`}
    >
      <p className={`mb-2 text-sm font-medium ${labelClassName}`}>{label}</p>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </motion.div>
  );
}

export default StatCard;