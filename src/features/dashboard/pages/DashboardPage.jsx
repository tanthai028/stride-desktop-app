import { motion } from "framer-motion";
import SummaryCards from "../components/SummaryCards.jsx";
import DashboardPreview from "../components/DashboardPreview.jsx";
import QuickActionsPanel from "../components/QuickActionsPanel.jsx";
import PageShell from "../../../components/page/PageShell.jsx";
import PageSection from "../../../components/page/PageSection.jsx";

function DashboardPage({ settings, onAction }) {
  const motionProps = settings.animationsEnabled
    ? {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45 },
      }
    : {};

  return (
    <motion.div {...motionProps} className="flex min-h-0 flex-1 flex-col">
      <PageShell
        eyebrow="🏠 Dashboard"
        title="Overview"
        description="Preview the base template layout, cards, and quick actions."
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-6 pr-1 scrollbar-hide">
          <PageSection
            className="flex-none"
            title="✨ Summary"
            description="Small reusable stat cards for top-level information."
          >
            <SummaryCards />
          </PageSection>

          <div className="mt-5 grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.2fr)_320px]">
            <PageSection
              className="flex-none"
              title="📊 Preview"
              description="Example progress rows inside a reusable content card."
            >
              <DashboardPreview />
            </PageSection>

            <PageSection
              className="flex-none"
              title="⚡ Actions"
              description="Quick actions that can navigate or trigger future workflows."
            >
              <QuickActionsPanel onAction={onAction} />
            </PageSection>
          </div>
        </div>
      </PageShell>
    </motion.div>
  );
}

export default DashboardPage;
