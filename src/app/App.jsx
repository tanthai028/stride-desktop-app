import { useEffect, useState } from "react";
import WindowFrame from "../components/layout/WindowFrame.jsx";
import AppHeader from "../components/layout/AppHeader.jsx";
import AppSidebar from "../components/layout/AppSidebar.jsx";
import { useSettings } from "../features/settings/hooks/useSettings.js";
import {
  APP_PAGES,
  getPageComponent,
  getPageMetadata,
} from "./config/pageRegistry";
import StartupSplash from "./startup/StartupSplash.jsx";
import useStartupSequence from "./startup/useStartupSequence.js";

function App() {
  const { settings, updateSetting, resetSettings } = useSettings();

  const [activePage, setActivePage] = useState(APP_PAGES.dashboard);

  const { showSplash, mountRealApp, isAppReady } = useStartupSequence();

  useEffect(() => {
    document.documentElement.classList.toggle("theme-dark", settings.darkMode);
    document.body.classList.toggle("theme-dark", settings.darkMode);

    window.appSettings?.updateThemeBackground?.(settings.darkMode);
  }, [settings.darkMode]);

  function handleQuickAction(actionId) {
    if (actionId === "settings") {
      setActivePage(APP_PAGES.settings);
      return;
    }

    if (actionId === "library") {
      setActivePage(APP_PAGES.library);
    }
  }

  const activePageContent = getPageComponent(activePage, {
    settings,
    updateSetting,
    resetSettings,
    onAction: handleQuickAction,
  });

  const activePageMetadata = getPageMetadata(activePage);

  if (showSplash && !mountRealApp) {
    return <StartupSplash />;
  }

  const appStartupClassName = `app-startup-enter h-full ${
    isAppReady ? "is-visible" : ""
  }`;

  return (
    <>
      {showSplash && (
        <div className="pointer-events-none fixed inset-0 z-[999]">
          <StartupSplash />
        </div>
      )}

      <div className={appStartupClassName}>
        <WindowFrame
          sidebar={
            <AppSidebar activePage={activePage} onNavigate={setActivePage} />
          }
        >
          <AppHeader
            eyebrow={activePageMetadata.eyebrow}
            title={activePageMetadata.title}
            description={activePageMetadata.description}
          />

          {activePageContent}
        </WindowFrame>
      </div>
    </>
  );
}

export default App;
