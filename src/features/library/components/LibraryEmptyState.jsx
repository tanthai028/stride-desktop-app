import EmptyState from "../../../components/page/EmptyState.jsx";

function LibraryEmptyState({ hasItems, onClearFilters, onAddItem }) {
  if (!hasItems) {
    return (
      <EmptyState
        title="📭 Your library is empty"
        description="Add your first item to start building your reusable collection."
        action={
          <button
            type="button"
            onClick={onAddItem}
            className="interactive rounded-2xl bg-pink-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:scale-[1.01]"
          >
            ✨ Add First Item
          </button>
        }
      />
    );
  }

  return (
    <EmptyState
      title="🔎 No matching library items"
      description="Try a different search or clear your filters to see available items."
      action={
        <button
          type="button"
          onClick={onClearFilters}
          className="interactive rounded-2xl bg-pink-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:scale-[1.01]"
        >
          Clear Filters
        </button>
      }
    />
  );
}

export default LibraryEmptyState;
