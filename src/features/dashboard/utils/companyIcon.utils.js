function getSafeDomainFromUrl(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

function getDomainFromCompany(company) {
  return company
    ?.toLowerCase()
    .replace(/\b(inc|llc|ltd|corp|corporation|company|co)\b/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

export function getCompanyIconUrl(company) {
  const companyDomain = getDomainFromCompany(company);

  if (!companyDomain) {
    return "https://www.google.com/s2/favicons?domain=example.com&sz=64";
  }

  return `https://www.google.com/s2/favicons?domain=${companyDomain}.com&sz=64`;
}

export function handleCompanyIconFallback(event, fallbackUrl) {
  const fallbackDomain = getSafeDomainFromUrl(fallbackUrl);

  if (!fallbackDomain || event.currentTarget.dataset.fallbackUsed === "true") {
    return;
  }

  event.currentTarget.dataset.fallbackUsed = "true";
  event.currentTarget.src = `https://www.google.com/s2/favicons?domain=${fallbackDomain}&sz=64`;
}
