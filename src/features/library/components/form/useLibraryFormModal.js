import { useEffect, useMemo, useRef, useState } from "react";
import {
  getLibraryStatusOptions,
  normalizeStatusValue,
} from "../../constants/libraryStatuses.js";
import { parseLibraryJobUrl } from "../../utils/libraryClient.js";
import {
  buildFormPayload,
  canAutofillParsedJob,
  createEditFormValues,
  createEmptyForm,
  DEFAULT_STATUS,
  INVALID_JOB_URL_MESSAGE,
  isAtsPlatformName,
  isUuidLike,
} from "./libraryFormModal.utils.js";

export function useLibraryFormModal({
  isOpen,
  mode,
  item,
  onClearError,
  onSubmit,
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

  return {
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
  };
}
