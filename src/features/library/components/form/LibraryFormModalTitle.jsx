import SelectMenu from "../../../../components/ui/SelectMenu.jsx";
import { PRIORITY_OPTIONS } from "../../constants/libraryPriorities.js";
import {
  DEFAULT_STATUS,
  getEditModalTitle,
} from "./libraryFormModal.utils.js";

function LibraryFormModalTitle({
  isEditMode,
  item,
  formValues,
  selectedStatusOption,
  statusOptions,
  updateField,
}) {
  if (isEditMode) {
    return (
      <div className="library-form-modal-title">
        <span className="library-form-modal-title-text">
          {getEditModalTitle(item, formValues)}
        </span>

        <div className="library-form-modal-title-status">
          <SelectMenu
            value={selectedStatusOption?.rawLabel ?? DEFAULT_STATUS}
            onChange={(value) => updateField("status", value)}
            options={statusOptions.map((opt) => ({
              value: opt.rawLabel,
              label: opt.label,
            }))}
            className="library-status-select library-form-header-select"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="library-form-modal-title">
      <span className="library-form-modal-title-text">
        ✨ Add Application
      </span>

      <div className="library-form-modal-title-status">
        <SelectMenu
          value={formValues.priority ?? ""}
          onChange={(value) => updateField("priority", value)}
          options={PRIORITY_OPTIONS}
          placeholder="Priority"
          className="library-form-priority-select library-form-header-select library-form-priority-select-header"
        />
      </div>
    </div>
  );
}

export default LibraryFormModalTitle;
