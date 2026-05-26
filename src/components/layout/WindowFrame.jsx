import { ChevronLeft, ChevronRight, Moon, Sun } from "lucide-react";
import WindowControls from "../ui/WindowControls.jsx";
import FrameClock from "./FrameClock.jsx";
import { isElectron } from "../../lib/isElectron.js";

function FrameNavigation({ navigation }) {
  return (
    <div className="frame-navigation no-drag">
      <button
        type="button"
        className="frame-nav-button"
        disabled={!navigation?.canGoBack}
        onClick={navigation?.onGoBack}
        aria-label="Go back"
      >
        <ChevronLeft size={17} />
      </button>

      <button
        type="button"
        className="frame-nav-button"
        disabled={!navigation?.canGoForward}
        onClick={navigation?.onGoForward}
        aria-label="Go forward"
      >
        <ChevronRight size={17} />
      </button>
    </div>
  );
}

function FrameHeader({ children }) {
  return <div className="frame-header drag-region">{children}</div>;
}

function FrameContent({ children }) {
  return <div className="frame-content">{children}</div>;
}

function FrameGrid({ children }) {
  return <div className="frame-grid">{children}</div>;
}

function FrameSidebar({ children }) {
  return <div className="frame-sidebar">{children}</div>;
}

function FrameMain({ children }) {
  return <div className="frame-main">{children}</div>;
}

function FrameShell({ children }) {
  return (
    <div className="app-shell h-full overflow-hidden">
      <div className="frame-shell-text h-full overflow-hidden p-4">
        {children}
      </div>
    </div>
  );
}

function FrameThemeSwitch({ darkMode, onToggleTheme }) {
  return (
    <button
      type="button"
      className={`frame-theme-switch no-drag ${darkMode ? "is-dark" : "is-light"}`}
      onClick={onToggleTheme}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="frame-theme-switch-thumb" aria-hidden="true" />
      <span className="frame-theme-switch-segment frame-theme-switch-segment--moon">
        <Moon size={16} />
      </span>
      <span className="frame-theme-switch-segment frame-theme-switch-segment--sun">
        <Sun size={16} />
      </span>
    </button>
  );
}

function WindowFrame({ sidebar, children, navigation, darkMode, onToggleTheme }) {
  return (
    <FrameShell>
      <FrameHeader>
        <FrameNavigation navigation={navigation} />
        <div className="frame-header-spacer" />
        <FrameThemeSwitch darkMode={darkMode} onToggleTheme={onToggleTheme} />
        <FrameClock />
        {isElectron() && <WindowControls />}
      </FrameHeader>

      <FrameContent>
        <FrameGrid>
          <FrameSidebar>{sidebar}</FrameSidebar>
          <FrameMain>{children}</FrameMain>
        </FrameGrid>
      </FrameContent>
    </FrameShell>
  );
}

export default WindowFrame;
