import { useEffect, useMemo, useState } from "react";
import Modal from "../../../components/ui/Modal.jsx";
import {
  getLibraryStatusOptions,
  normalizeStatusValue,
} from "../constants/libraryStatuses.js";
import { parseLibraryJobUrl } from "../utils/libraryApi.js";
import LibraryFormFields from "./LibraryFormFields.jsx";
import LibraryStatusPicker from "./LibraryStatusPicker.jsx";
import LibraryFormActions from "./LibraryFormActions.jsx";

const DEFAULT_STATUS = "Applied";

function getTodayDateInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function createEmptyForm() {
  return {
    company: "",
    role: "",
    status: DEFAULT_STATUS,
    jobUrl: "",
    location: "",
    appliedAt: getTodayDateInputValue(),
    notes: "",
  };
}

function formatDateInputValue(value = "") {
  if (!value) return "";

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toISOString().slice(0, 10);
}

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
  const [formValues, setFormValues] = useState(createEmptyForm);
  const [selectedStatusValue, setSelectedStatusValue] = useState("applied");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const statusOptions = getLibraryStatusOptions();
  const isEditMode = mode === "edit";
  const addModeDefaultValues = useMemo(() => createEmptyForm(), [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    if (isEditMode && item) {
      const normalizedStatus = normalizeStatusValue(item.status);

      setFormValues({
        company: item.company ?? "",
        role: item.role ?? "",
        status: item.status ?? DEFAULT_STATUS,
        jobUrl: item.jobUrl ?? "",
        location: item.location ?? "",
        appliedAt: formatDateInputValue(item.appliedAt),
        notes: item.notes ?? "",
      });

      setSelectedStatusValue(normalizedStatus || "applied");
      setShowAdvanced(true);
      return;
    }

    setFormValues(addModeDefaultValues);
    setSelectedStatusValue("applied");
    setShowAdvanced(false);
  }, [addModeDefaultValues, isOpen, isEditMode, item]);

  function updateField(fieldName, value) {
    onClearError?.();

    setFormValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  }

  function handleStatusClick(option) {
    onClearError?.();

    setSelectedStatusValue(option.value);
    updateField("status", option.rawLabel);
  }

  function handleToggleAdvanced() {
    onClearError?.();
    setShowAdvanced((current) => !current);
  }

  function isUuidLike(value = "") {
    return /^[0-9a-f-]{36}$/i.test(String(value).trim());
  }

  function isAtsPlatformName(value = "") {
    return ["ashby", "lever", "greenhouse", "workday"].includes(
      String(value).trim().toLowerCase(),
    );
  }

  async function handleJobUrlPaste(pastedValue) {
    onClearError?.();

    const nextJobUrl = String(pastedValue ?? "").trim();

    setFormValues((prev) => ({
      ...prev,
      jobUrl: nextJobUrl,
    }));

    const extracted = await parseLibraryJobUrl(nextJobUrl);

    setFormValues((prev) => {
      const shouldReplaceCompany =
        !prev.company.trim() || isAtsPlatformName(prev.company);

      const shouldReplaceRole = !prev.role.trim() || isUuidLike(prev.role);

      return {
        ...prev,
        jobUrl: nextJobUrl,
        company: shouldReplaceCompany ? extracted.company : prev.company,
        role: shouldReplaceRole ? extracted.role : prev.role,
        location: prev.location.trim() ? prev.location : extracted.location,
        notes: prev.notes.trim()
          ? prev.notes
          : extracted.employmentType
            ? `Employment type: ${extracted.employmentType}`
            : prev.notes,
      };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const company = formValues.company.trim();
    const role = formValues.role.trim();
    const status = (formValues.status || DEFAULT_STATUS).trim();
    const jobUrl = formValues.jobUrl.trim();
    const location = formValues.location.trim();
    const appliedAt = formValues.appliedAt
      ? new Date(`${formValues.appliedAt}T12:00:00`).toISOString()
      : new Date().toISOString();
    const notes = formValues.notes.trim();

    onSubmit({
      company,
      role,
      status,
      jobUrl,
      location,
      appliedAt,
      notes,
    });
  }

  return (
    <Modal
      isOpen={isOpen}
      title={isEditMode ? "🛠️ Edit Application" : "✨ Add Application"}
      onClose={onClose}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <LibraryFormFields
          formValues={formValues}
          onFieldChange={updateField}
          onJobUrlPaste={handleJobUrlPaste}
          isEditMode={isEditMode}
          showAdvanced={showAdvanced}
          onToggleAdvanced={handleToggleAdvanced}
        />

        <LibraryStatusPicker
          statusOptions={statusOptions}
          selectedStatusValue={selectedStatusValue}
          onStatusClick={handleStatusClick}
        />

        {errorMessage ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
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
