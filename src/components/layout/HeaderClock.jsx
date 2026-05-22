import { Sun, Moon } from "lucide-react";
import useHeaderClock from "./useHeaderClock.js";

function HeaderClock() {
  const { time, fullDate, isDay } = useHeaderClock();

  return (
    <div className="header-clock-card surface-card">
      <div className="header-clock-content">
        <div className="header-clock-icon-wrap">
          {isDay ? (
            <Sun className="header-clock-icon header-clock-icon--day" />
          ) : (
            <Moon className="header-clock-icon header-clock-icon--night" />
          )}
        </div>

        <div className="header-clock-text">
          <p className="header-clock-time">{time}</p>
          <p className="header-clock-date">{fullDate}</p>
        </div>
      </div>
    </div>
  );
}

export default HeaderClock;
