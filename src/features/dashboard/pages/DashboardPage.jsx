import { motion } from "framer-motion";
import SummaryCards from "../../../components/sections/SummaryCards.jsx";
import DashboardPreview from "../../../components/sections/DashboardPreview.jsx";
import QuickActionsPanel from "../../../components/sections/QuickActionsPanel.jsx";

function DashboardPage({ settings, onAction }) {
  const motionProps = settings.animationsEnabled
    ? {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45 },
      }
    : {};

  return (
    <motion.div
      {...motionProps}
      className={`rounded-[36px] border border-white/50 bg-white/45 shadow-[0_20px_80px_rgba(180,180,255,0.12)] backdrop-blur-3xl ${
        settings.compactMode ? "p-4" : "p-5"
      }`}
    >
      <SummaryCards />

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-[1.2fr_0.8fr]">
        <DashboardPreview />
        <QuickActionsPanel onAction={onAction} />
      </div>
    </motion.div>
  );
}

export default DashboardPage;