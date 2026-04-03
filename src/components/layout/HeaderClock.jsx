import { Sun, Moon } from "lucide-react";
import useHeaderClock from "./useHeaderClock.js";

function HeaderClock({ isDark }) {
  const { time, fullDate, isDay } = useHeaderClock();

  return (
    <div
      className={`surface-card shrink-0 rounded-[24px] px-5 py-4 text-right backdrop-blur-xl ${
        isDark
          ? "border-white/10 bg-white/5 text-white"
          : "border-white/40 bg-white/45 text-slate-800"
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${
            isDark ? "bg-white/10" : "bg-white/70"
          }`}
        >
          {isDay ? (
            <Sun className="h-7 w-7 text-amber-400" />
          ) : (
            <Moon className="h-7 w-7 text-indigo-300" />
          )}
        </div>

        <div className="text-right">
          <p
            className={`text-[1.65rem] font-semibold leading-none ${
              isDark ? "text-white/95" : "text-slate-800"
            }`}
          >
            {time}
          </p>

          <p
            className={`mt-2 text-sm font-medium ${
              isDark ? "text-white/60" : "text-slate-600"
            }`}
          >
            {fullDate}
          </p>
        </div>
      </div>
    </div>
  );
}

export default HeaderClock;
