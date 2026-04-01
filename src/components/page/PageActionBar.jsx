function PageActionBar({
  searchValue,
  onSearchChange,
  sortValue,
  onSortChange,
  sortOptions = [],
  primaryAction,
  searchPlaceholder = "Search...",
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col gap-3 md:flex-row">
        <input
          type="text"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />

        <select
          value={sortValue}
          onChange={(event) => onSortChange(event.target.value)}
          className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm text-slate-700 outline-none"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {primaryAction ? <div>{primaryAction}</div> : null}
    </div>
  );
}

export default PageActionBar;