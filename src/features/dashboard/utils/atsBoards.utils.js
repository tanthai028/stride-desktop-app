import {
  ATS_CACHE_STORAGE_KEY,
  ATS_CACHE_TTL_MS,
  ATS_COMPANY_BOARDS,
  ATS_MAX_AGE_DAYS,
  ATS_MAX_RESULTS,
  ATS_REQUIRE_US_LOCATION,
  FOREIGN_LOCATION_HINTS,
  NEGATIVE_TITLE_SIGNALS,
  NEW_GRAD_TITLE_SIGNALS,
  SWE_TITLE_SIGNALS,
  US_LOCATION_TERMS,
  US_STATE_CODES,
} from "../constants/jobFeed.constants.js";

const MAX_AGE_MS = ATS_MAX_AGE_DAYS * 86_400_000;

function isRecent(timestamp) {
  if (!Number.isFinite(timestamp) || timestamp <= 0) return false;
  return Date.now() - timestamp <= MAX_AGE_MS;
}

function readCache() {
  try {
    const raw = localStorage.getItem(ATS_CACHE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.cachedAt || !Array.isArray(parsed?.jobs)) return null;
    if (Date.now() - parsed.cachedAt > ATS_CACHE_TTL_MS) return null;
    return parsed.jobs;
  } catch {
    return null;
  }
}

