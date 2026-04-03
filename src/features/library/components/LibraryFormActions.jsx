function LibraryFormActions({ isEditMode, onClose, onDelete }) {
  return (
    <div
      className={`pt-2 ${
        isEditMode
          ? "flex items-center justify-between gap-3"
          : "flex justify-end gap-3"
      }`}
    >
      {isEditMode ? (
        <button
          type="button"
          onClick={onDelete}
          className="library-delete-button form-action-button interactive"
        >
          Delete Card
        </button>
      ) : null}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="modal-secondary-button form-action-button"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="library-submit-button form-action-button interactive"
        >
          {isEditMode ? "Save Changes" : "Add Card"}
        </button>
      </div>
    </div>
  );
}

export default LibraryFormActions;
