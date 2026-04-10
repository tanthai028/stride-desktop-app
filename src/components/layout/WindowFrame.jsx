import WindowControls from "../ui/WindowControls.jsx";
import { isElectron } from "../../lib/isElectron.js";

function FrameHeader({ children }) {
  return (
    <div className="drag-region flex items-center justify-end">{children}</div>
  );
}

function FrameContent({ children }) {
  return (
    <div className="mx-auto mt-4 h-[calc(100%-4.75rem)] max-w-[1400px]">
      {children}
    </div>
  );
}

function FrameGrid({ children }) {
  return (
    <div className="grid h-full grid-cols-[72px_1fr] gap-4">{children}</div>
  );
}

function FrameSidebar({ children }) {
  return <div className="relative min-h-0 overflow-visible">{children}</div>;
}

function FrameMain({ children }) {
  return <div className="flex min-h-0 flex-col gap-6">{children}</div>;
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
      <FrameHeader>{isElectron() && <WindowControls />}</FrameHeader>

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
