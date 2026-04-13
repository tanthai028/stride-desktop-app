import { Search } from "lucide-react";
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
    <div className="mb-4 flex flex-col gap-3">
      <div className="flex min-w-0 items-center gap-3">
        {showSearch ? (
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Search size={16} className="search-icon shrink-0" />
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

        {extraControls}

        {shouldShowFilter ? (
          <SelectMenu
            value={filterValue}
            onChange={onFilterChange}
            options={filterOptions}
            className="w-[132px] shrink-0"
          />
        ) : null}

        {shouldShowSort ? (
          <SelectMenu
            value={sortValue}
            onChange={onSortChange}
            options={sortOptions}
            className="w-[110px] shrink-0"
          />
        ) : null}
      </div>

      {primaryAction ? <div>{primaryAction}</div> : null}
    </div>
  );
}

export default PageActionBar;
