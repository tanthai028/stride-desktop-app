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

const IGNORED_PATH_SEGMENTS = new Set([
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
]);

module.exports = {
  ATS_HOSTS,
  REQUEST_TIMEOUT_MS,
  IGNORED_PATH_SEGMENTS,
};
