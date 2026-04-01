import WindowControls from "../ui/WindowControls.jsx";

function WindowFrame({ children }) {
  return (
    <div className="app-shell">
      <div className="min-h-screen px-5 pb-5 pt-3 text-slate-700">
        <div className="drag-region flex h-12 items-center justify-end">
          <WindowControls />
        </div>

        {children}
      </div>
    </div>
  );
}

export default WindowFrame;