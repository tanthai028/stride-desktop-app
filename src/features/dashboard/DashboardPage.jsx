import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import SummaryCards from "./components/SummaryCards.jsx";
import DashboardPreview from "./components/DashboardPreview.jsx";
import QuickActionsPanel from "./components/QuickActionsPanel.jsx";
import PageShell from "../../components/page/PageShell.jsx";
import PageSection from "../../components/page/PageSection.jsx";

function DashboardPage({ onAction }) {
  const [showBottomFade, setShowBottomFade] = useState(false);
  const scrollRef = useRef(null);

  const motionProps = {
    initial: { y: 14 },
    animate: { y: 0 },
    transition: { duration: 0.45 },
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const updateBottomFade = () => {
      const hasOverflow = container.scrollHeight > container.clientHeight + 4;
      const isNearBottom =
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 4;

      setShowBottomFade(hasOverflow && !isNearBottom);
    };

    updateBottomFade();

    container.addEventListener("scroll", updateBottomFade);
    window.addEventListener("resize", updateBottomFade);

    return () => {
      container.removeEventListener("scroll", updateBottomFade);
      window.removeEventListener("resize", updateBottomFade);
    };
  }, []);

  return (
    <motion.div {...motionProps} className="flex min-h-0 flex-1 flex-col">
      <PageShell>
        <div className="relative flex min-h-0 flex-1 flex-col">
          <div
            ref={scrollRef}
            className="min-h-0 flex-1 overflow-y-auto scrollbar-hide"
          >
            <div className="flex min-h-full flex-col">
              <PageSection
                className="shrink-0 flex-none"
                title="✨ Summary"
                description="Small reusable stat cards for top-level information."
              >
                <SummaryCards />
              </PageSection>

              <div className="mt-6 grid min-h-0 grid-cols-1 gap-5 md:grid-cols-[1.2fr_0.8fr]">
                <PageSection
                  title="📊 Preview"
                  description="Example progress rows inside a reusable content card."
                >
                  <DashboardPreview />
                </PageSection>

                <PageSection
                  title="⚡ Actions"
                  description="Quick actions that navigate or trigger future workflows."
                >
                  <QuickActionsPanel onAction={onAction} />
                </PageSection>
              </div>
            </div>
          </div>
        </div>
      </PageShell>
    </motion.div>
  );
}

export default DashboardPage;
