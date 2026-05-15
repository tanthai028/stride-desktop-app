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

  return objects;
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

function getJobPostingType(item) {
  const typeValue = item?.["@type"];
  return Array.isArray(typeValue) ? typeValue : [typeValue];
}

function isJobPosting(item) {
  return getJobPostingType(item).some(
    (entry) => String(entry || "").toLowerCase() === "jobposting",
  );
}

function extractJobPostingFromJsonLd(html = "") {
  const jsonLdObjects = extractJsonLdObjects(html);

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

module.exports = {
  extractJobPostingFromJsonLd,
};
