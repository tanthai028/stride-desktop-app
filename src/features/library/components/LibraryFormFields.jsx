function LibraryFormFields({ formValues, onFieldChange }) {
  return (
    <>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          🏷️ Title
        </label>
        <input
          placeholder="Add title"
          value={formValues.title}
          onChange={(e) => onFieldChange("title", e.target.value)}
          className="input-base"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          📝 Description
        </label>
        <textarea
          placeholder="Add description"
          value={formValues.description}
          onChange={(e) => onFieldChange("description", e.target.value)}
          rows={4}
          className="input-base min-h-[112px] resize-none"
        />
      </div>
    </>
  );
}

export default LibraryFormFields;
