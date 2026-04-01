import PageShell from "../../../components/page/PageShell.jsx";
import PageSection from "../../../components/page/PageSection.jsx";
import ItemGrid from "../../../components/page/ItemGrid.jsx";
import EmptyState from "../../../components/page/EmptyState.jsx";
import { libraryItems } from "../../../data/libraryItems.js";

function LibraryPage() {
  const hasItems = libraryItems.length > 0;

  return (
    <PageShell
      eyebrow="Library"
      title="Saved Building Blocks"
      description="A reusable list-style page with support for both filled and empty states."
    >
      <PageSection
        title="Items"
        description="Example cards rendered from shared data."
      >
        {hasItems ? (
          <ItemGrid
            items={libraryItems}
            renderItem={(item) => (
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
            )}
          />
        ) : (
          <EmptyState
            title="No library items yet"
            description="This page is ready for future saved entries, notes, resources, or reusable app content."
            action={
              <button
                type="button"
                className="rounded-2xl bg-pink-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:scale-[1.01]"
              >
                Add Sample Item
              </button>
            }
          />
        )}
      </PageSection>
    </PageShell>
  );
}

export default LibraryPage;