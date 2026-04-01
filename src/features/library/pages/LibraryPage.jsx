import { useEffect, useMemo, useState } from "react";
import PageShell from "../../../components/page/PageShell.jsx";
import PageSection from "../../../components/page/PageSection.jsx";
import ItemGrid from "../../../components/page/ItemGrid.jsx";
import EmptyState from "../../../components/page/EmptyState.jsx";
import PageActionBar from "../../../components/page/PageActionBar.jsx";
import { libraryItems as defaultLibraryItems } from "../../../data/libraryItems.js";

const STORAGE_KEY = "library-items";

const sortOptions = [
  { value: "title-asc", label: "Title A-Z" },
  { value: "title-desc", label: "Title Z-A" },
  { value: "tag-asc", label: "Tag A-Z" },
];

function createItemId() {
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function LibraryPage() {
  const [items, setItems] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState("title-asc");

  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemTag, setNewItemTag] = useState("");

  useEffect(() => {
    const savedItems = window.localStorage.getItem(STORAGE_KEY);

    if (!savedItems) {
      setItems(defaultLibraryItems);
      setHasLoaded(true);
      return;
    }

    try {
      const parsedItems = JSON.parse(savedItems);

      if (Array.isArray(parsedItems)) {
        setItems(parsedItems);
      } else {
        setItems(defaultLibraryItems);
      }
    } catch {
      setItems(defaultLibraryItems);
    }

    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hasLoaded]);

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    let nextItems = items.filter((item) => {
      if (!normalizedSearch) {
        return true;
      }

      return (
        item.title.toLowerCase().includes(normalizedSearch) ||
        item.description.toLowerCase().includes(normalizedSearch) ||
        item.tag.toLowerCase().includes(normalizedSearch)
      );
    });

    if (sortValue === "title-asc") {
      nextItems = [...nextItems].sort((leftItem, rightItem) =>
        leftItem.title.localeCompare(rightItem.title)
      );
    }

    if (sortValue === "title-desc") {
      nextItems = [...nextItems].sort((leftItem, rightItem) =>
        rightItem.title.localeCompare(leftItem.title)
      );
    }

    if (sortValue === "tag-asc") {
      nextItems = [...nextItems].sort((leftItem, rightItem) =>
        leftItem.tag.localeCompare(rightItem.tag)
      );
    }

    return nextItems;
  }, [items, searchValue, sortValue]);

  function clearFilters() {
    setSearchValue("");
    setSortValue("title-asc");
  }

  function resetAddForm() {
    setNewItemTitle("");
    setNewItemDescription("");
    setNewItemTag("");
  }

  function handleOpenAddForm() {
    setIsAddingItem(true);
  }

  function handleCancelAddItem() {
    setIsAddingItem(false);
    resetAddForm();
  }

  function handleAddItem(event) {
    event.preventDefault();

    const trimmedTitle = newItemTitle.trim();
    const trimmedDescription = newItemDescription.trim();
    const trimmedTag = newItemTag.trim();

    if (!trimmedTitle || !trimmedDescription || !trimmedTag) {
      return;
    }

    const newItem = {
      id: createItemId(),
      title: trimmedTitle,
      description: trimmedDescription,
      tag: trimmedTag,
    };

    setItems((currentItems) => [newItem, ...currentItems]);
    setIsAddingItem(false);
    resetAddForm();
  }

  return (
    <PageShell
      eyebrow="Library"
      title="Saved Building Blocks"
      description="A reusable list-style page with search, sorting, and empty-state support."
      actions={
        <button
          type="button"
          onClick={handleOpenAddForm}
          className="rounded-2xl bg-pink-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:scale-[1.01]"
        >
          Add Item
        </button>
      }
    >
      <PageSection
        title="Items"
        description="Example cards rendered from shared data."
      >
        {isAddingItem ? (
          <form
            onSubmit={handleAddItem}
            className="mb-5 space-y-3 rounded-3xl border border-white/70 bg-white/80 p-4 shadow-sm"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Title
              </label>
              <input
                type="text"
                value={newItemTitle}
                onChange={(event) => setNewItemTitle(event.target.value)}
                placeholder="Enter item title"
                className="w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                value={newItemDescription}
                onChange={(event) => setNewItemDescription(event.target.value)}
                placeholder="Enter item description"
                rows={3}
                className="w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Tag
              </label>
              <input
                type="text"
                value={newItemTag}
                onChange={(event) => setNewItemTag(event.target.value)}
                placeholder="Enter item tag"
                className="w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-2xl bg-pink-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:scale-[1.01]"
              >
                Save Item
              </button>

              <button
                type="button"
                onClick={handleCancelAddItem}
                className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm font-medium text-slate-700 transition hover:scale-[1.01]"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}

        <PageActionBar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          sortValue={sortValue}
          onSortChange={setSortValue}
          sortOptions={sortOptions}
          searchPlaceholder="Search library items..."
        />

        {filteredItems.length > 0 ? (
          <ItemGrid
            items={filteredItems}
            renderItem={(item) => (
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-slate-800">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    {item.description}
                  </p>
                </div>

                <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-500">
                  {item.tag}
                </span>
              </div>
            )}
          />
        ) : (
          <EmptyState
            title="No matching library items"
            description="Try a different search or clear your filters to see available items."
            action={
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-2xl bg-pink-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:scale-[1.01]"
              >
                Clear Filters
              </button>
            }
          />
        )}
      </PageSection>
    </PageShell>
  );
}

export default LibraryPage;