const formActionsLayoutClassName = {
  edit: "flex items-center justify-between gap-3",
  create: "flex justify-end gap-3",
};

const formActionsButtonBaseClassName =
  "rounded-2xl px-4 py-3 text-sm font-medium transition-transform duration-150 hover:scale-[1.01]";

const deleteButtonClassName =
  "interactive border border-transparent bg-rose-50 text-rose-600 hover:bg-rose-50/95";

const submitButtonClassName =
  "interactive border border-transparent bg-pink-200 text-slate-600 hover:bg-pink-100";

function LibraryFormActions({ isEditMode, onClose, onDelete }) {
  const layoutClassName = isEditMode
    ? formActionsLayoutClassName.edit
    : formActionsLayoutClassName.create;

  return (
    <div className={`pt-2 ${layoutClassName}`}>
      {isEditMode ? (
        <button
          type="button"
          onClick={onDelete}
          className={`${formActionsButtonBaseClassName} ${deleteButtonClassName}`}
        >
          Delete Card
        </button>
      ) : null}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className={`modal-secondary-button ${formActionsButtonBaseClassName}`}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={`${formActionsButtonBaseClassName} ${submitButtonClassName}`}
        >
          {isEditMode ? "Save Changes" : "Add Card"}
        </button>
      </div>
    </div>
  );
}

export default LibraryFormActions;
