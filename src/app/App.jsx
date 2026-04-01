import { useState } from "react";
import WindowFrame from "../components/layout/WindowFrame.jsx";
import AppHeader from "../components/layout/AppHeader.jsx";
import AppSidebar from "../components/layout/AppSidebar.jsx";
import DashboardPage from "../features/dashboard/pages/DashboardPage.jsx";
import SettingsPage from "../features/settings/pages/SettingsPage.jsx";
import { useSettings } from "../features/settings/hooks/useSettings.js";

function App() {
  const { settings, updateSetting, resetSettings } = useSettings();
  const [activePage, setActivePage] = useState("dashboard");

  function handleQuickAction(actionId) {
    if (actionId === "settings") {
      setActivePage("settings");
    }
  }

  function renderActivePage() {
    if (activePage === "settings") {
      return (
        <SettingsPage
          settings={settings}
          updateSetting={updateSetting}
          resetSettings={resetSettings}
        />
      );
    }

    return <DashboardPage settings={settings} onAction={handleQuickAction} />;
  }

  return (
    <WindowFrame
      sidebar={
        <AppSidebar activePage={activePage} onNavigate={setActivePage} />
      }
    >
      <AppHeader />
      {renderActivePage()}
    </WindowFrame>
  );
}

export default App;