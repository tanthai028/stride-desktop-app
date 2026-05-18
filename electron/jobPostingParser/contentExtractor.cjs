const { cleanText, decodeHtmlEntities } = require("./normalizers.cjs");

function stripNoise(html = "") {
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ");
}

function convertHtmlToReadableText(html = "") {
  return decodeHtmlEntities(
    stripNoise(html)
      .replace(/&nbsp;/gi, " ")
      .replace(/<\/?(h1|h2|h3|h4|h5|h6|p|div|section|article|br)[^>]*>/gi, "\n")
      .replace(/<li[^>]*>/gi, "\n- ")
      .replace(/<\/li>/gi, "")
      .replace(/<[^>]*>/g, " "),
  )
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function truncateText(value = "", maxLength = 3000) {
  const text = String(value).trim();
  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength).trim()}…`;
}

function extractContactInfo(text = "") {
  const emailMatches =
    text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [];

  return Array.from(new Set(emailMatches)).slice(0, 5).join("\n");
}

function extractJobContentFromHtml(html = "") {
  const readableText = convertHtmlToReadableText(html);

  return {
    jobDescription: "",
    requirements: "",
    contactInfo: truncateText(cleanText(extractContactInfo(readableText))),
    nextSteps: "",
  };
}

module.exports = {
  extractJobContentFromHtml,
  convertHtmlToReadableText,
};
