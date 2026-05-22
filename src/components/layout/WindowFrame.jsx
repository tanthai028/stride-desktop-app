import { ChevronLeft, ChevronRight } from "lucide-react";
import WindowControls from "../ui/WindowControls.jsx";
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

function WindowFrame({ sidebar, children, navigation }) {
  return (
    <FrameShell>
      <FrameHeader>
        <FrameNavigation navigation={navigation} />
        <div className="frame-header-spacer" />
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
