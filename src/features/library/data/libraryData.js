const now = new Date();

function getDateOffset(daysAgo = 0) {
  const date = new Date(now);
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

export const libraryItems = [
  {
    id: "item-default-raymond-james",
    company: "Raymond James",
    role: "Software Developer Track",
    status: "Applied",
    jobUrl: "https://www.raymondjames.com/careers",
    location: "St. Petersburg, FL",
    appliedAt: getDateOffset(3),
    notes:
      "Applied to the IT Accelerated Development Program software developer track. Need to track recruiter updates, follow-up timing, and resume version used.",
    createdAt: getDateOffset(3),
    updatedAt: getDateOffset(3),
  },
  {
    id: "item-default-ge-aerospace",
    company: "GE Aerospace",
    role: "Early Career Software Engineer",
    status: "Wishlist",
    jobUrl: "https://jobs.gecareers.com/",
    location: "Remote",
    appliedAt: "",
    notes:
      "Saved as a target role because prior internship experience is relevant. Need to compare against other internal tools and platform roles before applying.",
    createdAt: getDateOffset(8),
    updatedAt: getDateOffset(8),
  },
  {
    id: "item-default-palantir",
    company: "Palantir",
    role: "Deployment Strategist / SWE",
    status: "Interview",
    jobUrl: "https://www.palantir.com/careers/",
    location: "New York, NY",
    appliedAt: getDateOffset(14),
    notes:
      "High-interest company. Keep notes on role fit, technical expectations, and whether the workflow matches long-term goals.",
    createdAt: getDateOffset(14),
    updatedAt: getDateOffset(10),
  },
  {
    id: "item-default-jpmorgan",
    company: "JPMorgan Chase",
    role: "Software Engineer Program",
    status: "OA",
    jobUrl: "https://careers.jpmorgan.com/",
    location: "Tampa, FL",
    appliedAt: getDateOffset(21),
    notes:
      "Past internship connection makes this useful as a reference application. Keep notes on timeline, OA progress, and follow-up decisions.",
    createdAt: getDateOffset(21),
    updatedAt: getDateOffset(5),
  },
];
