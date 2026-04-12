import { useEffect, useState } from "react";
import Modal from "../../../components/ui/Modal.jsx";
import {
  getLibraryStatusOptions,
  normalizeStatusValue,
} from "../constants/libraryStatuses.js";
import LibraryFormFields from "./LibraryFormFields.jsx";
import LibraryStatusPicker from "./LibraryStatusPicker.jsx";
import LibraryFormActions from "./LibraryFormActions.jsx";

const emptyForm = {
  company: "",
  role: "",
  status: "",
  jobUrl: "",
  location: "",
  appliedAt: "",
  notes: "",
};

function formatDateInputValue(value = "") {
  if (!value) return "";

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toISOString().slice(0, 10);
}

function LibraryFormModal({ isOpen, mode, item, onClose, onSubmit, onDelete }) {
  const [formValues, setFormValues] = useState(emptyForm);
  const [selectedStatusValue, setSelectedStatusValue] = useState("");

  const statusOptions = getLibraryStatusOptions();
  const isEditMode = mode === "edit";

  useEffect(() => {
    if (!isOpen) return;

    if (isEditMode && item) {
      const normalizedStatus = normalizeStatusValue(item.status);

      setFormValues({
        company: item.company ?? "",
        role: item.role ?? "",
        status: item.status ?? "",
        jobUrl: item.jobUrl ?? "",
        location: item.location ?? "",
        appliedAt: formatDateInputValue(item.appliedAt),
        notes: item.notes ?? "",
      });

      setSelectedStatusValue(normalizedStatus);
      return;
    }

    setFormValues(emptyForm);
    setSelectedStatusValue("");
  }, [isOpen, isEditMode, item]);

  function updateField(fieldName, value) {
    setFormValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  }

  function handleStatusClick(option) {
    const isSelected = selectedStatusValue === option.value;

    if (isSelected) {
      setSelectedStatusValue("");
      updateField("status", "");
      return;
    }

    setSelectedStatusValue(option.value);
    updateField("status", option.rawLabel);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const company = formValues.company.trim();
    const role = formValues.role.trim();
    const status = formValues.status.trim();
    const jobUrl = formValues.jobUrl.trim();
    const location = formValues.location.trim();
    const appliedAt = formValues.appliedAt
      ? new Date(`${formValues.appliedAt}T12:00:00`).toISOString()
      : "";
    const notes = formValues.notes.trim();

    if (!company || !role || !status || !notes) return;

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
        />

        <LibraryStatusPicker
          statusOptions={statusOptions}
          selectedStatusValue={selectedStatusValue}
          onStatusClick={handleStatusClick}
        />

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
