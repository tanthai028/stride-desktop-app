import WindowControls from "../ui/WindowControls.jsx";

function WindowFrame({ sidebar, children }) {
  return (
    <div className="app-shell">
      <div className="min-h-screen px-5 pb-5 pt-3 text-slate-700">
        <div className="drag-region flex justify-end">
          <WindowControls />
        </div>

        <div className="mx-auto mt-4 max-w-6xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[140px_1fr]">
            <div>{sidebar}</div>
            <div>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WindowFrame;
