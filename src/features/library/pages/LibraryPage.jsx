import { motion } from "framer-motion";
import { useMemo } from "react";
import PageShell from "../../../components/page/PageShell.jsx";
import PageSection from "../../../components/page/PageSection.jsx";
import ItemGrid from "../../../components/page/ItemGrid.jsx";
import PageActionBar from "../../../components/page/PageActionBar.jsx";
import LibraryCard from "../components/LibraryCard.jsx";
import LibraryFormModal from "../components/LibraryFormModal.jsx";
import LibraryEmptyState from "../components/LibraryEmptyState.jsx";
import { librarySortOptions } from "../constants/sortOptions.js";
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
  } = useLibraryPageState(settings.animationsEnabled);

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

  const motionProps = settings.animationsEnabled
    ? {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45 },
      }
    : {};

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
        description="last updated: September 2024"
        actions={
          <button
            type="button"
            onClick={openAddModal}
            className="interactive rounded-2xl bg-pink-200 pl-3 px-4 py-3 text-sm font-medium text-slate-700 transition hover:scale-[1.01]"
          >
            <span className="whitespace-nowrap">➕ Card</span>
          </button>
        }
      >
        <PageSection
          title="All Applications"
          description="Total Jobs Applied: 10"
        >
          <PageActionBar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            sortValue={sortValue}
            onSortChange={setSortValue}
            sortOptions={librarySortOptions}
            searchPlaceholder="Search job applications..."
          />

          <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-2 pb-6 scrollbar-hide">
            {filteredItems.length > 0 ? (
              <ItemGrid
                items={filteredItems}
                onItemClick={isPageReady ? openEditModal : undefined}
                renderItem={(item) => <LibraryCard item={item} />}
              />
            ) : (
              <LibraryEmptyState
                hasItems={items.length > 0}
                onClearFilters={clearFilters}
                onAddItem={openAddModal}
              />
            )}
          </div>
        </PageSection>
      </PageShell>

      <LibraryFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        item={selectedItem}
        isDarkMode={settings.darkMode}
        onClose={closeModal}
        onSubmit={modalMode === "edit" ? handleUpdateItem : handleAddItem}
        onDelete={handleDeleteItem}
      />
    </motion.div>
  );
}

export default LibraryPage;
