import { useEffect, useState } from "react";
import Modal from "../../../components/ui/Modal.jsx";
import {
  getLibraryTagOptions,
  normalizeTagValue,
} from "../constants/libraryTags.js";
import LibraryFormFields from "./LibraryFormFields.jsx";
import LibraryTagPicker from "./LibraryTagPicker.jsx";
import LibraryFormActions from "./LibraryFormActions.jsx";

const emptyForm = {
  title: "",
  description: "",
  tag: "",
};

function LibraryFormModal({
  isOpen,
  mode,
  item,
  onClose,
  onSubmit,
  onDelete,
  isDarkMode = false,
}) {
  const [formValues, setFormValues] = useState(emptyForm);
  const [selectedTagValue, setSelectedTagValue] = useState("");

  const tagOptions = getLibraryTagOptions();
  const isEditMode = mode === "edit";

  useEffect(() => {
    if (!isOpen) return;

    if (isEditMode && item) {
      const normalizedTag = normalizeTagValue(item.tag);

      setFormValues({
        title: item.title,
        description: item.description,
        tag: item.tag,
      });

      setSelectedTagValue(normalizedTag);
      return;
    }

    setFormValues(emptyForm);
    setSelectedTagValue("");
  }, [isOpen, isEditMode, item]);

  function updateField(fieldName, value) {
    setFormValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  }

  function handleTagClick(option) {
    const isSelected = selectedTagValue === option.value;

    if (isSelected) {
      setSelectedTagValue("");
      updateField("tag", "");
      return;
    }

    setSelectedTagValue(option.value);
    updateField("tag", option.rawLabel);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const title = formValues.title.trim();
    const description = formValues.description.trim();
    const tag = formValues.tag.trim();

    if (!title || !description || !tag) return;

    onSubmit({ title, description, tag });
  }

  return (
    <Modal
      isOpen={isOpen}
      title={isEditMode ? "🛠️ Edit Library Card" : "✨ Add Library Card"}
      onClose={onClose}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <LibraryFormFields
          formValues={formValues}
          onFieldChange={updateField}
        />

        <LibraryTagPicker
          isDarkMode={isDarkMode}
          tagOptions={tagOptions}
          selectedTagValue={selectedTagValue}
          onTagClick={handleTagClick}
        />

        <LibraryFormActions
          isEditMode={isEditMode}
          onClose={onClose}
          onDelete={onDelete}
        />
      </form>
    </Modal>
  );
}

export default LibraryFormModal;
