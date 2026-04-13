import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import PageShell from "../../../components/page/PageShell.jsx";
import LibraryFormModal from "../components/LibraryFormModal.jsx";
import LibraryCollectionSection from "../components/LibraryCollectionSection.jsx";
import { getFilteredAndSortedLibraryItems } from "../utils/libraryItems.js";
import useLibraryItems from "../hooks/useLibraryItems.js";
import useLibraryPageState from "../hooks/useLibraryPageState.js";

function LibraryPage({ settings }) {
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
    statusFilterValue,
    setStatusFilterValue,
    modalMode,
    selectedItem,
    clearFilters,
    openAddModal,
    openEditModal,
    closeModal,
  } = useLibraryPageState();

  const filteredItems = useMemo(() => {
    return getFilteredAndSortedLibraryItems(
      items,
      searchValue,
      sortValue,
      statusFilterValue,
    );
  }, [items, searchValue, sortValue, statusFilterValue]);

  function handleOpenAddModal() {
    setModalErrorMessage("");
    openAddModal();
  }

  function handleOpenEditModal(item) {
    setModalErrorMessage("");
    openEditModal(item);
  }

  function handleCloseModal() {
    setModalErrorMessage("");
    closeModal();
  }

  async function handleAddItem(formValues) {
    if (formValues?.__clientValidationError) {
      setModalErrorMessage(formValues.__clientValidationError);
      return;
    }

    try {
      await addItem(formValues);

      setModalErrorMessage("");
      closeModal(); // ✅ add this back
    } catch (error) {
      setModalErrorMessage(
        error?.message || "Something went wrong. Please try again.",
      );
    }
  }

  async function handleUpdateItem(formValues) {
    if (!selectedItem) return;

    try {
      await updateItem(selectedItem.id, formValues);
      handleCloseModal();
    } catch (error) {
      setModalErrorMessage(
        error?.message || "Something went wrong. Please try again.",
      );
    }
  }

  async function handleDeleteItem() {
    if (!selectedItem) return;

    try {
      await deleteItem(selectedItem.id);
      handleCloseModal();
    } catch (error) {
      setModalErrorMessage(
        error?.message || "Something went wrong. Please try again.",
      );
    }
  }

  const motionProps = {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45 },
  };

  const isModalOpen = modalMode === "add" || modalMode === "edit";

  return (
    <motion.div
      {...motionProps}
      className="flex min-h-0 flex-1 flex-col"
      onAnimationComplete={() => {
        setIsPageReady(true);
      }}
    >
      <PageShell
        eyebrow="📚 Application Tracker"
        title="My Job Application Library"
        description="Track companies, roles, statuses, links, and notes in one place."
        scrollable={false}
      >
        {loadError ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {loadError}
          </div>
        ) : null}

        <LibraryCollectionSection
          items={items}
          filteredItems={filteredItems}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          sortValue={sortValue}
          onSortChange={setSortValue}
          statusFilterValue={statusFilterValue}
          onStatusFilterChange={setStatusFilterValue}
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
        onClearError={() => setModalErrorMessage("")}
        onClose={handleCloseModal}
        onSubmit={modalMode === "edit" ? handleUpdateItem : handleAddItem}
        onDelete={handleDeleteItem}
      />
    </motion.div>
  );
}

export default LibraryPage;
