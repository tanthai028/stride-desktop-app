function LibraryTagPicker({
  isDarkMode = false,
  tagOptions,
  selectedTagValue,
  onTagClick,
}) {
  return (
    <div className="space-y-3">
      <label
        className={`block text-sm font-medium ${
          isDarkMode ? "text-slate-200" : "text-slate-700"
        }`}
      >
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
              className={`rounded-full px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                isSelected
                  ? isDarkMode
                    ? "bg-pink-400/20 text-white border border-pink-400/30 shadow-[0_0_0_1px_rgba(244,114,182,0.2)]"
                    : "bg-pink-200 text-slate-800 border border-pink-300"
                  : isDarkMode
                    ? "bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-800"
              }`}
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
