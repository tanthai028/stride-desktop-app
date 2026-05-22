// Seed company boards for the "Curated Boards" feed source. Each entry must
// have a slug (the path segment used by the ATS public API) and a display
// name. Companies that switch ATS will silently return 0 jobs.
export const ATS_COMPANY_BOARDS = {
  greenhouse: [
    { slug: "stripe", name: "Stripe" },
    { slug: "airbnb", name: "Airbnb" },
    { slug: "reddit", name: "Reddit" },
    { slug: "figma", name: "Figma" },
    { slug: "cloudflare", name: "Cloudflare" },
    { slug: "twitch", name: "Twitch" },
    { slug: "discord", name: "Discord" },
    { slug: "robinhood", name: "Robinhood" },
    { slug: "datadog", name: "Datadog" },
    { slug: "asana", name: "Asana" },
    { slug: "instacart", name: "Instacart" },
    { slug: "lyft", name: "Lyft" },
    { slug: "pinterest", name: "Pinterest" },
    { slug: "anthropic", name: "Anthropic" },
    { slug: "mongodb", name: "MongoDB" },
    { slug: "gitlab", name: "GitLab" },
    { slug: "squarespace", name: "Squarespace" },
    { slug: "gusto", name: "Gusto" },
    { slug: "duolingo", name: "Duolingo" },
  ],
  lever: [
    { slug: "netflix", name: "Netflix" },
    { slug: "spotify", name: "Spotify" },
    { slug: "kraken", name: "Kraken" },
    { slug: "palantir", name: "Palantir" },
  ],
  ashby: [
    { slug: "linear", name: "Linear" },
    { slug: "vercel", name: "Vercel" },
    { slug: "supabase", name: "Supabase" },
    { slug: "posthog", name: "PostHog" },
    { slug: "neon", name: "Neon" },
    { slug: "modal", name: "Modal" },
    { slug: "warp", name: "Warp" },
    { slug: "raycast", name: "Raycast" },
    { slug: "perplexity", name: "Perplexity" },
    { slug: "mintlify", name: "Mintlify" },
    { slug: "browserbase", name: "Browserbase" },
    { slug: "langchain", name: "LangChain" },
  ],
};

// Title must contain at least one new-grad signal (matches the second clause
// of the source Google query).
export const NEW_GRAD_TITLE_SIGNALS = [
  "new grad",
  "new graduate",
  "entry level",
  "entry-level",
  "early career",
  "early-career",
  "graduate program",
  "graduate",
  "university hire",
  "university grad",
  "university",
  "campus",
  "rotational",
  "junior",
  "associate engineer",
  "associate software",
  "software engineer i",
  "swe i",
  "engineer i",
];

// Title must contain at least one SWE-flavoured signal (third clause).
export const SWE_TITLE_SIGNALS = [
  // Generic SWE
  "software engineer",
  "software engineering",
  "software developer",
  "software development",
  "swe",
  // Specializations explicit in the original query
  "backend engineer",
  "backend engineering",
  "platform engineer",
  "platform engineering",
  "developer productivity",
  "internal tools",
  "tooling engineer",
  "tooling",
  "automation engineer",
  "automation engineering",
  "systems engineer",
  "systems engineering",
  "product engineer",
  "product engineering",
  // Common SWE specializations (broadened — most new-grad postings live here)
  "frontend engineer",
  "front-end engineer",
  "front end engineer",
  "full stack engineer",
  "full-stack engineer",
  "fullstack engineer",
  "infrastructure engineer",
  "infra engineer",
  "devops engineer",
  "site reliability engineer",
  "sre",
  "security engineer",
  "cloud engineer",
  "application engineer",
  "applications engineer",
  "web engineer",
  "production engineer",
  "release engineer",
  "mobile engineer",
  "ios engineer",
  "android engineer",
];

