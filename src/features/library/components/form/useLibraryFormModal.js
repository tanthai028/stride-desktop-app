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

  function mergeParsedJob(prev, nextJobUrl, extracted) {
    const shouldReplaceCompany =
      !prev.company.trim() || isAtsPlatformName(prev.company);
    const shouldReplaceRole = !prev.role.trim() || isUuidLike(prev.role);

    return {
      ...prev,
      jobUrl: nextJobUrl,
      company: shouldReplaceCompany ? extracted.company : prev.company,
      role: shouldReplaceRole ? extracted.role : prev.role,
      location: prev.location.trim() ? prev.location : extracted.location,
      jobDescription: prev.jobDescription || extracted.jobDescription,
      requirements: prev.requirements || extracted.requirements,
      contactInfo: prev.contactInfo || extracted.contactInfo,
      nextSteps: prev.nextSteps || extracted.nextSteps,
    };
  }

  async function applyParsedJobUrl(nextJobUrl) {
    const extracted = await parseLibraryJobUrl(nextJobUrl);

    if (!canAutofillParsedJob(extracted)) {
      return extracted;
    }

    setFormValues((prev) => mergeParsedJob(prev, nextJobUrl, extracted));

    return extracted;
  }

  async function handleJobUrlPaste(pastedValue) {
    clearError();

    const nextJobUrl = String(pastedValue ?? "").trim();

    setFormValues((prev) => ({
      ...prev,
      jobUrl: nextJobUrl,
    }));

    const extracted = await applyParsedJobUrl(nextJobUrl);

    if (!canAutofillParsedJob(extracted)) {
      onSubmit?.({
        __clientValidationError: INVALID_JOB_URL_MESSAGE,
      });
    }
  }

  async function handleAddSubmit(payload) {
    if (!payload.jobUrl) {
      onSubmit?.({
        __clientValidationError: "Job URL is required.",
      });
      return;
    }

    const extracted = await parseLibraryJobUrl(payload.jobUrl);

    const nextCompany =
      payload.company ||
      (canAutofillParsedJob(extracted) ? extracted.company : "");
    const nextRole =
      payload.role || (canAutofillParsedJob(extracted) ? extracted.role : "");
    const nextLocation = payload.location || extracted?.location || "";

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
        jobDescription:
          payload.jobDescription || extracted?.jobDescription || "",
        requirements: payload.requirements || extracted?.requirements || "",
        contactInfo: payload.contactInfo || extracted?.contactInfo || "",
        nextSteps: payload.nextSteps || extracted?.nextSteps || "",
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

    if (isSubmitting) return;

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
