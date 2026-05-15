import { useEffect, useMemo, useState } from "react";
import WindowFrame from "../components/layout/WindowFrame.jsx";
import AppHeader from "../components/layout/AppHeader.jsx";
import AppSidebar from "../components/layout/AppSidebar.jsx";
import ApplyModePanel from "../features/apply-mode/ApplyModePanel.jsx";
import useLibraryItems from "../features/library/hooks/useLibraryItems.js";
import { extractJobId } from "../features/library/utils/libraryDisplayFormatters.js";
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
  const libraryStore = useLibraryItems(settings.resetVersion);
  const [activePage, setActivePage] = useState(APP_PAGES.dashboard);
  const [activeJobId, setActiveJobId] = useState(null);

  const isApplyModeWindow =
    new URLSearchParams(window.location.search).get("mode") === "apply";

  const { showSplash, mountRealApp, isAppReady } = useStartupSequence();

  const activeJob = useMemo(
    () => libraryStore.items.find((item) => item.id === activeJobId) ?? null,
    [activeJobId, libraryStore.items],
  );

  useEffect(() => {
    document.documentElement.classList.toggle("theme-dark", settings.darkMode);
    document.body.classList.toggle("theme-dark", settings.darkMode);

    if (!isApplyModeWindow) {
      window.appSettings?.updateThemeBackground?.(settings.darkMode);
    }
  }, [settings.darkMode, isApplyModeWindow]);

  function handleNavigate(pageName) {
    setActivePage(pageName);

    if (pageName !== APP_PAGES.jobDetails) {
      setActiveJobId(null);
    }
  }

  function handleOpenJobPage(item) {
    setActiveJobId(item.id);
    setActivePage(APP_PAGES.jobDetails);
  }

  function handleQuickAction(actionId) {
    if (actionId === "settings") {
      handleNavigate(APP_PAGES.settings);
      return;
    }

    if (actionId === "library") {
      handleNavigate(APP_PAGES.library);
    }
  }

  if (isApplyModeWindow) {
    return (
      <ApplyModePanel
        items={libraryStore.items}
        updateItem={libraryStore.updateItem}
        deleteItem={libraryStore.deleteItem}
        settings={settings}
        updateSetting={updateSetting}
      />
    );
  }

  const activePageContent = getPageComponent(activePage, {
    settings,
    updateSetting,
    resetSettings,
    onAction: handleQuickAction,
    libraryStore,
    activeJob,
    onOpenJobPage: handleOpenJobPage,
    onBackToLibrary: () => handleNavigate(APP_PAGES.library),
  });

  const baseMetadata = getPageMetadata(activePage);

  const activePageMetadata =
    activePage === APP_PAGES.jobDetails && activeJob
      ? {
          eyebrow: "📄 Job Page",
          title: [activeJob.company, activeJob.role]
            .filter(Boolean)
            .join(" — "),
          description: [
            activeJob.location || "No location",
            `Job ID: ${extractJobId(activeJob.jobUrl) || activeJob.id}`,
          ].join(" · "),
        }
      : baseMetadata;

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
            <AppSidebar activePage={activePage} onNavigate={handleNavigate} />
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
