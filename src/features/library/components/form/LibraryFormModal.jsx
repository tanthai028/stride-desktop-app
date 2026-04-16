import { useEffect, useMemo, useRef, useState } from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import SelectMenu from "../../../../components/ui/SelectMenu.jsx";
import {
  getLibraryStatusOptions,
  normalizeStatusValue,
} from "../../constants/libraryStatuses.js";
import { PRIORITY_OPTIONS } from "../../constants/libraryPriorities.js";
import { parseLibraryJobUrl } from "../../utils/libraryClient.js";
import LibraryFormFields from "./LibraryFormFields.jsx";
import LibraryFormActions from "./LibraryFormActions.jsx";

/* =========================
   Constants
   ========================= */

const DEFAULT_STATUS = "Applied";
const DEFAULT_PRIORITY = "Medium";
const INVALID_JOB_URL_MESSAGE =
  "Couldn’t extract job details from this link. Paste a direct job posting URL.";

/* =========================
   Date + form helpers
   ========================= */

function getTodayDateInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function formatDateInputValue(value = "") {
  if (!value) return "";

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toISOString().slice(0, 10);
}

function createEmptyForm() {
  return {
    company: "",
    role: "",
    status: DEFAULT_STATUS,
    jobUrl: "",
    location: "",
    priority: DEFAULT_PRIORITY,
    appliedAt: getTodayDateInputValue(),
    notes: "",
  };
}

function createEditFormValues(item) {
  return {
    company: item?.company ?? "",
    role: item?.role ?? "",
    status: item?.status ?? DEFAULT_STATUS,
    jobUrl: item?.jobUrl ?? "",
    location: item?.location ?? "",
    priority: item?.priority ?? DEFAULT_PRIORITY,
    appliedAt: formatDateInputValue(item?.appliedAt),
    notes: item?.notes ?? "",
  };
}

function buildFormPayload(formValues) {
  return {
    company: formValues.company.trim(),
    role: formValues.role.trim(),
    status: (formValues.status || DEFAULT_STATUS).trim(),
    jobUrl: formValues.jobUrl.trim(),
    location: formValues.location.trim(),
    priority: (formValues.priority || DEFAULT_PRIORITY).trim(),
    appliedAt: formValues.appliedAt
      ? new Date(`${formValues.appliedAt}T12:00:00`).toISOString()
      : new Date().toISOString(),
    notes: formValues.notes.trim(),
  };
}

function getEditModalTitle(item, formValues) {
  const company =
    formValues.company?.trim() || item?.company?.trim() || "Company";
  const role = formValues.role?.trim() || item?.role?.trim() || "Role";

  return `${company} - ${role}`;
}

/* =========================
   Job URL parsing + autofill helpers
   ========================= */

function isUuidLike(value = "") {
  return /^[0-9a-f-]{36}$/i.test(String(value).trim());
}

function isAtsPlatformName(value = "") {
  return ["ashby", "lever", "greenhouse", "workday"].includes(
    String(value).trim().toLowerCase(),
  );
}

function canAutofillParsedJob(extracted) {
  if (!extracted || extracted.error) {
    return false;
  }

  const company = String(extracted.company ?? "").trim();
  const role = String(extracted.role ?? "").trim();
  const location = String(extracted.location ?? "").trim();

  return Boolean(company && role && location);
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
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const jobUrlInputKeyRef = useRef(0);

  const isEditMode = mode === "edit";
  const addModeDefaultValues = useMemo(() => createEmptyForm(), [isOpen]);
  const statusOptions = getLibraryStatusOptions();
  const normalizedStatusValue = normalizeStatusValue(formValues.status);

  const selectedStatusOption =
    statusOptions.find((option) => option.value === normalizedStatusValue) ??
    statusOptions.find((option) => option.rawLabel === DEFAULT_STATUS) ??
    null;

  /* =========================
     Reset + initialization helpers
     ========================= */

  function clearError() {
    onClearError?.();
  }

  function resetSharedUiState() {
    setShowAdvanced(false);
    setIsSubmitting(false);
  }

  function bumpJobUrlInputKey() {
    jobUrlInputKeyRef.current += 1;
  }

  function resetAddForm() {
    setFormValues(createEmptyForm());
    resetSharedUiState();
    bumpJobUrlInputKey();
  }

  function syncFormStateFromModal() {
    if (isEditMode && item) {
      setFormValues(createEditFormValues(item));
      resetSharedUiState();
      return;
    }

    setFormValues(addModeDefaultValues);
    resetSharedUiState();
    bumpJobUrlInputKey();
  }

  useEffect(() => {
    if (!isOpen) return;
    syncFormStateFromModal();
  }, [addModeDefaultValues, isOpen, isEditMode, item]);

  /* =========================
     Field handlers
     ========================= */

  function updateField(fieldName, value) {
    clearError();

    setFormValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  }

  function handleToggleAdvanced() {
    clearError();
    setShowAdvanced((current) => !current);
  }

  /* =========================
     Job URL handlers
     ========================= */

  async function applyParsedJobUrl(nextJobUrl) {
    const extracted = await parseLibraryJobUrl(nextJobUrl);

    if (!canAutofillParsedJob(extracted)) {
      return extracted;
    }

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
      };
    });

    return extracted;
  }

  async function handleJobUrlPaste(pastedValue) {
    clearError();

    const nextJobUrl = String(pastedValue ?? "").trim();

    setFormValues((prev) => ({
      ...prev,
      jobUrl: nextJobUrl,
    }));

    const extracted = await parseLibraryJobUrl(nextJobUrl);

    if (!canAutofillParsedJob(extracted)) {
      onSubmit?.({
        __clientValidationError: INVALID_JOB_URL_MESSAGE,
      });
      return;
    }

    await applyParsedJobUrl(nextJobUrl);
  }

  /* =========================
     Submit handlers
     ========================= */

  async function handleAddSubmit(payload) {
    if (!payload.jobUrl) {
      onSubmit?.({
        __clientValidationError: "Job URL is required.",
      });
      return;
    }

    let nextCompany = payload.company;
    let nextRole = payload.role;
    let nextLocation = payload.location;

    if (!nextCompany || !nextRole) {
      const extracted = await parseLibraryJobUrl(payload.jobUrl);

      if (canAutofillParsedJob(extracted)) {
        nextCompany = extracted.company.trim();
        nextRole = extracted.role.trim();
        nextLocation = nextLocation || extracted.location.trim();
      }
    }

    if (!nextCompany || !nextRole) {
      onSubmit?.({
        __clientValidationError: INVALID_JOB_URL_MESSAGE,
      });
      return;
    }

    try {
      setIsSubmitting(true);

      await onSubmit({
        ...payload,
        company: nextCompany,
        role: nextRole,
        location: nextLocation,
      });

      resetAddForm();
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleEditSubmit(payload) {
    await onSubmit(payload);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    clearError();

    const payload = buildFormPayload(formValues);

    if (isEditMode) {
      await handleEditSubmit(payload);
      return;
    }

    await handleAddSubmit(payload);
  }

  /* =========================
     Title render helper
     ========================= */

  function renderModalTitle() {
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={renderModalTitle()}>
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
