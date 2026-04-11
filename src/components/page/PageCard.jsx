import { motion } from "framer-motion";

function PageCard({
  children,
  className = "",
  onClick,
  disableMotion = false,
}) {
  const baseClass = `surface-card rounded-[30px] p-6 ${
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
      className={`${baseClass}`}
    >
      {children}
    </motion.div>
  );
}

export default PageCard;
