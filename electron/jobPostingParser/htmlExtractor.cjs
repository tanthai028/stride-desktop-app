const {
  extractJobContentFromHtml,
  convertHtmlToReadableText,
} = require("./contentExtractor.cjs");
const { extractJobPostingFromJsonLd } = require("./jsonLdExtractor.cjs");
const { cleanText, firstNonEmpty } = require("./normalizers.cjs");

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

function extractLocationFromText(text = "") {
  const match = text.match(
    /\b(remote|hybrid|onsite|on-site|[A-Z][a-zA-Z .'-]+,\s?[A-Z]{2})\b/i,
  );

  return cleanText(match?.[0] || "");
}

function extractEmploymentTypeFromText(text = "") {
  const match = text.match(
    /\b(full[-\s]?time|part[-\s]?time|contract|temporary|internship|co-op)\b/i,
  );

  return cleanText(match?.[0] || "");
}

function extractFromHtml(html = "") {
  const pageText = convertHtmlToReadableText(html);
  const pageContent = extractJobContentFromHtml(html);

  const metaTitle =
    getMetaContent(html, "property", "og:title") ||
    getMetaContent(html, "name", "twitter:title");

  const metaDescription =
    getMetaContent(html, "property", "og:description") ||
    getMetaContent(html, "name", "description");

  const jsonLd = extractJobPostingFromJsonLd(html);
  const titleText = firstNonEmpty(metaTitle, getTitleFromHtml(html));
  const titleParts = parseTitleParts(titleText);

  return {
    role: firstNonEmpty(jsonLd.role, titleParts.role),
    company: firstNonEmpty(jsonLd.company, titleParts.company),
    location: firstNonEmpty(
      jsonLd.location,
      extractLocationFromText(metaDescription),
      extractLocationFromText(pageText),
    ),
    employmentType: firstNonEmpty(
      jsonLd.employmentType,
      extractEmploymentTypeFromText(pageText),
    ),
    source:
      jsonLd.role || jsonLd.company
        ? "html-jsonld"
        : titleText
          ? "html-title"
          : "",
    jobDescription: "",
    requirements: "",
    contactInfo: firstNonEmpty(jsonLd.contactInfo, pageContent.contactInfo),
    nextSteps: "",
  };
}

module.exports = {
  extractFromHtml,
};
