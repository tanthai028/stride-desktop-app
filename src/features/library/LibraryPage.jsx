import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import PageShell from "../../components/page/PageShell.jsx";
import LibraryCollectionSection from "./components/LibraryCollectionSection.jsx";
import LibraryFormModal from "./components/form/LibraryFormModal.jsx";
import { DEFAULT_LIBRARY_STATUS_FILTER } from "./constants/libraryPageState.js";
import useLibraryItems from "./hooks/useLibraryItems.js";
import useLibraryPageState from "./hooks/useLibraryPageState.js";
import { getFilteredAndSortedLibraryItems } from "./utils/libraryItemSelectors.js";

const FALLBACK_MODAL_ERROR = "Something went wrong. Please try again.";

function LibraryPage({ settings, updateSetting }) {
  const { items, hasLoaded, loadError, addItem, updateItem, deleteItem } =
    useLibraryItems(settings.resetVersion);

  const [modalErrorMessage, setModalErrorMessage] = useState("");

  const {
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
  } = useLibraryPageState(settings.libraryViewMode);

  const isTableView = viewMode === "table";
  const isModalOpen = modalMode === "add" || modalMode === "edit";
  const modalSubmitHandler =
    modalMode === "edit" ? handleUpdateItem : handleAddItem;

  const activeSortValue = isTableView ? tableSortValue : sortValue;
  const activeStatusFilterValue = isTableView
    ? DEFAULT_LIBRARY_STATUS_FILTER
    : statusFilterValue;

  const filteredItems = useMemo(() => {
    return getFilteredAndSortedLibraryItems(
      items,
      searchValue,
      activeSortValue,
      activeStatusFilterValue,
    );
  }, [items, searchValue, activeSortValue, activeStatusFilterValue]);

  useEffect(() => {
    if (settings.libraryViewMode !== viewMode) {
      updateSetting("libraryViewMode", viewMode);
    }
  }, [settings.libraryViewMode, updateSetting, viewMode]);

  function clearModalError() {
    setModalErrorMessage("");
  }

  function getErrorMessage(error) {
    return error?.message || FALLBACK_MODAL_ERROR;
  }

  function handleOpenAddModal() {
    clearModalError();
    openAddModal();
  }

  function handleOpenEditModal(item) {
    clearModalError();
    openEditModal(item);
  }

  function handleCloseModal() {
    clearModalError();
    closeModal();
  }

  async function handleAddItem(formValues) {
    if (formValues?.__clientValidationError) {
      setModalErrorMessage(formValues.__clientValidationError);
      return;
    }

    try {
      await addItem(formValues);
      handleCloseModal();
    } catch (error) {
      setModalErrorMessage(getErrorMessage(error));
    }
  }

  async function handleUpdateItem(formValues) {
    if (!selectedItem) return;

    try {
      await updateItem(selectedItem.id, formValues);
      handleCloseModal();
    } catch (error) {
      setModalErrorMessage(getErrorMessage(error));
    }
  }

  async function handleDeleteItem() {
    if (!selectedItem) return;

    try {
      await deleteItem(selectedItem.id);
      handleCloseModal();
    } catch (error) {
      setModalErrorMessage(getErrorMessage(error));
    }
  }

  return (
    <motion.div
      initial={{ y: 14 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.45 }}
      className="flex min-h-0 flex-1 flex-col"
      onAnimationComplete={() => setIsPageReady(true)}
    >
      <PageShell scrollable={false}>
        {loadError ? (
          <div className="library-form-error">{loadError}</div>
        ) : null}

        <LibraryCollectionSection
          items={items}
          filteredItems={filteredItems}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          sortValue={sortValue}
          onSortChange={setSortValue}
          tableSortValue={tableSortValue}
          onTableSortChange={setTableSortValue}
          statusFilterValue={statusFilterValue}
          onStatusFilterChange={setStatusFilterValue}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          isPageReady={isPageReady && hasLoaded}
          onItemClick={handleOpenEditModal}
          onClearFilters={clearFilters}
          onAddItem={handleOpenAddModal}
        />
      </PageShell>

      <LibraryFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        item={selectedItem}
        errorMessage={modalErrorMessage}
        onClearError={clearModalError}
        onClose={handleCloseModal}
        onSubmit={modalSubmitHandler}
        onDelete={handleDeleteItem}
      />
    </motion.div>
  );
}

export default LibraryPage;
