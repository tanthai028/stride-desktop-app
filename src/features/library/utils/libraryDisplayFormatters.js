const STATE_ABBREVIATIONS = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
};

function getShortState(state = "") {
  return STATE_ABBREVIATIONS[String(state).trim()] ?? "";
}

export function formatLibraryLocation(location = "", fallback = "-") {
  const trimmedLocation = String(location).trim();

  if (!trimmedLocation) {
    return fallback;
  }

  const parts = trimmedLocation.split(",").map((part) => part.trim());

  if (parts.length !== 2) {
    return trimmedLocation;
  }

  const [city, state] = parts;
  const shortState = getShortState(state);

  if (!shortState) {
    return trimmedLocation;
  }

  return `${city}, ${shortState}`;
}

export function formatLibraryAppliedDate(
  appliedAt,
  { fallback = "-", year = "2-digit" } = {},
) {
  if (!appliedAt) {
    return fallback;
  }

  const parsedDate = new Date(appliedAt);

  if (Number.isNaN(parsedDate.getTime())) {
    return fallback;
  }

  return parsedDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year,
  });
}

export function extractJobId(jobUrl = "") {
  const trimmedUrl = String(jobUrl).trim();

  if (!trimmedUrl) return "";

  try {
    const parsedUrl = new URL(trimmedUrl);

    const queryJobId =
      parsedUrl.searchParams.get("jobId") ||
      parsedUrl.searchParams.get("job_id") ||
      parsedUrl.searchParams.get("gh_jid") ||
      parsedUrl.searchParams.get("lever-source");

    if (queryJobId) return queryJobId;

    const pathParts = parsedUrl.pathname.split("/").filter(Boolean);
    const lastNumericPart = [...pathParts]
      .reverse()
      .find((part) => /^\d{4,}$/.test(part));

    return lastNumericPart || pathParts.at(-1) || "";
  } catch {
    const match = trimmedUrl.match(
      /(?:jobs?|postings?|positions?)\/([^/?#]+)/i,
    );
    return match?.[1] || "";
  }
}

export function openLibraryJobUrl(event, jobUrl) {
  event.stopPropagation();

  if (!jobUrl) {
    return;
  }

  if (window.libraryApi?.openExternalUrl) {
    window.libraryApi.openExternalUrl(jobUrl);
    return;
  }

  window.open(jobUrl, "_blank", "noopener,noreferrer");
}
