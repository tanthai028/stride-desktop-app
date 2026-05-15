const { extractFromHtml } = require("./htmlExtractor.cjs");
const { fetchHtml } = require("./httpClient.cjs");
const { firstNonEmpty } = require("./normalizers.cjs");
const {
  parseCompanyFromUrl,
  parseRoleFromUrl,
  isAtsUrl,
} = require("./urlExtractor.cjs");

function createEmptyResult() {
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

function createUrlFallbackResult(url) {
  return {
    company: parseCompanyFromUrl(url),
    role: parseRoleFromUrl(url),
    location: "",
    employmentType: "",
    source: "url-fallback",
    isAtsUrl: isAtsUrl(url),
    jobDescription: "",
    requirements: "",
    contactInfo: "",
    nextSteps: "",
  };
}

function mergeParsedJobData(htmlResult, fallback) {
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
}

async function parseJobPostingFromUrl(urlValue = "") {
  const trimmedUrl = String(urlValue ?? "").trim();

  if (!trimmedUrl) {
    return createEmptyResult();
  }

  const fallback = createUrlFallbackResult(trimmedUrl);

  try {
    const html = await fetchHtml(trimmedUrl);
    const htmlResult = extractFromHtml(html);

    return mergeParsedJobData(htmlResult, fallback);
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