function writeCache(jobs) {
  try {
    localStorage.setItem(
      ATS_CACHE_STORAGE_KEY,
      JSON.stringify({ cachedAt: Date.now(), jobs }),
    );
  } catch {
    // localStorage may be full or unavailable — non-fatal.
  }
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Build a single case-insensitive regex that matches any signal as a word.
// Using `(?:^|\\W)…(?:$|\\W)` instead of `\\b` so multi-word signals with
// internal punctuation still anchor on word edges (e.g. "sr." vs "engineer ii").
function buildSignalRegex(signals) {
  const escaped = signals.map(escapeRegex);
  return new RegExp(`(?:^|\\W)(?:${escaped.join("|")})(?=$|\\W)`, "i");
}

const NEW_GRAD_REGEX = buildSignalRegex(NEW_GRAD_TITLE_SIGNALS);
const SWE_REGEX = buildSignalRegex(SWE_TITLE_SIGNALS);
const NEGATIVE_REGEX = buildSignalRegex(NEGATIVE_TITLE_SIGNALS);

// US state code as a standalone token. Separators are `,` `/` or whitespace
// (not generic \W, so "San Francisco, CA" matches but "Casablanca" doesn't —
// the "ca" there isn't preceded by a state-code separator).
const US_STATE_REGEX = new RegExp(
  `(?:^|[,/\\s])(?:${US_STATE_CODES.join("|")})(?=$|[,/\\s])`,
);
const US_TERMS_REGEX = buildSignalRegex(US_LOCATION_TERMS);
const FOREIGN_REGEX = buildSignalRegex(FOREIGN_LOCATION_HINTS);

// Strip diacritical marks so accented city/country names (e.g. "Reykjavík",
// "Zürich") still match the plain-ASCII entries in FOREIGN_LOCATION_HINTS.
function stripDiacritics(str) {
  return str.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// Returns true if the location string looks like a US location.
// Order matters: strong US signals (state code, "United States") override
// foreign hints to handle cases like "Canada, KY" (Kentucky town).
function isUsLocation(location) {
  if (!location) return true; // missing location → don't penalize
  const loc = stripDiacritics(location);
  if (US_STATE_REGEX.test(loc)) return true;
  if (US_TERMS_REGEX.test(loc)) return true;
  if (FOREIGN_REGEX.test(loc)) return false;
  return true; // unrecognized → assume US (e.g., "Remote", bare city names)
}

function formatDate(value) {
  if (!value) return "Recently";
  const ms = typeof value === "number" ? value : Date.parse(value);
  if (!Number.isFinite(ms)) return "Recently";
  const diffDays = Math.floor((Date.now() - ms) / 86_400_000);
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "1d";
  if (diffDays < 7) return `${diffDays}d`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w`;
  return `${Math.floor(diffDays / 30)}mo`;
}

async function fetchJson(url) {
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

async function fetchGreenhouseBoard({ slug, name }) {
  const data = await fetchJson(
    `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs`,
  );
  const jobs = Array.isArray(data?.jobs) ? data.jobs : [];

  return jobs.map((job) => {
    const postedAt = Date.parse(job.updated_at) || 0;
    return {
      id: `gh-${slug}-${job.id}`,
      company: name,
      role: job.title || "Software role",
      location: job.location?.name || "Unknown",
      url: job.absolute_url,
      postedAt,
      datePosted: formatDate(postedAt),
      source: "Greenhouse",
    };
  });
}

async function fetchLeverBoard({ slug, name }) {
  const data = await fetchJson(
    `https://api.lever.co/v0/postings/${slug}?mode=json`,
  );
  const jobs = Array.isArray(data) ? data : [];

  return jobs.map((job) => {
    const postedAt = Number.isFinite(job.createdAt) ? job.createdAt : 0;
    return {
      id: `lever-${slug}-${job.id}`,
      company: name,
      role: job.text || "Software role",
      location:
        job.categories?.allLocations?.join(", ") ||
        job.categories?.location ||
        "Unknown",
      url: job.hostedUrl,
      postedAt,
      datePosted: formatDate(postedAt),
      source: "Lever",
    };
  });
}

async function fetchAshbyBoard({ slug, name }) {
  const data = await fetchJson(
    `https://api.ashbyhq.com/posting-api/job-board/${slug}?includeCompensation=false`,
  );
  const jobs = Array.isArray(data?.jobs) ? data.jobs : [];

  return jobs.map((job) => {
    const postedAt = Date.parse(job.publishedAt) || 0;
    return {
      id: `ashby-${slug}-${job.id}`,
      company: name,
      role: job.title || "Software role",
      location: job.isRemote ? "Remote" : job.location || "Unknown",
      url: job.jobUrl,
      postedAt,
      datePosted: formatDate(postedAt),
      source: "Ashby",
    };
  });
}

// Split a location string into individual locations.
// Handles pipe/semicolon separated multi-location strings from ATS APIs
// (e.g. "San Francisco, CA | New York, NY | Seattle, WA").
// Does NOT split on commas to preserve "City, STATE" pairs.
function parseLocations(location) {
  if (!location || location === "Unknown") return [];
  return location
    .split(/\s*[|;]\s*/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function formatMergedLocation(locs) {
  if (locs.length === 0) return "Unknown";
  if (locs.length === 1) return locs[0];
  const allRemote = locs.every((l) => /remote/i.test(l));
  if (allRemote) return "Remote";
  if (locs.length === 2) return `${locs[0]} · ${locs[1]}`;
  return `${locs[0]} +${locs.length - 1} more`;
}

// Collapse duplicate postings of the same role at different offices into one
// entry with a merged location string. Runs after the US filter so only
// US-confirmed locations are merged.
function deduplicateByRole(jobs) {
  const seen = new Map();
  for (const job of jobs) {
    const key = `${job.company.toLowerCase()}__${job.role.toLowerCase()}`;
    const newLocs = parseLocations(job.location);
    if (seen.has(key)) {
      const existing = seen.get(key);
      for (const loc of newLocs) {
        if (!existing.allLocations.includes(loc)) {
          existing.allLocations.push(loc);
        }
      }
    } else {
      seen.set(key, { ...job, allLocations: newLocs });
    }
  }
  return [...seen.values()].map(({ allLocations, ...job }) => ({
    ...job,
    location: formatMergedLocation(allLocations),
  }));
}

export async function fetchAtsBoardJobs({ force = false } = {}) {
  if (!force) {
    const cached = readCache();
    if (cached && cached.length > 0) return cached;
  }

  const tasks = [
    ...ATS_COMPANY_BOARDS.greenhouse.map(fetchGreenhouseBoard),
    ...ATS_COMPANY_BOARDS.lever.map(fetchLeverBoard),
    ...ATS_COMPANY_BOARDS.ashby.map(fetchAshbyBoard),
  ];

  const results = await Promise.allSettled(tasks);
  const allJobs = results.flatMap((result) =>
    result.status === "fulfilled" ? result.value : [],
  );

  const seenUrls = new Set();
  const dropCounts = { badtitle: 0, tooold: 0, dupe: 0 };

  // First pass: filter by title + recency + dedupe. Keep all locations for now;
  // we apply US/non-US partitioning afterwards so we can fall back if needed.
  const titleMatched = allJobs.filter((job) => {
    if (!job.url || !job.role) return false;
    if (seenUrls.has(job.url)) {
      dropCounts.dupe += 1;
      return false;
    }
    if (NEGATIVE_REGEX.test(job.role) || !SWE_REGEX.test(job.role)) {
      dropCounts.badtitle += 1;
      return false;
    }
    if (!isRecent(job.postedAt)) {
      dropCounts.tooold += 1;
      return false;
    }
    seenUrls.add(job.url);
    return true;
  });

  const sortedByDate = [...titleMatched].sort((a, b) => b.postedAt - a.postedAt);

  // US partition + fallback. If US filter is on and yields zero, surface all
  // title-matched roles so the card never looks empty when matches exist.
  const usJobs = ATS_REQUIRE_US_LOCATION
    ? sortedByDate.filter((job) => isUsLocation(job.location))
    : sortedByDate;
  const usedFallback = ATS_REQUIRE_US_LOCATION && usJobs.length === 0 && sortedByDate.length > 0;
  const finalSet = usedFallback ? sortedByDate : usJobs;
  const deduped = deduplicateByRole(finalSet);
  const filtered = deduped.slice(0, ATS_MAX_RESULTS);

  if (import.meta.env?.DEV) {
    // eslint-disable-next-line no-console
    console.log(
      "[ATS feed] raw:", allJobs.length,
      "title-matched:", titleMatched.length,
      "us-matched:", usJobs.length,
      "kept:", filtered.length,
      usedFallback ? "(FALLBACK: no US matches, showing all locations)" : "",
      "\ndropped:", dropCounts,
      "\nSample kept:", filtered.slice(0, 12).map((j) => `[${j.source}] ${j.role} — ${j.location}`),
    );
  }

  if (filtered.length > 0) writeCache(filtered);
  return filtered;
}
