import DashboardPage from "../../features/dashboard/DashboardPage.jsx";
import LibraryPage from "../../features/library/pages/LibraryPage.jsx";
import JobDetailsPage from "../../features/library/pages/JobDetailsPage.jsx";
import SessionsPage from "../../features/sessions/SessionsPage.jsx";
import SettingsPage from "../../features/settings/SettingsPage.jsx";

export const APP_PAGES = {
  dashboard: "dashboard",
  library: "library",
  jobDetails: "jobDetails",
  sessions: "sessions",
  settings: "settings",
};

export const PAGE_METADATA = {
  [APP_PAGES.dashboard]: {
    eyebrow: "🏠 Dashboard",
    title: "Dashboard Overview",
    description: "Last Updated",
  },
  [APP_PAGES.library]: {
    eyebrow: "📚 Application Library",
    title: "Applications",
    description: "",
  },
  [APP_PAGES.jobDetails]: {
    eyebrow: "📄 Job Page",
    title: "Job Details",
    description: "",
  },
  [APP_PAGES.sessions]: {
    eyebrow: "📋 History",
    title: "Application History",
    description: "A record of every Apply Mode session",
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

  if (pageName === APP_PAGES.sessions) {
    return <SessionsPage {...pageProps} />;
  }

  if (pageName === APP_PAGES.library) {
    return <LibraryPage {...pageProps} />;
  }

  if (pageName === APP_PAGES.jobDetails) {
    return <JobDetailsPage {...pageProps} />;
  }

  return <DashboardPage {...pageProps} />;
}