// Title must NOT contain any of these (the trailing `-flag` clauses).
export const NEGATIVE_TITLE_SIGNALS = [
  "intern",
  "interns",
  "internship",
  "internships",
  "contract",
  "contracts",
  "contractor",
  "contractors",
  "senior",
  "sr",
  "staff",
  "principal",
  "lead",
  "leads",
  "manager",
  "managers",
  "director",
  "directors",
  "architect",
  "master",
];

// US state and territory codes — strong "this is a US location" signal
// when seen as a standalone token (e.g. ", CA" in "San Francisco, CA").
export const US_STATE_CODES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN",
  "IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV",
  "NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN",
  "TX","UT","VT","VA","WA","WV","WI","WY","DC","PR","GU","VI",
];

// Spelled-out US identifiers. Matched as words on the full location string.
export const US_LOCATION_TERMS = [
  "united states",
  "usa",
  "u.s.a",
  "u.s.",
  "us only",
  "us-remote",
  "us remote",
  "remote - us",
  "remote (us)",
  "remote, us",
];

// Foreign country / major non-US city names. If a location contains any of
// these AND has no positive US signal, it's filtered as non-US. Word-bounded
// to avoid false positives (e.g. "india" won't match "Indiana").
//
// Notes on omissions:
// - "mexico" is omitted because "New Mexico" is a US state. Use "mexico city" instead.
// - "georgia" is omitted because Georgia is also a US state. Country-of-Georgia
//   listings are rare in tech.
export const FOREIGN_LOCATION_HINTS = [
  // Countries
  "united kingdom", "u.k.", "uk",
  "canada", "germany", "france", "spain", "italy", "portugal", "ireland",
  "netherlands", "switzerland", "sweden", "norway", "finland", "denmark",
  "poland", "ukraine", "turkey", "greece", "austria", "belgium", "iceland",
  "luxembourg", "czechia", "estonia", "lithuania", "latvia", "romania",
  "hungary", "croatia", "serbia", "bulgaria",
  "israel", "uae", "qatar",
  "india", "china", "japan", "korea", "singapore", "taiwan", "thailand",
  "vietnam", "indonesia", "philippines", "malaysia",
  "australia", "new zealand",
  "brazil", "argentina", "chile", "colombia", "peru",
  "south africa", "kenya", "nigeria", "egypt", "morocco",
  "russia",
  // Non-US cities (when posting only lists city)
  "london", "manchester", "edinburgh", "dublin", "berlin", "munich",
  "paris", "madrid", "barcelona", "lisbon", "amsterdam", "rotterdam",
  "stockholm", "oslo", "helsinki", "copenhagen", "warsaw", "moscow",
  "tokyo", "osaka", "seoul", "bangalore", "mumbai", "delhi", "hyderabad",
  "shanghai", "beijing", "hong kong",
  "sydney", "melbourne", "auckland", "toronto", "vancouver", "montreal",
  "mexico city", "sao paulo", "buenos aires", "santiago",
  "reykjavik",
  // Region-only remotes
  "remote - emea", "remote - eu", "remote - europe", "remote - apac",
  "remote - latam", "remote - india", "remote - uk", "remote - canada",
  "emea", "apac", "latam",
];

export const ATS_MAX_RESULTS = 30;

// When true, filter to US-only locations. If the strict US filter yields
// zero results, the fetcher automatically falls back to showing all
// title-matched locations.
export const ATS_REQUIRE_US_LOCATION = true;

// Sanity ceiling on age — anything older than this is almost certainly stale
// (board cleanup lag). We sort by date and slice to ATS_MAX_RESULTS first,
// so the "newest 30 matching jobs" is what actually drives the list.
export const ATS_MAX_AGE_DAYS = 120;

// Cache the filtered result in localStorage so source-switches and
// app relaunches are instant. The refresh button bypasses this.
export const ATS_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
export const ATS_CACHE_STORAGE_KEY = "stride.atsFeed.v6";

// Persist which feed source was last active so it survives reloads.
export const FEED_SOURCE_STORAGE_KEY = "stride.feedSource.v1";
