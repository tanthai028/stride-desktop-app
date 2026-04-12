const { LibraryValidationError } = require("./libraryErrors.cjs");

const ALLOWED_STATUSES = new Set([
  "wishlist",
  "applied",
  "oa",
  "interview",
  "offer",
  "rejected",
]);

function normalizeStatusValue(status = "") {
  return String(status).trim().toLowerCase();
}

function isValidUrl(value) {
  if (!value) return true;

  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function assertMaxLength(fieldName, value, maxLength) {
  if (value.length > maxLength) {
    throw new LibraryValidationError(
      `${fieldName} must be ${maxLength} characters or less.`,
      { field: fieldName.toLowerCase(), maxLength },
    );
  }
}

function validateLibraryFormValues(formValues = {}) {
  const company = String(formValues.company ?? "").trim();
  const role = String(formValues.role ?? "").trim();
  const status = normalizeStatusValue(formValues.status);
  const jobUrl = String(formValues.jobUrl ?? "").trim();
  const location = String(formValues.location ?? "").trim();
  const notes = String(formValues.notes ?? "").trim();

  if (!company) {
    throw new LibraryValidationError("Company is required.", {
      field: "company",
    });
  }

  if (!role) {
    throw new LibraryValidationError("Role is required.", {
      field: "role",
    });
  }

  if (!status) {
    throw new LibraryValidationError("Status is required.", {
      field: "status",
    });
  }

  if (!ALLOWED_STATUSES.has(status)) {
    throw new LibraryValidationError("Status is invalid.", {
      field: "status",
      allowedValues: Array.from(ALLOWED_STATUSES),
    });
  }

  if (!notes) {
    throw new LibraryValidationError("Notes are required.", {
      field: "notes",
    });
  }

  if (!isValidUrl(jobUrl)) {
    throw new LibraryValidationError(
      "Job URL must be a valid http or https link.",
      { field: "jobUrl" },
    );
  }

  assertMaxLength("Company", company, 120);
  assertMaxLength("Role", role, 120);
  assertMaxLength("Job URL", jobUrl, 500);
  assertMaxLength("Location", location, 120);
  assertMaxLength("Notes", notes, 3000);

  return {
    company,
    role,
    status,
    jobUrl,
    location,
    appliedAt: formValues.appliedAt ?? "",
    notes,
  };
}

module.exports = {
  ALLOWED_STATUSES,
  normalizeStatusValue,
  validateLibraryFormValues,
};
