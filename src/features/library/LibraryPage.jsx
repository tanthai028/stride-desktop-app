import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import PageShell from "../../components/page/PageShell.jsx";
import LibraryCollectionSection from "./components/LibraryCollectionSection.jsx";
import LibraryFormModal from "./components/form/LibraryFormModal.jsx";
import { DEFAULT_LIBRARY_STATUS_FILTER } from "./constants/libraryPageState.js";
import useLibraryPageState from "./hooks/useLibraryPageState.js";
import {
  applyTableColumnFilters,
  getFilteredAndSortedLibraryItems,
} from "./utils/libraryItemSelectors.js";
import { extractJobId } from "./utils/libraryDisplayFormatters.js";

const FALLBACK_MODAL_ERROR = "Something went wrong. Please try again.";

function LibraryPage({ settings, updateSetting, libraryStore }) {
  const { items, hasLoaded, loadError, addItem, updateItem, deleteItem } =
    libraryStore;
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
    tableDateScope,
    setTableDateScope,
    tableColumnFilters,
    setTableColumnFilters,
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
    const displayItems = items.map((item) => ({
      ...item,
      jobId: extractJobId(item.jobUrl),
    }));

    const pinnedItems = displayItems.filter((item) => item.pinned);
    const unpinnedItems = displayItems.filter((item) => !item.pinned);

    const filteredUnpinnedItems = getFilteredAndSortedLibraryItems(
      unpinnedItems,
      searchValue,
      activeSortValue,
      activeStatusFilterValue,
    );

    return [
      ...pinnedItems,
      ...applyTableColumnFilters(
        filteredUnpinnedItems,
        tableColumnFilters,
        tableDateScope,
      ),
    ];
  }, [
    activeSortValue,
    activeStatusFilterValue,
    items,
    searchValue,
    tableColumnFilters,
    tableDateScope,
  ]);

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

  async function handleTogglePinned(item) {
    if (!item?.id) return;
    await updateItem(item.id, { pinned: !item.pinned });
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
          hasLoaded={hasLoaded}
          onItemClick={handleOpenEditModal}
          onClearFilters={clearFilters}
          onAddItem={handleOpenAddModal}
          tableDateScope={tableDateScope}
          onTableDateScopeChange={setTableDateScope}
          tableColumnFilters={tableColumnFilters}
          onTableColumnFiltersChange={setTableColumnFilters}
          onTogglePinned={handleTogglePinned}
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
