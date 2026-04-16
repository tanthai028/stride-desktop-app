import SelectMenu from "../../../../components/ui/SelectMenu.jsx";
import { PRIORITY_OPTIONS } from "../../constants/libraryPriorities.js";
import LibraryFormAdvancedToggle from "./LibraryFormAdvancedToggle.jsx";

function LibraryFormFields({
  formValues,
  onFieldChange,
  onJobUrlPaste,
  isEditMode = false,
  showAdvanced = false,
  onToggleAdvanced,
}) {
  function handleJobUrlPaste(event) {
    const pastedText = event.clipboardData?.getData("text") ?? "";

    if (!pastedText.trim()) {
      return;
    }

    event.preventDefault();
    onJobUrlPaste?.(pastedText);
  }

  function handlePriorityChange(nextValue) {
    onFieldChange("priority", nextValue);
  }

  if (isEditMode) {
    return (
      <div className="library-form-fields">
        <div>
          <label className="form-label library-form-label">📝 Notes</label>
          <textarea
            spellCheck={false}
            placeholder="Add notes"
            value={formValues.notes}
            onChange={(event) => onFieldChange("notes", event.target.value)}
            rows={4}
            className="input-base library-form-textarea scrollbar-hide"
          />
        </div>

        <LibraryFormAdvancedToggle
          description="Company, role, job URL, location, and priority"
          showAdvanced={showAdvanced}
          onToggle={onToggleAdvanced}
        />

        {showAdvanced ? (
          <div className="library-form-grid">
            <div>
              <label className="form-label library-form-label">
                🏢 Company
              </label>
              <input
                placeholder="Add company"
                value={formValues.company}
                onChange={(event) =>
                  onFieldChange("company", event.target.value)
                }
                className="input-base"
              />
            </div>

            <div>
              <label className="form-label library-form-label">💼 Role</label>
              <input
                placeholder="Add role"
                value={formValues.role}
                onChange={(event) => onFieldChange("role", event.target.value)}
                className="input-base"
              />
            </div>

            <div>
              <label className="form-label library-form-label">
                📍 Location
              </label>
              <input
                placeholder="Add location"
                value={formValues.location}
                onChange={(event) =>
                  onFieldChange("location", event.target.value)
                }
                className="input-base"
              />
            </div>

            <div>
              <label className="form-label library-form-label">
                🚦 Priority
              </label>
              <SelectMenu
                value={formValues.priority ?? "Medium"}
                onChange={handlePriorityChange}
                options={PRIORITY_OPTIONS}
                className="library-form-priority-select"
              />
            </div>

            <div className="library-form-grid-span-full">
              <label className="form-label library-form-label">
                🔗 Job URL
              </label>
              <input
                placeholder="Paste job posting link"
                value={formValues.jobUrl}
                onChange={(event) =>
                  onFieldChange("jobUrl", event.target.value)
                }
                onPaste={handleJobUrlPaste}
                className="input-base"
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="library-form-fields">
      <div>
        <label className="form-label library-form-label">🔗 Job URL</label>
        <input
          autoFocus
          placeholder="Paste job posting link"
          value={formValues.jobUrl}
          onChange={(event) => onFieldChange("jobUrl", event.target.value)}
          onPaste={handleJobUrlPaste}
          className="input-base"
        />
      </div>

      <LibraryFormAdvancedToggle
        description="Company, role, and location"
        showAdvanced={showAdvanced}
        onToggle={onToggleAdvanced}
      />

      {showAdvanced ? (
        <div className="library-form-grid">
          <div className="library-form-grid-span-full">
            <label className="form-label library-form-label">💼 Role</label>
            <input
              placeholder="Add role"
              value={formValues.role}
              onChange={(event) => onFieldChange("role", event.target.value)}
              className="input-base"
            />
          </div>

          <div>
            <label className="form-label library-form-label">🏢 Company</label>
            <input
              placeholder="Add company"
              value={formValues.company}
              onChange={(event) => onFieldChange("company", event.target.value)}
              className="input-base"
            />
          </div>

          <div>
            <label className="form-label library-form-label">📍 Location</label>
            <input
              placeholder="Add location"
              value={formValues.location}
              onChange={(event) =>
                onFieldChange("location", event.target.value)
              }
              className="input-base"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default LibraryFormFields;
