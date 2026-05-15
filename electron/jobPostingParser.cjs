const ATS_HOSTS = new Set([
  "ashbyhq.com",
  "jobs.ashbyhq.com",
  "lever.co",
  "jobs.lever.co",
  "greenhouse.io",
  "boards.greenhouse.io",
  "myworkdayjobs.com",
  "workdayjobs.com",
  "smartrecruiters.com",
  "jobs.smartrecruiters.com",
]);

const REQUEST_TIMEOUT_MS = 8000;

function decodeHtmlEntities(value = "") {
  return String(value)
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function stripTags(value = "") {
  return decodeHtmlEntities(String(value).replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function cleanText(value = "") {
  return stripTags(value).replace(/\s+/g, " ").trim();
}

function toTitleCase(value = "") {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function cleanSlug(value = "") {
  return decodeURIComponent(value)
    .replace(/[_+]+/g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function looksLikeUuid(value = "") {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value.trim(),
  );
}

function looksLikeNumericId(value = "") {
  return /^\d+$/.test(value.trim());
}

function looksLikeReqId(value = "") {
  return /^req[-_ ]?[a-z0-9]+$/i.test(value.trim());
}

function isIgnoredPathSegment(value = "") {
  const normalized = value.trim().toLowerCase();

  return new Set([
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
    "listing",
    "listings",
    "en-us",
    "us",
    "en",
  ]).has(normalized);
}

function looksHumanReadable(value = "") {
  const trimmed = value.trim();

  if (!trimmed) return false;
  if (looksLikeUuid(trimmed)) return false;
  if (looksLikeNumericId(trimmed)) return false;
  if (looksLikeReqId(trimmed)) return false;

  const cleaned = cleanSlug(trimmed);

  if (!/[a-zA-Z]/.test(cleaned)) return false;
  if (cleaned.length < 3) return false;

  return true;
}

function normalizeRole(value = "") {
  return toTitleCase(
    cleanSlug(value)
      .replace(/\b(job|jobs|position|opening|requisition|req)\b/gi, "")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function normalizeCompany(value = "") {
  return toTitleCase(cleanSlug(value));
}

function getMetaContent(html, attributeName, attributeValue) {
  const escapedValue = attributeValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const patterns = [
    new RegExp(
      `<meta[^>]+${attributeName}=["']${escapedValue}["'][^>]+content=["']([^"']+)["'][^>]*>`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+${attributeName}=["']${escapedValue}["'][^>]*>`,
      "i",
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return cleanText(match[1]);
  }

  return "";
}

function getTitleFromHtml(html = "") {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match?.[1] ? cleanText(match[1]) : "";
}

function extractJsonLdObjects(html = "") {
  const matches = [
    ...html.matchAll(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ];

  const objects = [];

  for (const match of matches) {
    const raw = match?.[1]?.trim();
    if (!raw) continue;

    try {
      const parsed = JSON.parse(raw);
      Array.isArray(parsed) ? objects.push(...parsed) : objects.push(parsed);
    } catch {
      // Ignore invalid JSON-LD blobs.
    }
  }

  return objects;
}

function firstNonEmpty(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  return "";
}

function normalizeLocationFromJsonLd(jobPosting) {
  const jobLocation = jobPosting?.jobLocation;
  if (!jobLocation) return "";

  const locations = Array.isArray(jobLocation) ? jobLocation : [jobLocation];

  for (const location of locations) {
    const address = location?.address ?? location;
    const parts = [
      address?.addressLocality,
      address?.addressRegion,
      address?.addressCountry,
    ]
      .map((part) => cleanText(part || ""))
      .filter(Boolean);

    if (parts.length) return parts.join(", ");
  }

  return "";
}

function extractJobPostingFromJsonLd(html = "") {
  const jsonLdObjects = extractJsonLdObjects(html);

  for (const item of jsonLdObjects) {
    const typeValue = item?.["@type"];
    const typeList = Array.isArray(typeValue) ? typeValue : [typeValue];

    const isJobPosting = typeList.some(
      (entry) => String(entry || "").toLowerCase() === "jobposting",
    );

    if (!isJobPosting) continue;

    return {
      role: cleanText(item?.title || item?.name || ""),
      company: cleanText(
        item?.hiringOrganization?.name ||
          item?.hiringOrganization ||
          item?.organization?.name ||
          "",
      ),
      location: normalizeLocationFromJsonLd(item),
      employmentType: Array.isArray(item?.employmentType)
        ? item.employmentType.join(", ")
        : cleanText(item?.employmentType || ""),
      jobDescription: cleanText(item?.description || ""),
      requirements: cleanText(
        [
          item?.qualifications,
          item?.responsibilities,
          item?.skills,
          item?.experienceRequirements,
          item?.educationRequirements,
        ]
          .flat()
          .filter(Boolean)
          .join("\n"),
      ),
      contactInfo: cleanText(item?.hiringOrganization?.email || ""),
      nextSteps: "",
    };
  }

  return {
    role: "",
    company: "",
    location: "",
    employmentType: "",
    jobDescription: "",
    requirements: "",
    contactInfo: "",
    nextSteps: "",
  };
}

function parseTitleParts(title = "") {
  if (!title) return { role: "", company: "" };

  const separators = [" | ", " - ", " — ", " @ ", " at "];

  for (const separator of separators) {
    if (!title.includes(separator)) continue;

    const parts = title
      .split(separator)
      .map((part) => cleanText(part))
      .filter(Boolean);

    if (parts.length >= 2) {
      return {
        role: parts[0],
        company: parts[1],
      };
    }
  }

  return {
    role: cleanText(title),
    company: "",
  };
}

function getProviderInfo(hostname = "") {
  const host = hostname.toLowerCase().replace(/^www\./, "");

  if (host.includes("ashbyhq.com")) return "ashby";
  if (host.includes("lever.co")) return "lever";
  if (host.includes("greenhouse.io")) return "greenhouse";
  if (host.includes("workdayjobs.com") || host.includes("myworkdayjobs.com")) {
    return "workday";
  }
  if (host.includes("smartrecruiters.com")) return "smartrecruiters";

  return "";
}

function parseCompanyFromUrl(urlString = "") {
  try {
    const url = new URL(urlString);
    const provider = getProviderInfo(url.hostname);
    const segments = url.pathname.split("/").filter(Boolean);

    if (
      ["ashby", "lever", "greenhouse", "smartrecruiters"].includes(provider)
    ) {
      return normalizeCompany(segments[0] || "");
    }

    if (provider === "workday") {
      const hostParts = url.hostname.replace(/^www\./, "").split(".");
      if (hostParts.length >= 3) return normalizeCompany(hostParts[0]);
    }

    const hostParts = url.hostname.replace(/^www\./, "").split(".");
    if (hostParts.length >= 3) return normalizeCompany(hostParts[0]);

    return "";
  } catch {
    return "";
  }
}

function parseRoleFromUrl(urlString = "") {
  try {
    const url = new URL(urlString);
    const segments = url.pathname
      .split("/")
      .map((segment) => segment.trim())
      .filter(Boolean)
      .filter((segment) => !isIgnoredPathSegment(segment))
      .filter((segment) => looksHumanReadable(segment));

    if (!segments.length) return "";

    const provider = getProviderInfo(url.hostname);

    if (provider === "ashby") {
      return normalizeRole(
        segments.find((segment) => segment !== segments[0]) || "",
      );
    }

    for (let index = segments.length - 1; index >= 0; index -= 1) {
      const candidate = normalizeRole(segments[index]);
      if (candidate) return candidate;
    }

    return "";
  } catch {
    return "";
  }
}

function isAtsUrl(urlString = "") {
  try {
    const url = new URL(urlString);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");

    return Array.from(ATS_HOSTS).some(
      (domain) => host === domain || host.endsWith(`.${domain}`),
    );
  } catch {
    return false;
  }
}

function extractFromHtml(html = "") {
  const metaTitle =
    getMetaContent(html, "property", "og:title") ||
    getMetaContent(html, "name", "twitter:title");

  const metaDescription =
    getMetaContent(html, "property", "og:description") ||
    getMetaContent(html, "name", "description");

  const jsonLd = extractJobPostingFromJsonLd(html);
  const titleText = firstNonEmpty(metaTitle, getTitleFromHtml(html));
  const titleParts = parseTitleParts(titleText);

  const descriptionLocationMatch = metaDescription.match(
    /\b(remote|hybrid|onsite|on-site|[A-Z][a-zA-Z]+,\s?[A-Z]{2})\b/i,
  );

  return {
    role: firstNonEmpty(jsonLd.role, titleParts.role),
    company: firstNonEmpty(jsonLd.company, titleParts.company),
    location: firstNonEmpty(
      jsonLd.location,
      descriptionLocationMatch?.[0] || "",
    ),
    employmentType: firstNonEmpty(jsonLd.employmentType),
    source:
      jsonLd.role || jsonLd.company
        ? "html-jsonld"
        : titleText
          ? "html-title"
          : "",
    jobDescription: jsonLd.jobDescription || metaDescription || "",
    requirements: jsonLd.requirements || "",
    contactInfo: jsonLd.contactInfo || "",
    nextSteps: "",
  };
}

async function fetchHtml(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.9",
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
      throw new Error("Response was not HTML.");
    }

    return await response.text();
  } finally {
    clearTimeout(timeoutId);
  }
}

async function parseJobPostingFromUrl(urlValue = "") {
  const trimmedUrl = String(urlValue ?? "").trim();

  if (!trimmedUrl) {
    return {
      company: "",
      role: "",
      location: "",
      employmentType: "",
      source: "empty",
      isAtsUrl: false,
      jobDescription: "",
      requirements: "",
      contactInfo: "",
      nextSteps: "",
    };
  }

  const fallback = {
    company: parseCompanyFromUrl(trimmedUrl),
    role: parseRoleFromUrl(trimmedUrl),
    location: "",
    employmentType: "",
    source: "url-fallback",
    isAtsUrl: isAtsUrl(trimmedUrl),
    jobDescription: "",
    requirements: "",
    contactInfo: "",
    nextSteps: "",
  };

  try {
    const html = await fetchHtml(trimmedUrl);
    const htmlResult = extractFromHtml(html);

    return {
      company: firstNonEmpty(htmlResult.company, fallback.company),
      role: firstNonEmpty(htmlResult.role, fallback.role),
      location: firstNonEmpty(htmlResult.location, fallback.location),
      employmentType: firstNonEmpty(
        htmlResult.employmentType,
        fallback.employmentType,
      ),
      source: htmlResult.source || fallback.source,
      isAtsUrl: fallback.isAtsUrl,
      jobDescription: htmlResult.jobDescription || fallback.jobDescription,
      requirements: htmlResult.requirements || fallback.requirements,
      contactInfo: htmlResult.contactInfo || fallback.contactInfo,
      nextSteps: htmlResult.nextSteps || fallback.nextSteps,
    };
  } catch (error) {
    return {
      ...fallback,
      error: error?.message || "Failed to fetch job posting HTML.",
    };
  }
}

module.exports = {
  parseJobPostingFromUrl,
};
