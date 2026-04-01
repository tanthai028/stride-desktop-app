import { motion } from "framer-motion";

function PageCard({
  children,
  className = "",
  onClick,
  disableMotion = false,
}) {
  const baseClass = `rounded-[30px] border border-white/70 bg-white/70 p-6 shadow-lg ${
    onClick ? "cursor-pointer" : ""
  } ${className}`;

  if (disableMotion) {
    return (
      <div onClick={onClick} className={baseClass}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={onClick}
      className={baseClass}
    >
      {children}
    </motion.div>
  );
}

export default PageCard;
