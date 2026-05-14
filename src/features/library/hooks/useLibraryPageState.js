import { useState } from "react";
import {
  DEFAULT_LIBRARY_SORT,
  DEFAULT_LIBRARY_STATUS_FILTER,
  DEFAULT_LIBRARY_VIEW_MODE,
} from "../constants/libraryPageState.js";

function useLibraryPageState(initialViewMode = DEFAULT_LIBRARY_VIEW_MODE) {
  const [isPageReady, setIsPageReady] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState(DEFAULT_LIBRARY_SORT);
  const [tableSortValue, setTableSortValue] = useState(DEFAULT_LIBRARY_SORT);
  const [statusFilterValue, setStatusFilterValue] = useState(
    DEFAULT_LIBRARY_STATUS_FILTER,
  );
  const [tableDateScope, setTableDateScope] = useState("all");
  const [tableColumnFilters, setTableColumnFilters] = useState({
    company: ["all"],
    role: ["all"],
    status: ["all"],
    priority: ["all"],
    location: ["all"],
    appliedAt: "",
  });
  const [viewMode, setViewMode] = useState(initialViewMode);
  const [modalMode, setModalMode] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  function clearFilters() {
    setSearchValue("");
    setSortValue(DEFAULT_LIBRARY_SORT);
    setTableSortValue(DEFAULT_LIBRARY_SORT);
    setStatusFilterValue(DEFAULT_LIBRARY_STATUS_FILTER);
    setTableDateScope("all");
    setTableColumnFilters({
      company: ["all"],
      role: ["all"],
      status: ["all"],
      priority: ["all"],
      location: ["all"],
      appliedAt: "",
    });
  }

  function openAddModal() {
    if (!isPageReady) return;

    setSelectedItem(null);
    setModalMode("add");
  }

  function openEditModal(item) {
    if (!isPageReady) return;

    setSelectedItem(item);
    setModalMode("edit");
  }

  function closeModal() {
    setSelectedItem(null);
    setModalMode(null);
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
    modalMode,
    selectedItem,
    clearFilters,
    openAddModal,
    openEditModal,
    closeModal,
    tableDateScope,
    setTableDateScope,
    tableColumnFilters,
    setTableColumnFilters,
  };
}

export default useLibraryPageState;
