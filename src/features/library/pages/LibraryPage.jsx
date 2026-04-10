import { motion } from "framer-motion";
import { useMemo } from "react";
import PageShell from "../../../components/page/PageShell.jsx";
import LibraryFormModal from "../components/LibraryFormModal.jsx";
import LibraryCollectionSection from "../components/LibraryCollectionSection.jsx";
import { getFilteredAndSortedLibraryItems } from "../utils/libraryItems.js";
import useLibraryItems from "../hooks/useLibraryItems.js";
import useLibraryPageState from "../hooks/useLibraryPageState.js";

function LibraryPage({ settings }) {
  const { items, addItem, updateItem, deleteItem } = useLibraryItems();

  const {
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
  } = useLibraryPageState();

  const filteredItems = useMemo(() => {
    return getFilteredAndSortedLibraryItems(items, searchValue, sortValue);
  }, [items, searchValue, sortValue]);

  function handleAddItem(formValues) {
    addItem(formValues);
    closeModal();
  }

  function handleUpdateItem(formValues) {
    if (!selectedItem) return;

    updateItem(selectedItem.id, formValues);
    closeModal();
  }

  function handleDeleteItem() {
    if (!selectedItem) return;

    deleteItem(selectedItem.id);
    closeModal();
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
        description="Track saved applications, notes, and status details in one place."
        scrollable={false}
      >
        <LibraryCollectionSection
          items={items}
          filteredItems={filteredItems}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          sortValue={sortValue}
          onSortChange={setSortValue}
          isPageReady={isPageReady}
          onItemClick={openEditModal}
          onClearFilters={clearFilters}
          onAddItem={openAddModal}
        />
      </PageShell>

      <LibraryFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        item={selectedItem}
        onClose={closeModal}
        onSubmit={modalMode === "edit" ? handleUpdateItem : handleAddItem}
        onDelete={handleDeleteItem}
      />
    </motion.div>
  );
}

export default LibraryPage;
