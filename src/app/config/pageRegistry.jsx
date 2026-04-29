import DashboardPage from "../../features/dashboard/DashboardPage.jsx";
import LibraryPage from "../../features/library/LibraryPage.jsx";
import SettingsPage from "../../features/settings/SettingsPage.jsx";

export const APP_PAGES = {
  dashboard: "dashboard",
  library: "library",
  settings: "settings",
};

export const PAGE_METADATA = {
  [APP_PAGES.dashboard]: {
    eyebrow: "🏠 Dashboard",
    title: "Overview",
    description: "Your job search command center",
  },
  [APP_PAGES.library]: {
    eyebrow: "📚 Application Tracker",
    title: "My Job Application Library",
    description:
      "Track companies, roles, statuses, links, and notes in one place.",
  },
  [APP_PAGES.settings]: {
    eyebrow: "⚙️ Settings",
    title: "App Preferences",
    description: "Manage template behavior and local preferences.",
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

  return <DashboardPage {...pageProps} />;
}
