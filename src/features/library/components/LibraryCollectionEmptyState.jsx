import EmptyState from "../../../components/page/EmptyState.jsx";
import ActionButton from "../../../components/ui/ActionButton.jsx";

export function getLibraryCollectionEmptyState({
  hasItems,
  searchValue,
  onSearchChange,
  onClearFilters,
  onAddItem,
  isTableView,
}) {
  if (isTableView && hasItems) {
    return {
      title: "🔎 No matching applications",
      description: "Try a different search to find the applications you want.",
      action: searchValue ? (
        <ActionButton onClick={() => onSearchChange("")}>
          Clear Search
        </ActionButton>
      ) : null,
      renderAsTableEmptyState: true,
    };
  }

  return {
    title: hasItems
      ? "🔎 No matching applications"
      : "📭 Your application tracker is empty",
    description: hasItems
      ? "Try a different search, status filter, sort, or view to find the applications you want."
      : "Add your first application to start tracking roles, links, and notes in one place.",
    action: hasItems ? (
      <ActionButton onClick={onClearFilters}>Clear Filters</ActionButton>
    ) : (
      <ActionButton tone="pink" withIcon onClick={onAddItem}>
        ✨ Add First Application
      </ActionButton>
    ),
    renderAsTableEmptyState: false,
  };
}

export function LibraryCollectionInlineEmptyState({
  title,
  description,
  action,
}) {
  return (
    <div className="library-empty-state-wrap">
      <EmptyState title={title} description={description} action={action} />
    </div>
  );
}

