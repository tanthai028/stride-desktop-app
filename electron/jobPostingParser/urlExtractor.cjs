const { ATS_HOSTS, IGNORED_PATH_SEGMENTS } = require("./constants.cjs");
const { cleanSlug, toTitleCase } = require("./normalizers.cjs");

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

function looksHumanReadable(value = "") {
  const trimmed = value.trim();

  if (!trimmed) return false;
  if (looksLikeUuid(trimmed)) return false;
  if (looksLikeNumericId(trimmed)) return false;
  if (looksLikeReqId(trimmed)) return false;

  const cleaned = cleanSlug(trimmed);

  return /[a-zA-Z]/.test(cleaned) && cleaned.length >= 3;
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
      .filter((segment) => !IGNORED_PATH_SEGMENTS.has(segment.toLowerCase()))
      .filter(looksHumanReadable);

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

module.exports = {
  getProviderInfo,
  parseCompanyFromUrl,
  parseRoleFromUrl,
  isAtsUrl,
};
