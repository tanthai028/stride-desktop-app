function LibraryStatusPicker({
  statusOptions,
  selectedStatusValue,
  onStatusClick,
}) {
  return (
    <div className="space-y-3">
      <label className="library-tag-label block text-sm font-medium">
        📌 Status
      </label>

      <div className="flex flex-wrap gap-2">
        {statusOptions.map((option) => {
          const isSelected = selectedStatusValue === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onStatusClick(option)}
              className={`library-tag-chip ${isSelected ? "is-selected" : ""}`}
            >
              <span className="flex items-center gap-1">
                <span>{option.emoji}</span>
                <span>{option.rawLabel}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default LibraryStatusPicker;
