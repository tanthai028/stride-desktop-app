import { useEffect, useState } from "react";
import {
  addLibraryItem,
  deleteLibraryItem,
  getLibraryItems,
  updateLibraryItem,
} from "../utils/libraryApi.js";

function useLibraryItems(resetVersion = 0) {
  const [items, setItems] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadItems() {
      setHasLoaded(false);

      const storedItems = await getLibraryItems();

      if (!isMounted) return;

      setItems(Array.isArray(storedItems) ? storedItems : []);
      setHasLoaded(true);
    }

    loadItems();

    return () => {
      isMounted = false;
    };
  }, [resetVersion]);

  async function addItem(formValues) {
    const newItem = await addLibraryItem(formValues);
    setItems((currentItems) => [newItem, ...currentItems]);
  }

  async function updateItem(itemId, formValues) {
    const updatedItem = await updateLibraryItem(itemId, formValues);

    if (!updatedItem) return;

    setItems((currentItems) =>
      currentItems.map((item) => (item.id === itemId ? updatedItem : item)),
    );
  }

  async function deleteItem(itemId) {
    await deleteLibraryItem(itemId);

    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemId),
    );
  }

  return {
    items,
    hasLoaded,
    addItem,
    updateItem,
    deleteItem,
  };
}

export default useLibraryItems;
