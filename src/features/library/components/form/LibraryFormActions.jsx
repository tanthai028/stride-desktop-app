import { getHoverFeedbackHandlers } from "../../../../lib/uiFeedback.js";

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

  const hoverFeedbackHandlers = getHoverFeedbackHandlers();

  return (
    <div className={`pt-2 ${layoutClassName}`}>
      {isEditMode ? (
        <button
          type="button"
          onClick={onDelete}
          className={deleteButtonClassName}
          {...hoverFeedbackHandlers}
        >
          Delete Application
        </button>
      ) : null}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className={cancelButtonClassName}
          {...hoverFeedbackHandlers}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={submitButtonClassName}
          {...hoverFeedbackHandlers}
        >
          {isEditMode ? "Save Changes" : "Add Application"}
        </button>
      </div>
    </div>
  );
}

export default LibraryFormActions;
