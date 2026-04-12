function LibraryFormFields({ formValues, onFieldChange }) {
  return (
    <div className="grid grid-cols-1 gap-4 min-[720px]:grid-cols-2">
      <div>
        <label className="form-label mb-2 block text-sm font-medium">
          🏢 Company
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
          💼 Role
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
          🔗 Job URL
        </label>
        <input
          placeholder="Paste job posting link"
          value={formValues.jobUrl}
          onChange={(event) => onFieldChange("jobUrl", event.target.value)}
          className="input-base"
        />
      </div>

      <div>
        <label className="form-label mb-2 block text-sm font-medium">
          📍 Location
        </label>
        <input
          placeholder="Add location"
          value={formValues.location}
          onChange={(event) => onFieldChange("location", event.target.value)}
          className="input-base"
        />
      </div>

      <div className="min-[720px]:col-span-2">
        <label className="form-label mb-2 block text-sm font-medium">
          📅 Applied Date
        </label>
        <input
          type="date"
          value={formValues.appliedAt}
          onChange={(event) => onFieldChange("appliedAt", event.target.value)}
          className="input-base"
        />
      </div>

      <div className="min-[720px]:col-span-2">
        <label className="form-label mb-2 block text-sm font-medium">
          📝 Notes
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
    </div>
  );
}

export default LibraryFormFields;
