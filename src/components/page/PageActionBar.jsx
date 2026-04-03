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
    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col gap-3 md:flex-row">
        <div className="flex w-full items-center gap-3">
          <Search size={16} className="shrink-0 text-slate-400" />
          <input
            type="text"
            spellCheck={false}
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="input-base"
          />
        </div>

        <SelectMenu
          value={sortValue}
          onChange={onSortChange}
          options={sortOptions}
          className="md:w-auto"
        />
      </div>

      {primaryAction ? <div>{primaryAction}</div> : null}
    </div>
  );
}

export default PageActionBar;
