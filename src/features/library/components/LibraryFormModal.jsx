import { useEffect, useState } from "react";
import Modal from "../../../components/ui/Modal.jsx";
import {
  defaultLibraryTags,
  normalizeTagValue,
} from "../constants/libraryTags.js";

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

  const tagOptions = defaultLibraryTags;

  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && item) {
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
  }, [isOpen, mode, item]);

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

  function handleSubmit(e) {
    e.preventDefault();

    const title = formValues.title.trim();
    const description = formValues.description.trim();
    const tag = formValues.tag.trim();

    if (!title || !description || !tag) return;

    onSubmit({ title, description, tag });
  }

  const isEditMode = mode === "edit";

  return (
    <Modal
      isOpen={isOpen}
      title={isEditMode ? "🛠️ Edit Library Item" : "✨ Add Library Item"}
      onClose={onClose}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Title */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            🏷️ Title
          </label>
          <input
            value={formValues.title}
            onChange={(e) => updateField("title", e.target.value)}
            className="input-base"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            📝 Description
          </label>
          <textarea
            value={formValues.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={4}
            className="input-base min-h-[112px] resize-none"
          />
        </div>

        {/* Tags */}
        <div className="space-y-3">
          <label
            className={`block text-sm font-medium ${
              isDarkMode ? "text-slate-200" : "text-slate-700"
            }`}
          >
            🔖 Tag
          </label>

          <div className="flex flex-wrap gap-2">
            {tagOptions.map((option) => {
              const isSelected = selectedTagValue === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleTagClick(option)}
                  className={`rounded-full px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                    isSelected
                      ? isDarkMode
                        ? "bg-pink-400/20 text-white border border-pink-400/30 shadow-[0_0_0_1px_rgba(244,114,182,0.2)]"
                        : "bg-pink-200 text-slate-800 border border-pink-300 shadow-sm"
                      : isDarkMode
                        ? "bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <span>{option.emoji}</span>
                    <span>{option.rawLabel}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div
          className={`pt-2 ${isEditMode ? "flex items-center justify-between gap-3" : "flex justify-end gap-3"}`}
        >
          {isEditMode ? (
            <button
              type="button"
              onClick={onDelete}
              className="interactive rounded-2xl bg-rose-100 px-4 py-3 text-sm font-medium text-rose-600 hover:scale-[1.01]"
            >
              Delete Card
            </button>
          ) : null}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="modal-secondary-button rounded-2xl px-4 py-3 text-sm font-medium hover:scale-[1.01]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="interactive rounded-2xl bg-pink-200 px-4 py-3 text-sm font-medium text-slate-700 hover:scale-[1.01]"
            >
              {isEditMode ? "Save Changes" : "Add Item"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default LibraryFormModal;
