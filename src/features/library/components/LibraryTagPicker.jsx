function LibraryTagPicker({ tagOptions, selectedTagValue, onTagClick }) {
  return (
    <div className="space-y-3">
      <label className="library-tag-label block text-sm font-medium">
        🔖 Tag
      </label>

      <div className="flex flex-wrap gap-2">
        {tagOptions.map((option) => {
          const isSelected = selectedTagValue === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onTagClick(option)}
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

export default LibraryTagPicker;
