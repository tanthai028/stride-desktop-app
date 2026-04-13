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
      <div className="space-y-4">
        <div>
          <label className="form-label mb-2 block text-sm font-medium">
            📝 Notes <span className="opacity-70">(optional)</span>
          </label>
          <textarea
            spellCheck={false}
            placeholder="Add notes"
            value={formValues.notes}
            onChange={(event) => onFieldChange("notes", event.target.value)}
            rows={4}
            className="input-base min-h-[96px] resize-none scrollbar-hide"
          />
        </div>

        <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <div className="min-w-0">
            <p className="text-sm font-medium">Advanced fields</p>
            <p className="text-xs opacity-70">
              Company, role, job URL, location, and applied date
            </p>
          </div>

          <button
            type="button"
            onClick={onToggleAdvanced}
            aria-expanded={showAdvanced}
            className="shrink-0 rounded-full border border-white/10 px-3 py-1.5 text-sm font-medium transition hover:-translate-y-0.5 hover:bg-white/10"
          >
            {showAdvanced ? "Hide" : "Show more"}
          </button>
        </div>

        {showAdvanced ? (
          <div className="grid grid-cols-1 gap-4 min-[720px]:grid-cols-2">
            <div>
              <label className="form-label mb-2 block text-sm font-medium">
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
              <label className="form-label mb-2 block text-sm font-medium">
                💼 Role
              </label>
              <input
                placeholder="Add role"
                value={formValues.role}
                onChange={(event) => onFieldChange("role", event.target.value)}
                className="input-base"
              />
            </div>

            <div className="min-[720px]:col-span-2">
              <label className="form-label mb-2 block text-sm font-medium">
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
              <label className="form-label mb-2 block text-sm font-medium">
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
              <label className="form-label mb-2 block text-sm font-medium">
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
    <div className="space-y-4">
      <div>
        <label className="form-label mb-2 block text-sm font-medium">
          🔗 Job URL
        </label>
        <input
          autoFocus
          placeholder="Paste job posting link"
          value={formValues.jobUrl}
          onChange={(event) => onFieldChange("jobUrl", event.target.value)}
          onPaste={handleJobUrlPaste}
          className="input-base"
        />
      </div>

      <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">Advanced fields</p>
          <p className="text-xs opacity-70">
            Company, role, location, applied date, and notes
          </p>
        </div>

        <button
          type="button"
          onClick={onToggleAdvanced}
          aria-expanded={showAdvanced}
          className="shrink-0 rounded-full border border-white/10 px-3 py-1.5 text-sm font-medium transition hover:-translate-y-0.5 hover:bg-white/10"
        >
          {showAdvanced ? "Hide" : "Show more"}
        </button>
      </div>

      {showAdvanced ? (
        <div className="grid grid-cols-1 gap-4 min-[720px]:grid-cols-2">
          <div>
            <label className="form-label mb-2 block text-sm font-medium">
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
            <label className="form-label mb-2 block text-sm font-medium">
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
            <label className="form-label mb-2 block text-sm font-medium">
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
            <label className="form-label mb-2 block text-sm font-medium">
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

          <div className="min-[720px]:col-span-2">
            <label className="form-label mb-2 block text-sm font-medium">
              📝 Notes <span className="opacity-70">(optional)</span>
            </label>
            <textarea
              spellCheck={false}
              placeholder="Skip this for quick add"
              value={formValues.notes}
              onChange={(event) => onFieldChange("notes", event.target.value)}
              rows={4}
              className="input-base min-h-[96px] resize-none scrollbar-hide"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default LibraryFormFields;
