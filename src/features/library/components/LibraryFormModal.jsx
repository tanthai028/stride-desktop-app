import { useEffect, useState } from "react";
import Modal from "../../../components/ui/Modal.jsx";

const emptyForm = {
  title: "",
  description: "",
  tag: "",
};

function LibraryFormModal({ isOpen, mode, item, onClose, onSubmit, onDelete }) {
  const [formValues, setFormValues] = useState(emptyForm);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (mode === "edit" && item) {
      setFormValues({
        title: item.title,
        description: item.description,
        tag: item.tag,
      });
      return;
    }

    setFormValues(emptyForm);
  }, [isOpen, mode, item]);

  function updateField(fieldName, value) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [fieldName]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = formValues.title.trim();
    const trimmedDescription = formValues.description.trim();
    const trimmedTag = formValues.tag.trim();

    if (!trimmedTitle || !trimmedDescription || !trimmedTag) {
      return;
    }

    onSubmit({
      title: trimmedTitle,
      description: trimmedDescription,
      tag: trimmedTag,
    });
  }

  const isEditMode = mode === "edit";

  return (
    <Modal
      isOpen={isOpen}
      title={isEditMode ? "Edit Library Item" : "Add Library Item"}
      onClose={onClose}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="library-title"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Title
          </label>
          <input
            id="library-title"
            type="text"
            value={formValues.title}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="Enter a title"
            className="input-base"
          />
        </div>

        <div>
          <label
            htmlFor="library-description"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Description
          </label>
          <textarea
            id="library-description"
            value={formValues.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="Enter a short description"
            rows={4}
            className="input-base min-h-[112px] resize-none"
          />
        </div>

        <div>
          <label
            htmlFor="library-tag"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Tag
          </label>
          <input
            id="library-tag"
            type="text"
            value={formValues.tag}
            onChange={(event) => updateField("tag", event.target.value)}
            placeholder="Enter a tag"
            className="input-base"
          />
        </div>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
          <div>
            {isEditMode ? (
              <button
                type="button"
                onClick={onDelete}
                className="interactive rounded-2xl bg-rose-100 px-4 py-3 text-sm font-medium text-rose-600 transition hover:scale-[1.01]"
              >
                Delete Item
              </button>
            ) : null}
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="modal-secondary-button rounded-2xl px-4 py-3 text-sm font-medium transition hover:scale-[1.01]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="interactive rounded-2xl bg-pink-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:scale-[1.01]"
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
