const formActionsLayoutClassName = {
  edit: "flex items-center justify-between gap-3",
  create: "flex justify-end gap-3",
};

const deleteButtonClassName = "library-action-delete";
const cancelButtonClassName = "modal-secondary-button";
const submitButtonClassName = "library-action-submit";

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
          className={deleteButtonClassName}
        >
          Delete Application
        </button>
      ) : null}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className={cancelButtonClassName}
        >
          Cancel
        </button>

        <button type="submit" className={submitButtonClassName}>
          {isEditMode ? "Save Changes" : "Add Application"}
        </button>
      </div>
    </div>
  );
}

export default LibraryFormActions;
