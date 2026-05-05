export const DEFAULT_STATUS = "Unapplied";
export const DEFAULT_PRIORITY = "Medium";
export const INVALID_JOB_URL_MESSAGE =
  "Couldn\u2019t extract job details from this link. Paste a direct job posting URL.";

function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getTodayDateInputValue() {
  return toDateInputValue(new Date());
}

export function formatDateInputValue(value = "") {
  if (!value) return "";

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return toDateInputValue(parsedDate);
}

export function createEmptyForm() {
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

export function createEditFormValues(item) {
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

export function buildFormPayload(formValues) {
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

export function getEditModalTitle(item, formValues) {
  const company =
    formValues.company?.trim() || item?.company?.trim() || "Company";
  const role = formValues.role?.trim() || item?.role?.trim() || "Role";

  return `${company} - ${role}`;
}

export function isUuidLike(value = "") {
  return /^[0-9a-f-]{36}$/i.test(String(value).trim());
}

export function isAtsPlatformName(value = "") {
  return ["ashby", "lever", "greenhouse", "workday"].includes(
    String(value).trim().toLowerCase(),
  );
}

export function canAutofillParsedJob(extracted) {
  if (!extracted || extracted.error) {
    return false;
  }

  const company = String(extracted.company ?? "").trim();
  const role = String(extracted.role ?? "").trim();
  const location = String(extracted.location ?? "").trim();

  return Boolean(company && role && location);
}
