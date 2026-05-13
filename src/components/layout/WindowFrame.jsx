import { PanelsTopLeft } from "lucide-react";
import WindowControls from "../ui/WindowControls.jsx";
import { isElectron } from "../../lib/isElectron.js";
import { openApplyModeWindow } from "../../lib/windowControls.js";

function ApplyModeButton({ onClick }) {
  return (
    <button
      type="button"
      className="frame-apply-mode-button no-drag"
      onClick={onClick}
    >
      <PanelsTopLeft size={15} />
      Apply Mode
    </button>
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

function WindowFrame({ sidebar, children }) {
  return (
    <FrameShell>
      <FrameHeader>
        <div className="frame-header-spacer" />
        <ApplyModeButton onClick={openApplyModeWindow} />
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
