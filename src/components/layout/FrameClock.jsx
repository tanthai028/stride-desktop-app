import { Sun, Moon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Calendar from "../ui/Calendar.jsx";
import useHeaderClock from "./useHeaderClock.js";

function FrameClock() {
  const { time, fullDate, isDay } = useHeaderClock();
  const [calOpen, setCalOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    function handlePointerDown(e) {
      if (!wrapRef.current?.contains(e.target)) setCalOpen(false);
    }
    function handleEscape(e) {
      if (e.key === "Escape") setCalOpen(false);
    }
    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="frame-clock-wrap" ref={wrapRef}>
      <button
        type="button"
        className="frame-clock no-drag"
        onClick={() => setCalOpen((v) => !v)}
        aria-label="Open calendar"
        aria-expanded={calOpen}
      >
        {isDay ? (
          <Sun className="frame-clock-icon frame-clock-icon--day" />
        ) : (
          <Moon className="frame-clock-icon frame-clock-icon--night" />
        )}
        <span className="frame-clock-time">{time}</span>
        <span className="frame-clock-divider" aria-hidden="true" />
        <span className="frame-clock-date">{fullDate}</span>
      </button>

      {calOpen && (
        <div className="cal-popover cal-popover--clock">
          <Calendar />
        </div>
      )}
    </div>
  );
}

export default FrameClock;
