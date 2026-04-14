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

    onJobUrlPaste?.(pastedText);
  }

  if (isEditMode) {
    return (
      <div className="library-form-fields">
        <div>
          <label className="form-label library-form-label">
            📝 Notes <span className="opacity-70">(optional)</span>
          </label>
          <textarea
            spellCheck={false}
            placeholder="Add notes"
            value={formValues.notes}
            onChange={(event) => onFieldChange("notes", event.target.value)}
            rows={4}
            className="input-base library-form-textarea scrollbar-hide"
          />
        </div>

        <div className="library-form-advanced-toggle">
          <div className="library-form-advanced-toggle-copy">
            <p className="library-form-advanced-toggle-title">
              Advanced fields
            </p>
            <p className="library-form-advanced-toggle-description">
              Company, role, job URL, location, and applied date
            </p>
          </div>

          <button
            type="button"
            onClick={onToggleAdvanced}
            aria-expanded={showAdvanced}
            className="library-form-advanced-toggle-button"
          >
            {showAdvanced ? "Hide" : "Show more"}
          </button>
        </div>

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

            <div className="library-form-grid-span-full">
              <label className="form-label library-form-label">
                🔗 Job URL <span className="opacity-70">(optional)</span>
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

            <div>
              <label className="form-label library-form-label">
                📍 Location <span className="opacity-70">(optional)</span>
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
                📅 Applied Date{" "}
                <span className="opacity-70">(defaults to today)</span>
              </label>
              <input
                type="date"
                value={formValues.appliedAt}
                onChange={(event) =>
                  onFieldChange("appliedAt", event.target.value)
                }
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

      <div className="library-form-advanced-toggle">
        <div className="library-form-advanced-toggle-copy">
          <p className="library-form-advanced-toggle-title">Advanced fields</p>
          <p className="library-form-advanced-toggle-description">
            Company, role, location, applied date, and notes
          </p>
        </div>

        <button
          type="button"
          onClick={onToggleAdvanced}
          aria-expanded={showAdvanced}
          className="library-form-advanced-toggle-button"
        >
          {showAdvanced ? "Hide" : "Show more"}
        </button>
      </div>

      {showAdvanced ? (
        <div className="library-form-grid">
          <div>
            <label className="form-label library-form-label">
              🏢 Company <span className="opacity-70">(optional)</span>
            </label>
            <input
              placeholder="Add company"
              value={formValues.company}
              onChange={(event) => onFieldChange("company", event.target.value)}
              className="input-base"
            />
          </div>

          <div>
            <label className="form-label library-form-label">
              💼 Role <span className="opacity-70">(optional)</span>
            </label>
            <input
              placeholder="Add role"
              value={formValues.role}
              onChange={(event) => onFieldChange("role", event.target.value)}
              className="input-base"
            />
          </div>

          <div>
            <label className="form-label library-form-label">
              📍 Location <span className="opacity-70">(optional)</span>
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
              📅 Applied Date{" "}
              <span className="opacity-70">(defaults to today)</span>
            </label>
            <input
              type="date"
              value={formValues.appliedAt}
              onChange={(event) =>
                onFieldChange("appliedAt", event.target.value)
              }
              className="input-base"
            />
          </div>

          <div className="library-form-grid-span-full">
            <label className="form-label library-form-label">
              📝 Notes <span className="opacity-70">(optional)</span>
            </label>
            <textarea
              spellCheck={false}
              placeholder="Skip this for quick add"
              value={formValues.notes}
              onChange={(event) => onFieldChange("notes", event.target.value)}
              rows={4}
              className="input-base library-form-textarea scrollbar-hide"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default LibraryFormFields;
