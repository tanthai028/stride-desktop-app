const { LibraryValidationError } = require("./libraryErrors.cjs");

const ALLOWED_STATUSES = new Set([
  "wishlist",
  "applied",
  "oa",
  "interview",
  "offer",
  "rejected",
]);
const ALLOWED_PRIORITIES = new Set(["high", "medium", "low"]);
const DEFAULT_PRIORITY = "medium";

const DEFAULT_STATUS = "applied";

function normalizeStatusValue(status = "") {
  return String(status).trim().toLowerCase();
}

function isValidUrl(value) {
  if (!value) return false;

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

function getNormalizedAppliedAt(value) {
  if (!value) {
    return new Date().toISOString();
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new LibraryValidationError("Applied date is invalid.", {
      field: "appliedAt",
    });
  }

  return parsedDate.toISOString();
}

function formatPriorityLabel(priority = "") {
  const normalized = String(priority).trim().toLowerCase();
  if (!normalized) return "Medium";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function validateLibraryFormValues(formValues = {}, options = {}) {
  const company = String(formValues.company ?? "").trim();
  const role = String(formValues.role ?? "").trim();
  const status = normalizeStatusValue(formValues.status) || DEFAULT_STATUS;
  const jobUrl = String(formValues.jobUrl ?? "").trim();
  const location = String(formValues.location ?? "").trim();
  const notes = String(formValues.notes ?? "").trim();
  const mode = options.mode === "edit" ? "edit" : "create";
  const priority =
    String(formValues.priority ?? "")
      .trim()
      .toLowerCase() || DEFAULT_PRIORITY;

  if (!ALLOWED_STATUSES.has(status)) {
    throw new LibraryValidationError("Status is invalid.", {
      field: "status",
      allowedValues: Array.from(ALLOWED_STATUSES),
    });
  }

  if (!ALLOWED_PRIORITIES.has(priority)) {
    throw new LibraryValidationError("Priority is invalid.", {
      field: "priority",
      allowedValues: Array.from(ALLOWED_PRIORITIES),
    });
  }

  if (mode === "create") {
    if (!jobUrl) {
      throw new LibraryValidationError("Job URL is required.", {
        field: "jobUrl",
      });
    }

    if (!isValidUrl(jobUrl)) {
      throw new LibraryValidationError(
        "Job URL must be a valid http or https link.",
        { field: "jobUrl" },
      );
    }

    if (!company || !role) {
      throw new LibraryValidationError(
        "Couldn’t extract job details from this link. Paste a direct job posting URL.",
        {
          field: "jobUrl",
        },
      );
    }
  } else {
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

    if (jobUrl && !isValidUrl(jobUrl)) {
      throw new LibraryValidationError(
        "Job URL must be a valid http or https link.",
        { field: "jobUrl" },
      );
    }
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
    priority: formatPriorityLabel(priority),
    appliedAt: getNormalizedAppliedAt(formValues.appliedAt),
    notes,
  };
}

module.exports = {
  ALLOWED_STATUSES,
  DEFAULT_STATUS,
  normalizeStatusValue,
  validateLibraryFormValues,
};
