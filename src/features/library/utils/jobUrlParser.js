const COMPANY_OVERRIDES = {
  greenhouse: "Greenhouse",
  lever: "Lever",
  workdayjobs: "Workday",
  ashbyhq: "Ashby",
  smartrecruiters: "SmartRecruiters",
  myworkdayjobs: "Workday",
};

function toTitleCase(value = "") {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function cleanSegment(value = "") {
  return decodeURIComponent(value)
    .replace(/[_+]+/g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanupRole(value = "") {
  if (!value) return "";

  const cleaned = cleanSegment(value)
    .replace(
      /\b(job|jobs|job posting|position|opening|req|requisition)\b/gi,
      "",
    )
    .replace(/\s+/g, " ")
    .trim();

  return toTitleCase(cleaned);
}

function getCompanyFromHost(hostname = "") {
  const host = hostname.toLowerCase().replace(/^www\./, "");
  const parts = host.split(".").filter(Boolean);

  if (!parts.length) return "";

  for (const part of parts) {
    if (COMPANY_OVERRIDES[part]) {
      return COMPANY_OVERRIDES[part];
    }
  }

  if (parts.length >= 3) {
    return toTitleCase(parts[0]);
  }

  return "";
}

function getRoleFromPath(pathname = "") {
  const segments = pathname
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (!segments.length) return "";

  const ignoredSegments = new Set([
    "jobs",
    "job",
    "careers",
    "career",
    "positions",
    "position",
    "opening",
    "openings",
    "apply",
    "view",
    "postings",
    "posting",
    "details",
    "detail",
    "listings",
    "listing",
  ]);

  const candidates = segments.filter((segment) => {
    const normalized = segment.toLowerCase();
    if (ignoredSegments.has(normalized)) return false;
    if (/^\d+$/.test(normalized)) return false;
    if (/^req[-_ ]?\d+$/i.test(normalized)) return false;
    return /[a-zA-Z]/.test(segment);
  });

  for (let index = candidates.length - 1; index >= 0; index -= 1) {
    const candidate = cleanupRole(candidates[index]);

    if (candidate && candidate.length >= 3) {
      return candidate;
    }
  }

  return "";
}

export function parseJobUrl(urlValue = "") {
  const trimmedUrl = String(urlValue).trim();

  if (!trimmedUrl) {
    return {
      company: "",
      role: "",
    };
  }

  try {
    const parsedUrl = new URL(trimmedUrl);

    return {
      company: getCompanyFromHost(parsedUrl.hostname),
      role: getRoleFromPath(parsedUrl.pathname),
    };
  } catch {
    return {
      company: "",
      role: "",
    };
  }
}
