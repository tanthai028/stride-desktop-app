import { motion } from "framer-motion";
import SummaryCards from "../../../components/sections/SummaryCards.jsx";
import DashboardPreview from "../../../components/sections/DashboardPreview.jsx";
import QuickActionsPanel from "../../../components/sections/QuickActionsPanel.jsx";
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
    <motion.div {...motionProps}>
      <PageShell
        eyebrow="Dashboard"
        title="Overview"
        description="Preview the base template layout, cards, and quick actions."
      >
        <PageSection
          title="Summary"
          description="Small reusable stat cards for top-level information."
        >
          <SummaryCards />
        </PageSection>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-[1.2fr_0.8fr]">
          <PageSection
            title="Preview"
            description="Example progress rows inside a reusable content card."
          >
            <DashboardPreview />
          </PageSection>

          <PageSection
            title="Actions"
            description="Quick actions that can navigate or trigger future workflows."
          >
            <QuickActionsPanel onAction={onAction} />
          </PageSection>
        </div>
      </PageShell>
    </motion.div>
  );
}

export default DashboardPage;