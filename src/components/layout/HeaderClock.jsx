import { Sun, Moon } from "lucide-react";
import useHeaderClock from "./useHeaderClock.js";

function HeaderClock() {
  const { time, fullDate, isDay } = useHeaderClock();

  return (
    <div className="header-clock-card surface-card shrink-0 rounded-[24px] px-5 py-4 text-right backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <div className="header-clock-icon-wrap flex h-12 w-12 items-center justify-center rounded-full">
          {isDay ? (
            <Sun className="h-7 w-7 text-amber-400" />
          ) : (
            <Moon className="h-7 w-7 text-indigo-300" />
          )}
        </div>

        <div className="text-right">
          <p className="header-clock-time text-[1.65rem] font-semibold leading-none">
            {time}
          </p>

          <p className="header-clock-date mt-2 text-sm font-medium">
            {fullDate}
          </p>
        </div>
      </div>
    </div>
  );
}

export default HeaderClock;
