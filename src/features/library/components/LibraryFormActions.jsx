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
          className="library-delete-button interactive rounded-2xl px-4 py-3 text-sm font-medium hover:scale-[1.01]"
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
          className="library-submit-button interactive rounded-2xl px-4 py-3 text-sm font-medium hover:scale-[1.01]"
        >
          {isEditMode ? "Save Changes" : "Add Card"}
        </button>
      </div>
    </div>
  );
}

export default LibraryFormActions;
