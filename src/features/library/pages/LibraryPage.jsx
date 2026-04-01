import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import PageShell from "../../../components/page/PageShell.jsx";
import PageSection from "../../../components/page/PageSection.jsx";
import ItemGrid from "../../../components/page/ItemGrid.jsx";
import PageActionBar from "../../../components/page/PageActionBar.jsx";
import LibraryCard from "../components/LibraryCard.jsx";
import LibraryFormModal from "../components/LibraryFormModal.jsx";
import LibraryEmptyState from "../components/LibraryEmptyState.jsx";
import { librarySortOptions } from "../constants/sortOptions.js";
import { loadLibraryItems, saveLibraryItems } from "../utils/libraryStorage.js";
import {
  createItemId,
  getFilteredAndSortedLibraryItems,
} from "../utils/libraryItems.js";

function LibraryPage({ settings }) {
  const [items, setItems] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isPageReady, setIsPageReady] = useState(!settings.animationsEnabled);
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState("title-asc");
  const [modalMode, setModalMode] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (settings.animationsEnabled) {
      setIsPageReady(false);
      return;
    }

    setIsPageReady(true);
  }, [settings.animationsEnabled]);

  useEffect(() => {
    setItems(loadLibraryItems());
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded) {
      return;
    }

    saveLibraryItems(items);
  }, [items, hasLoaded]);

  const filteredItems = useMemo(() => {
    return getFilteredAndSortedLibraryItems(items, searchValue, sortValue);
  }, [items, searchValue, sortValue]);

  function clearFilters() {
    setSearchValue("");
    setSortValue("title-asc");
  }

  function handleOpenAddModal() {
    if (!isPageReady) {
      return;
    }

    setSelectedItem(null);
    setModalMode("add");
  }

  function handleOpenEditModal(item) {
    if (!isPageReady) {
      return;
    }

    setSelectedItem(item);
    setModalMode("edit");
  }

  function handleCloseModal() {
    setSelectedItem(null);
    setModalMode(null);
  }

  function handleAddItem(formValues) {
    const newItem = {
      id: createItemId(),
      ...formValues,
    };

    setItems((currentItems) => [newItem, ...currentItems]);
    handleCloseModal();
  }

  function handleUpdateItem(formValues) {
    if (!selectedItem) {
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              ...formValues,
            }
          : item,
      ),
    );

    handleCloseModal();
  }

  function handleDeleteItem() {
    if (!selectedItem) {
      return;
    }

    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== selectedItem.id),
    );

    handleCloseModal();
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
      onAnimationComplete={() => {
        setIsPageReady(true);
      }}
    >
      <PageShell
        eyebrow="📚 Library"
        title="Saved Building Blocks"
        description="A reusable list-style page with search, sorting, add/edit flows, and empty-state support."
        actions={
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="interactive rounded-2xl bg-pink-200 pl-3 px-4 py-3 text-sm font-medium text-slate-700 transition hover:scale-[1.01]"
          >
            <span className="whitespace-nowrap">➕ Item</span>
          </button>
        }
      >
        <PageSection
          title="Items"
          description="Manage reusable cards with search, sorting, editing, and deleting."
        >
          <PageActionBar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            sortValue={sortValue}
            onSortChange={setSortValue}
            sortOptions={librarySortOptions}
            searchPlaceholder="Search library items..."
          />

          {filteredItems.length > 0 ? (
            <ItemGrid
              items={filteredItems}
              onItemClick={isPageReady ? handleOpenEditModal : undefined}
              renderItem={(item) => <LibraryCard item={item} />}
            />
          ) : (
            <LibraryEmptyState
              hasItems={items.length > 0}
              onClearFilters={clearFilters}
              onAddItem={handleOpenAddModal}
            />
          )}
        </PageSection>
      </PageShell>

      <LibraryFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        item={selectedItem}
        items={items}
        isDarkMode={settings.darkMode}
        onClose={handleCloseModal}
        onSubmit={modalMode === "edit" ? handleUpdateItem : handleAddItem}
        onDelete={handleDeleteItem}
      />
    </motion.div>
  );
}

export default LibraryPage;
