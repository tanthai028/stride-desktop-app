import { motion } from "framer-motion";
import PageShell from "../../components/page/PageShell.jsx";
import PageSection from "../../components/page/PageSection.jsx";
import NewGradFeedCard from "../dashboard/components/NewGradFeedCard.jsx";

function DiscoverPage({ libraryStore }) {
  const { items, addItem, loadError } = libraryStore;

  return (
    <motion.div
      initial={{ y: 14, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="flex min-h-0 flex-1 flex-col"
      style={{ willChange: "opacity, transform", isolation: "isolate" }}
    >
      <PageShell>
        {loadError ? (
          <div className="library-form-error">{loadError}</div>
        ) : null}

        <PageSection>
          <div className="discover-page-grid">
            <NewGradFeedCard libraryItems={items} onSaveJob={addItem} />
          </div>
        </PageSection>
      </PageShell>
    </motion.div>
  );
}

export default DiscoverPage;
