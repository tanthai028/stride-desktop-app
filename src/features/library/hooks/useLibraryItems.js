import { useEffect, useState } from "react";
import { loadLibraryItems, saveLibraryItems } from "../utils/libraryStorage.js";
import { createItemId } from "../utils/libraryItems.js";

function useLibraryItems() {
  const [items, setItems] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    setItems(loadLibraryItems());
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    saveLibraryItems(items);
  }, [items, hasLoaded]);

  function addItem(formValues) {
    const newItem = {
      id: createItemId(),
      ...formValues,
    };

    setItems((currentItems) => [newItem, ...currentItems]);
  }

  function updateItem(itemId, formValues) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              ...formValues,
            }
          : item,
      ),
    );
  }

  function deleteItem(itemId) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemId),
    );
  }

  return {
    items,
    addItem,
    updateItem,
    deleteItem,
  };
}

export default useLibraryItems;
