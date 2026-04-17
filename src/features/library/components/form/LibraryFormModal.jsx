import Modal from "../../../../components/ui/Modal.jsx";
import LibraryFormFields from "./LibraryFormFields.jsx";
import LibraryFormActions from "./LibraryFormActions.jsx";
import LibraryFormModalTitle from "./LibraryFormModalTitle.jsx";
import { useLibraryFormModal } from "./useLibraryFormModal.js";

function LibraryFormModal({
  isOpen,
  mode,
  item,
  errorMessage,
  onClearError,
  onClose,
  onSubmit,
  onDelete,
}) {
  const {
    formValues,
    showAdvanced,
    jobUrlInputKeyRef,
    isEditMode,
    statusOptions,
    selectedStatusOption,
    updateField,
    handleToggleAdvanced,
    handleJobUrlPaste,
    handleSubmit,
  } = useLibraryFormModal({
    isOpen,
    mode,
    item,
    onClearError,
    onSubmit,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <LibraryFormModalTitle
          isEditMode={isEditMode}
          item={item}
          formValues={formValues}
          selectedStatusOption={selectedStatusOption}
          statusOptions={statusOptions}
          updateField={updateField}
        />
      }
    >
      <form className="modal-form" onSubmit={handleSubmit}>
        <LibraryFormFields
          key={jobUrlInputKeyRef.current}
          formValues={formValues}
          onFieldChange={updateField}
          onJobUrlPaste={handleJobUrlPaste}
          isEditMode={isEditMode}
          showAdvanced={showAdvanced}
          onToggleAdvanced={handleToggleAdvanced}
        />

        {errorMessage ? (
          <div className="library-form-error">{errorMessage}</div>
        ) : null}

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
