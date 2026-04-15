import SelectMenu from "../ui/SelectMenu.jsx";

function PageActionBar({
  searchValue,
  onSearchChange,
  sortValue,
  onSortChange,
  sortOptions = [],
  filterValue,
  onFilterChange,
  filterOptions = [],
  extraControls = null,
  primaryAction,
  searchPlaceholder = "Search...",
  showSearch = true,
  className = "",
}) {
  const shouldShowSort =
    typeof onSortChange === "function" &&
    Array.isArray(sortOptions) &&
    sortOptions.length > 0;

  const shouldShowFilter =
    typeof onFilterChange === "function" &&
    Array.isArray(filterOptions) &&
    filterOptions.length > 0;

  return (
    <div className={`page-action-bar ${className}`}>
      <div className="page-action-bar-row">
        {extraControls}

        {showSearch ? (
          <div className="page-action-bar-search">
            <input
              type="text"
              spellCheck={false}
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              className="input-base min-w-0 flex-1"
            />
          </div>
        ) : (
          <div className="flex-1" />
        )}

        {shouldShowSort ? (
          <SelectMenu
            value={sortValue}
            onChange={onSortChange}
            options={sortOptions}
            className="page-action-bar-select page-action-bar-sort-select"
          />
        ) : null}

        {shouldShowFilter ? (
          <SelectMenu
            value={filterValue}
            onChange={onFilterChange}
            options={filterOptions}
            className="page-action-bar-select page-action-bar-filter-select"
          />
        ) : null}
      </div>

      {primaryAction ? <div>{primaryAction}</div> : null}
    </div>
  );
}

export default PageActionBar;
