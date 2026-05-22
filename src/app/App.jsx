import { useEffect, useMemo, useState } from "react";
import WindowFrame from "../components/layout/WindowFrame.jsx";
import AppHeader from "../components/layout/AppHeader.jsx";
import AppSidebar from "../components/layout/AppSidebar.jsx";
import ApplyModePanel from "../features/apply-mode/ApplyModePanel.jsx";
import useLibraryItems from "../features/library/hooks/useLibraryItems.js";
import { isUnapplied } from "../features/apply-mode/utils/applyModeItemStatus.js";
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
  const [headerDescriptionOverride, setHeaderDescriptionOverride] =
    useState(null);
  const [navigationState, setNavigationState] = useState({
    current: {
      page: APP_PAGES.dashboard,
      jobId: null,
    },
    back: [],
    forward: [],
  });

  const activePage = navigationState.current.page;
  const activeJobId = navigationState.current.jobId;

  const isApplyModeWindow =
    new URLSearchParams(window.location.search).get("mode") === "apply";

  const { showSplash, mountRealApp, isAppReady } = useStartupSequence();

  const activeJob = useMemo(
    () => libraryStore.items.find((item) => item.id === activeJobId) ?? null,
    [activeJobId, libraryStore.items],
  );

  const unappliedCount = useMemo(
    () => libraryStore.items.filter(isUnapplied).length,
    [libraryStore.items],
  );

  useEffect(() => {
    document.documentElement.classList.toggle("theme-dark", settings.darkMode);
    document.body.classList.toggle("theme-dark", settings.darkMode);

    if (!isApplyModeWindow) {
      window.appSettings?.updateThemeBackground?.(settings.darkMode);
    }
  }, [settings.darkMode, isApplyModeWindow]);

  function normalizeEntry(entry) {
    return {
      page: entry.page,
      jobId: entry.page === APP_PAGES.jobDetails ? entry.jobId : null,
    };
  }

  function areSameEntry(left, right) {
    return left.page === right.page && left.jobId === right.jobId;
  }

  function pushNavigation(nextEntry) {
    const normalizedNextEntry = normalizeEntry(nextEntry);

    setNavigationState((state) => {
      if (areSameEntry(state.current, normalizedNextEntry)) {
        return state;
      }

      return {
        current: normalizedNextEntry,
        back: [...state.back, state.current],
        forward: [],
      };
    });
  }

  function handleNavigate(pageName) {
    pushNavigation({
      page: pageName,
      jobId: null,
    });
  }

  function handleOpenJobPage(item) {
    pushNavigation({
      page: APP_PAGES.jobDetails,
      jobId: item.id,
    });
  }

  function handleGoBack() {
    setNavigationState((state) => {
      if (state.back.length === 0) return state;

      const previousEntry = state.back[state.back.length - 1];

      return {
        current: previousEntry,
        back: state.back.slice(0, -1),
        forward: [state.current, ...state.forward],
      };
    });
  }

  function handleGoForward() {
    setNavigationState((state) => {
      if (state.forward.length === 0) return state;

      const nextEntry = state.forward[0];

      return {
        current: nextEntry,
        back: [...state.back, state.current],
        forward: state.forward.slice(1),
      };
    });
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
    onHeaderDescriptionChange: setHeaderDescriptionOverride,
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
          jobHeader: activeJob,
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
          navigation={{
            canGoBack: navigationState.back.length > 0,
            canGoForward: navigationState.forward.length > 0,
            onGoBack: handleGoBack,
            onGoForward: handleGoForward,
          }}
          sidebar={
            <AppSidebar
              activePage={activePage}
              onNavigate={handleNavigate}
              unappliedCount={unappliedCount}
            />
          }
        >
          <AppHeader
            eyebrow={activePageMetadata.eyebrow}
            title={activePageMetadata.title}
            description={headerDescriptionOverride ?? activePageMetadata.description}
            jobHeader={activePageMetadata.jobHeader}
          />

          {activePageContent}
        </WindowFrame>
      </div>
    </>
  );
}

export default App;
