import { Sun, Moon } from "lucide-react";
import useHeaderClock from "./useHeaderClock.js";

function HeaderClock() {
  const { time, fullDate, isDay } = useHeaderClock();
  const [timePart, ampm] = time.split(" ");

  return (
    <div className="header-clock">
      <div className="header-clock-icon-wrap">
        {isDay ? (
          <Sun className="header-clock-icon header-clock-icon--day" />
        ) : (
          <Moon className="header-clock-icon header-clock-icon--night" />
        )}
      </div>
      <div className="header-clock-text">
        <p className="header-clock-time">
          {timePart}<span className="header-clock-ampm">{ampm}</span>
        </p>
        <p className="header-clock-date">{fullDate}</p>
      </div>
    </div>
  );
}

export default HeaderClock;
