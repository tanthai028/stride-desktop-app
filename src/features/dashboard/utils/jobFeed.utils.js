const SIMPLIFY_NEW_GRAD_README_URL =
  "https://raw.githubusercontent.com/SimplifyJobs/New-Grad-Positions/dev/README.md";

const SOFTWARE_SECTION_TITLE_PATTERN =
  /##\s*💻?\s*Software Engineering New Grad Roles/i;

function decodeHtml(value = "") {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

function stripMarkdown(value = "") {
  return decodeHtml(value)
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/[*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const LOCATION_ABBREVIATIONS = {
  SF: "San Francisco",
  NYC: "New York City",
  LA: "Los Angeles",
};

function normalizeLocationDisplay(value = "") {
  const location = decodeHtml(value);

  if (!location) return "Location unknown";

  const locationParts = location
    .split(/<br\s*\/?>|;|\s\/\s|\s\|\s/gi)
    .map((part) => stripMarkdown(part))
    .filter(Boolean);

  if (locationParts.length > 1) {
    return `${locationParts.length} locations`;
  }

  const commaParts = location
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const regionSuffixes = new Set([
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
    "USA",
    "US",
    "United States",
    "Canada",
    "UK",
  ]);

  const hasMultipleCommaLocations =
    commaParts.length > 1 &&
    !commaParts.slice(1).every((part) => regionSuffixes.has(part));

  if (hasMultipleCommaLocations) {
    return `${commaParts.length} locations`;
  }

  const cleanedLocation = stripMarkdown(location);

  return LOCATION_ABBREVIATIONS[cleanedLocation] || cleanedLocation;
}

function isSimplifyUrl(url = "") {
  return url.includes("simplify.jobs");
}

function getHtmlLinks(value = "") {
  return [
    ...value.matchAll(
      /<a[^>]+href=["'](https?:\/\/[^"']+)["'][^>]*>(.*?)<\/a>/gi,
    ),
  ].map((match) => ({
    url: decodeHtml(match[1]),
    body: match[2] || "",
  }));
}

function getMarkdownLinks(value = "") {
  return [...value.matchAll(/\[([^\]]+)]\((https?:\/\/[^)]+)\)/gi)].map(
    (match) => ({
      label: match[1],
      url: decodeHtml(match[2]),
    }),
  );
}

function getPreferredApplyUrl(value = "") {
  const htmlApplyUrl = getHtmlLinks(value).find(
    (link) => !isSimplifyUrl(link.url),
  )?.url;

  if (htmlApplyUrl) return htmlApplyUrl;

  const markdownApplyUrl = getMarkdownLinks(value).find(
    (link) => !isSimplifyUrl(link.url),
  )?.url;

  return markdownApplyUrl || "";
}

function getSoftwareEngineeringSection(markdown) {
  const match = markdown.match(SOFTWARE_SECTION_TITLE_PATTERN);
  if (!match || match.index === undefined) return "";

  const section = markdown.slice(match.index);
  const nextSectionMatch = section.slice(1).match(/\n## /);

  if (!nextSectionMatch) return section;

  return section.slice(0, nextSectionMatch.index + 1);
}

function getActiveRolesSection(section) {
  const inactiveIndex = section.search(/inactive roles/i);
  if (inactiveIndex === -1) return section;
  return section.slice(0, inactiveIndex);
}

function splitMarkdownRow(row) {
  return row
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isTableDividerRow(cells) {
  return cells.every((cell) => /^:?-{3,}:?$/.test(cell.trim()));
}

function parseMarkdownTableFormat(markdown) {
  const section = getActiveRolesSection(
    getSoftwareEngineeringSection(markdown),
  );

  return section
    .split("\n")
    .filter((line) => line.trim().startsWith("|"))
    .map(splitMarkdownRow)
    .filter((cells) => {
      if (cells.length < 5) return false;
      if (isTableDividerRow(cells)) return false;

      const rowText = stripMarkdown(cells.join(" "));
      if (/^company\s+role\s+location/i.test(rowText)) return false;

      return cells.some((cell) => cell.includes("http"));
    })
    .map((cells, index) => {
      const applicationCell = cells[cells.length - 2];

      return {
        id: `simplify-table-${index}-${stripMarkdown(cells[0])}`,
        company: stripMarkdown(cells[0]) || "Unknown company",
        role: stripMarkdown(cells[1]) || "New grad role",
        location: normalizeLocationDisplay(cells[2]),
        datePosted: stripMarkdown(cells[cells.length - 1]) || "Recently",
        url: getPreferredApplyUrl(applicationCell),
        source: "SimplifyJobs",
      };
    })
    .filter((job) => job.url);
}

function getHtmlTableCells(row = "") {
  return [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((match) =>
    match[1].trim(),
  );
}

function parseHtmlTableFormat(markdown) {
  const section = getActiveRolesSection(
    getSoftwareEngineeringSection(markdown),
  );

  return [...section.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)]
    .map((match) => getHtmlTableCells(match[1]))
    .filter((cells) => cells.length >= 5)
    .map((cells, index) => {
      const applicationCell = cells[cells.length - 2];

      return {
        id: `simplify-html-${index}-${stripMarkdown(cells[0])}`,
        company: stripMarkdown(cells[0]) || "Unknown company",
        role: stripMarkdown(cells[1]) || "New grad role",
        location: normalizeLocationDisplay(cells[2]),
        datePosted: stripMarkdown(cells[cells.length - 1]) || "Recently",
        url: getPreferredApplyUrl(applicationCell),
        source: "SimplifyJobs",
      };
    })
    .filter((job) => job.url);
}

export function parseSimplifyNewGradMarkdown(markdown) {
  const markdownTableJobs = parseMarkdownTableFormat(markdown);

  if (markdownTableJobs.length > 0) {
    return markdownTableJobs.slice(0, 30);
  }

  const htmlTableJobs = parseHtmlTableFormat(markdown);

  return htmlTableJobs.slice(0, 30);
}

export async function fetchSimplifyNewGradJobs() {
  const response = await fetch(SIMPLIFY_NEW_GRAD_README_URL, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Could not load the SimplifyJobs feed.");
  }

  const markdown = await response.text();
  return parseSimplifyNewGradMarkdown(markdown);
}
