const { extractJobContentFromHtml } = require("./contentExtractor.cjs");
const { cleanText } = require("./normalizers.cjs");

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

  return objects.flatMap(flattenJsonLdObject);
}

function flattenJsonLdObject(item) {
  if (!item || typeof item !== "object") return [];

  const graphItems = Array.isArray(item["@graph"]) ? item["@graph"] : [];

  return [item, ...graphItems];
}

function normalizeLocationFromJsonLd(jobPosting) {
  const jobLocation = jobPosting?.jobLocation;
  if (!jobLocation) return "";

  const locations = Array.isArray(jobLocation) ? jobLocation : [jobLocation];

  const normalizedLocations = locations
    .map((location) => {
      const address = location?.address ?? location;

      const parts = [
        address?.addressLocality,
        address?.addressRegion,
        address?.addressCountry,
      ]
        .map((part) => cleanText(part || ""))
        .filter(Boolean);

      return parts.join(", ");
    })
    .filter(Boolean);

  if (normalizedLocations.length > 1) {
    return `${normalizedLocations.length} locations`;
  }

  return normalizedLocations[0] || "";
}

function normalizeEmploymentType(value) {
  const values = Array.isArray(value) ? value : [value];

  return values
    .map((entry) =>
      cleanText(entry || "")
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (letter) => letter.toUpperCase()),
    )
    .filter(Boolean)
    .join(", ");
}

function getJobPostingType(item) {
  const typeValue = item?.["@type"];
  return Array.isArray(typeValue) ? typeValue : [typeValue];
}

function isJobPosting(item) {
  return getJobPostingType(item).some(
    (entry) => String(entry || "").toLowerCase() === "jobposting",
  );
}

function extractExplicitContactInfo(item) {
  return cleanText(
    [
      item?.hiringOrganization?.email,
      item?.directApply,
      item?.applicationContact?.email,
    ]
      .flat()
      .filter(Boolean)
      .join("\n"),
  );
}

function extractJobPostingFromJsonLd(html = "") {
  const jsonLdObjects = extractJsonLdObjects(html);
  const pageContent = extractJobContentFromHtml(html);

  for (const item of jsonLdObjects) {
    if (!isJobPosting(item)) continue;

    return {
      role: cleanText(item?.title || item?.name || ""),
      company: cleanText(
        item?.hiringOrganization?.name ||
          item?.hiringOrganization ||
          item?.organization?.name ||
          "",
      ),
      location: normalizeLocationFromJsonLd(item),
      employmentType: normalizeEmploymentType(item?.employmentType),
      jobDescription: "",
      requirements: "",
      contactInfo: extractExplicitContactInfo(item) || pageContent.contactInfo,
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
    contactInfo: pageContent.contactInfo,
    nextSteps: "",
  };
}

module.exports = {
  extractJobPostingFromJsonLd,
};
