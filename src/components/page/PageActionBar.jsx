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
  sortTriggerClick,
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
    <div className={`page-action-bar ${className}`.trim()}>
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
              className="input-base page-action-bar-search-input"
            />
          </div>
        ) : (
          <div className="page-action-bar-spacer" />
        )}

        {shouldShowSort ? (
          <SelectMenu
            value={sortValue}
            onChange={onSortChange}
            options={sortOptions}
            className="page-action-bar-select page-action-bar-sort-select"
            onTriggerClick={sortTriggerClick}
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

      {primaryAction ? (
        <div className="page-action-bar-primary-action">{primaryAction}</div>
      ) : null}
    </div>
  );
}

export default PageActionBar;
