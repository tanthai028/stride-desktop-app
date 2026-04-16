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
    priority: "Medium",
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

function getEditModalTitle(item, formValues) {
  const company =
    formValues.company?.trim() || item?.company?.trim() || "Company";
  const role = formValues.role?.trim() || item?.role?.trim() || "Role";

  return `${company} - ${role}`;
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

  const selectedStatusOption =
    statusOptions.find(
      (option) => option.value === normalizeStatusValue(formValues.status),
    ) ??
    statusOptions.find((option) => option.rawLabel === DEFAULT_STATUS) ??
    null;

  useEffect(() => {
    if (!isOpen) return;

    if (isEditMode && item) {
      setFormValues({
        company: item.company ?? "",
        role: item.role ?? "",
        status: item.status ?? DEFAULT_STATUS,
        jobUrl: item.jobUrl ?? "",
        location: item.location ?? "",
        priority: item.priority ?? "Medium",
        appliedAt: formatDateInputValue(item.appliedAt),
        notes: item.notes ?? "",
      });

      setShowAdvanced(false);
      setIsSubmitting(false);
      return;
    }

    setFormValues(addModeDefaultValues);
    setShowAdvanced(false);
    setIsSubmitting(false);
    jobUrlInputKeyRef.current += 1;
  }, [addModeDefaultValues, isOpen, isEditMode, item]);

  function resetAddForm() {
    setFormValues(createEmptyForm());
    setShowAdvanced(false);
    setIsSubmitting(false);
    jobUrlInputKeyRef.current += 1;
  }

  function updateField(fieldName, value) {
    onClearError?.();

    setFormValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
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

  function canAutofillParsedJob(extracted) {
    if (!extracted) return false;
    if (extracted.error) return false;

    const company = String(extracted.company ?? "").trim();
    const role = String(extracted.role ?? "").trim();
    const location = String(extracted.location ?? "").trim();

    return Boolean(company && role && location);
  }

  async function parseJobUrlForAutofill(nextJobUrl) {
    return await parseLibraryJobUrl(nextJobUrl);
  }

  async function applyParsedJobUrl(nextJobUrl) {
    const extracted = await parseJobUrlForAutofill(nextJobUrl);

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
    onClearError?.();

    const nextJobUrl = String(pastedValue ?? "").trim();

    setFormValues((prev) => ({
      ...prev,
      jobUrl: nextJobUrl,
    }));

    const extracted = await parseJobUrlForAutofill(nextJobUrl);

    if (!canAutofillParsedJob(extracted)) {
      onSubmit?.({
        __clientValidationError:
          "Couldn’t extract job details from this link. Paste a direct job posting URL.",
      });
      return;
    }

    await applyParsedJobUrl(nextJobUrl);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    onClearError?.();

    const company = formValues.company.trim();
    const role = formValues.role.trim();
    const status = (formValues.status || DEFAULT_STATUS).trim();
    const jobUrl = formValues.jobUrl.trim();
    const location = formValues.location.trim();
    const appliedAt = formValues.appliedAt
      ? new Date(`${formValues.appliedAt}T12:00:00`).toISOString()
      : new Date().toISOString();
    const notes = formValues.notes.trim();
    const priority = (formValues.priority || "Medium").trim();

    if (!isEditMode) {
      if (!jobUrl) {
        onSubmit?.({
          __clientValidationError: "Job URL is required.",
        });
        return;
      }

      let nextCompany = company;
      let nextRole = role;
      let nextLocation = location;

      if (!nextCompany || !nextRole) {
        const extracted = await parseJobUrlForAutofill(jobUrl);

        if (canAutofillParsedJob(extracted)) {
          nextCompany = extracted.company.trim();
          nextRole = extracted.role.trim();
          nextLocation = nextLocation || extracted.location.trim();
        }
      }

      if (!nextCompany || !nextRole) {
        onSubmit?.({
          __clientValidationError:
            "Couldn’t extract job details from this link. Paste a direct job posting URL.",
        });
        return;
      }

      try {
        setIsSubmitting(true);

        await onSubmit({
          company: nextCompany,
          role: nextRole,
          status,
          jobUrl,
          location: nextLocation,
          priority,
          appliedAt,
          notes,
        });

        resetAddForm();
      } finally {
        setIsSubmitting(false);
      }

      return;
    }

    await onSubmit({
      company,
      role,
      status,
      jobUrl,
      location,
      priority,
      appliedAt,
      notes,
    });
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isEditMode ? (
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
        ) : (
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
        )
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
