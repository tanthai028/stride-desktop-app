/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import WindowFrame from "../components/layout/WindowFrame.jsx";
import AppHeader from "../components/layout/AppHeader.jsx";
import SummaryCards from "../components/sections/SummaryCards.jsx";
import DashboardPreview from "../components/sections/DashboardPreview.jsx";
import QuickActionsPanel from "../components/sections/QuickActionsPanel.jsx";

function App() {
  return (
    <WindowFrame>
      <div className="mx-auto max-w-6xl">
        <AppHeader />

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="rounded-[36px] border border-white/50 bg-white/45 p-5 shadow-[0_20px_80px_rgba(180,180,255,0.12)] backdrop-blur-3xl"
        >
          <SummaryCards />

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-[1.2fr_0.8fr]">
            <DashboardPreview />
            <QuickActionsPanel />
          </div>
        </motion.div>
      </div>
    </WindowFrame>
  );
}

export default App;