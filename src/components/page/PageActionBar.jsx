import { Search } from "lucide-react";
import SelectMenu from "../ui/SelectMenu.jsx";

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
    <div className="mb-5 flex flex-col gap-3">
      <div className="flex flex-col gap-3 min-[520px]:flex-row min-[520px]:items-center">
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

        <SelectMenu
          value={sortValue}
          onChange={onSortChange}
          options={sortOptions}
          className="w-full shrink-0 min-[520px]:w-[120px]"
        />
      </div>

      {primaryAction ? <div>{primaryAction}</div> : null}
    </div>
  );
}

export default PageActionBar;
