import { motion } from "framer-motion";

function StatCard({
  label,
  title,
  description,
  tone = "pink",
  className = "",
}) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className={`surface-card stat-card stat-card--${tone} rounded-[28px] p-5 ${className}`}
    >
      <p
        className={`stat-card-label stat-card-label--${tone} mb-2 text-sm font-medium`}
      >
        {label}
      </p>
      <h2 className="stat-card-title text-xl font-semibold">{title}</h2>
      <p className="stat-card-description mt-2 text-sm">{description}</p>
    </motion.div>
  );
}

export default StatCard;
