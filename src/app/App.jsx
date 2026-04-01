import { useEffect, useState } from "react";
import WindowFrame from "../components/layout/WindowFrame.jsx";
import AppHeader from "../components/layout/AppHeader.jsx";
import AppSidebar from "../components/layout/AppSidebar.jsx";
import { useSettings } from "../features/settings/hooks/useSettings.js";
import { APP_PAGES, getPageComponent } from "./config/pageRegistry";

function App() {
  const { settings, updateSetting, resetSettings } = useSettings();
  const [activePage, setActivePage] = useState(APP_PAGES.dashboard);

  useEffect(() => {
    document.body.classList.toggle("theme-dark", settings.darkMode);
  }, [settings.darkMode]);

  function handleQuickAction(actionId) {
    if (actionId === "settings") {
      setActivePage(APP_PAGES.settings);
      return;
    }

    if (actionId === "view-stats") {
      setActivePage(APP_PAGES.library);
    }
  }

  const activePageContent = getPageComponent(activePage, {
    settings,
    updateSetting,
    resetSettings,
    onAction: handleQuickAction,
  });

  return (
    <WindowFrame
      sidebar={
        <AppSidebar activePage={activePage} onNavigate={setActivePage} />
      }
    >
      <AppHeader />
      {activePageContent}
    </WindowFrame>
  );
}

export default App;
