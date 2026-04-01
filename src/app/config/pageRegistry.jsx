import DashboardPage from "../../features/dashboard/pages/DashboardPage.jsx";
import LibraryPage from "../../features/library/pages/LibraryPage.jsx";
import SettingsPage from "../../features/settings/pages/SettingsPage.jsx";

export const APP_PAGES = {
  dashboard: "dashboard",
  library: "library",
  settings: "settings",
};

export function getPageComponent(pageName, pageProps) {
  if (pageName === APP_PAGES.settings) {
    return <SettingsPage {...pageProps} />;
  }

  if (pageName === APP_PAGES.library) {
    return <LibraryPage {...pageProps} />;
  }

  return <DashboardPage {...pageProps} />;
}
