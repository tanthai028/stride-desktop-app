import PageShell from "../../../components/page/PageShell.jsx";
import PageSection from "../../../components/page/PageSection.jsx";
import PageCard from "../../../components/page/PageCard.jsx";
import { libraryItems } from "../../../data/libraryItems.js";

function LibraryPage() {
  return (
    <PageShell
      eyebrow="Library"
      title="Saved Building Blocks"
      description="A simple third page to prove the template scales across more sections."
    >
      <PageSection
        title="Items"
        description="Example cards rendered from shared data."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {libraryItems.map((item) => (
            <PageCard key={item.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-slate-800">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    {item.description}
                  </p>
                </div>

                <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-500">
                  {item.tag}
                </span>
              </div>
            </PageCard>
          ))}
        </div>
      </PageSection>
    </PageShell>
  );
}

export default LibraryPage;