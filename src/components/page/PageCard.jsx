import { motion } from "framer-motion";

function PageCard({ children, className = "", onClick }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={onClick}
      className={`rounded-[30px] border border-white/70 bg-white/70 p-6 shadow-lg ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default PageCard;
