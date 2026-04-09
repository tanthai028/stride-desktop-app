import { useState } from "react";

function useLibraryPageState() {
  const [isPageReady, setIsPageReady] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState("title-asc");
  const [modalMode, setModalMode] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  function clearFilters() {
    setSearchValue("");
    setSortValue("title-asc");
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
    modalMode,
    selectedItem,
    clearFilters,
    openAddModal,
    openEditModal,
    closeModal,
  };
}

export default useLibraryPageState;
