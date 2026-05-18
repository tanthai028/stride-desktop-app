import DashboardPage from "../../features/dashboard/DashboardPage.jsx";
import LibraryPage from "../../features/library/pages/LibraryPage.jsx";
import JobDetailsPage from "../../features/library/pages/JobDetailsPage.jsx";
import SettingsPage from "../../features/settings/SettingsPage.jsx";

export const APP_PAGES = {
  dashboard: "dashboard",
  library: "library",
  jobDetails: "jobDetails",
  settings: "settings",
};

export const PAGE_METADATA = {
  [APP_PAGES.dashboard]: {
    eyebrow: "🏠 Dashboard",
    title: "Dashboard Overview",
    description: "",
  },
  [APP_PAGES.library]: {
    eyebrow: "📚 Application Tracker",
    title: "Job Application Library",
    description: "",
  },
  [APP_PAGES.jobDetails]: {
    eyebrow: "📄 Job Page",
    title: "Job Details",
    description: "",
  },
  [APP_PAGES.settings]: {
    eyebrow: "⚙️ Settings",
    title: "App Preferences",
    description: "",
  },
};

export function getPageMetadata(pageName) {
  return PAGE_METADATA[pageName] || PAGE_METADATA[APP_PAGES.dashboard];
}

export function getPageComponent(pageName, pageProps) {
  if (pageName === APP_PAGES.settings) {
    return <SettingsPage {...pageProps} />;
  }

  if (pageName === APP_PAGES.library) {
    return <LibraryPage {...pageProps} />;
  }

  if (pageName === APP_PAGES.jobDetails) {
    return <JobDetailsPage {...pageProps} />;
  }

  return <DashboardPage {...pageProps} />;
}
