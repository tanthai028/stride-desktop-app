import { useState } from "react";

function useLibraryPageState() {
  const [isPageReady, setIsPageReady] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState("appliedAt-desc");
  const [tableSortValue, setTableSortValue] = useState("appliedAt-desc");
  const [statusFilterValue, setStatusFilterValue] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [modalMode, setModalMode] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  function clearFilters() {
    setSearchValue("");
    setSortValue("appliedAt-desc");
    setStatusFilterValue("all");
    setTableSortValue("appliedAt-desc");
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
  };
}

export default useLibraryPageState;
