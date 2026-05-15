import { useState } from "react";
import {
  DEFAULT_LIBRARY_SORT,
  DEFAULT_LIBRARY_STATUS_FILTER,
  DEFAULT_LIBRARY_VIEW_MODE,
} from "../constants/libraryPageState.js";
import { EMPTY_TABLE_COLUMN_FILTERS } from "../constants/tableFilterOptions.js";

function getDefaultTableColumnFilters() {
  return {
    ...EMPTY_TABLE_COLUMN_FILTERS,
    company: [...EMPTY_TABLE_COLUMN_FILTERS.company],
    role: [...EMPTY_TABLE_COLUMN_FILTERS.role],
    status: [...EMPTY_TABLE_COLUMN_FILTERS.status],
    priority: [...EMPTY_TABLE_COLUMN_FILTERS.priority],
    location: [...EMPTY_TABLE_COLUMN_FILTERS.location],
  };
}

function useLibraryPageState(initialViewMode = DEFAULT_LIBRARY_VIEW_MODE) {
  const [isPageReady, setIsPageReady] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState(DEFAULT_LIBRARY_SORT);
  const [tableSortValue, setTableSortValue] = useState(DEFAULT_LIBRARY_SORT);
  const [statusFilterValue, setStatusFilterValue] = useState(
    DEFAULT_LIBRARY_STATUS_FILTER,
  );
  const [tableDateScope, setTableDateScope] = useState("all");
  const [tableColumnFilters, setTableColumnFilters] = useState(
    getDefaultTableColumnFilters,
  );
  const [viewMode, setViewMode] = useState(initialViewMode);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  function clearFilters() {
    setSearchValue("");
    setSortValue(DEFAULT_LIBRARY_SORT);
    setTableSortValue(DEFAULT_LIBRARY_SORT);
    setStatusFilterValue(DEFAULT_LIBRARY_STATUS_FILTER);
    setTableDateScope("all");
    setTableColumnFilters(getDefaultTableColumnFilters());
  }

  function openAddModal() {
    if (!isPageReady) return;
    setIsAddModalOpen(true);
  }

  function closeAddModal() {
    setIsAddModalOpen(false);
  }

  return {
    isPageReady,
    setIsPageReady,
    searchValue,
    setSearchValue,
    sortValue,
    setSortValue,
    tableSortValue,
    setTableSortValue,
    statusFilterValue,
    setStatusFilterValue,
    viewMode,
    setViewMode,
    isAddModalOpen,
    clearFilters,
    openAddModal,
    closeAddModal,
    tableDateScope,
    setTableDateScope,
    tableColumnFilters,
    setTableColumnFilters,
  };
}

export default useLibraryPageState;
