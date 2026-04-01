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
          {isEditMode ? "Save Changes" : "Add Card"}
        </button>
      </div>
    </div>
  );
}

export default LibraryFormActions;
