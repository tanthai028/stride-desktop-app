import { useEffect, useState } from "react";
import { APP_NAME, APP_TAGLINE } from "../../constants/app.js";
import { Sun, Moon } from "lucide-react";

const CLOCK_TIME_ZONE = "America/New_York";

function formatClockParts(date) {
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: CLOCK_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  const fullDate = new Intl.DateTimeFormat("en-US", {
    timeZone: CLOCK_TIME_ZONE,
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);

  return { time, fullDate };
}

function AppHeader({ settings }) {
  const isDark = settings?.darkMode;
  const [clock, setClock] = useState(() => formatClockParts(new Date()));
  const hour = new Date().toLocaleString("en-US", {
    timeZone: CLOCK_TIME_ZONE,
    hour: "numeric",
    hour12: false,
  });

  const isDay = Number(hour) >= 6 && Number(hour) < 18;

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setClock(formatClockParts(new Date()));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="flex w-full items-start justify-between gap-4">
      <div
        className="relative flex-1 min-w-0 overflow-hidden rounded-[28px] border border-white/40 bg-white/45 px-6 py-5 shadow-[0_8px_30px_rgba(0,0,0,0.05)] backdrop-blur-xl"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, black 30%, rgba(0,0,0,0.9) 60%, transparent 80%)",
          maskImage:
            "linear-gradient(to right, black 30%, rgba(0,0,0,0.9) 60%, transparent 80%)",
        }}
      >
        <div className="relative z-10">
          <p className="text-sm font-medium tracking-wide text-sky-500">
            {APP_NAME}
          </p>

          <h1
            className={`text-3xl font-semibold ${
              isDark ? "text-white" : "text-slate-800"
            }`}
          >
            {APP_TAGLINE}
          </h1>
        </div>
      </div>

      <div
        className={`shrink-0 rounded-[24px] px-5 py-4 text-right shadow-[0_8px_30px_rgba(0,0,0,0.05)] backdrop-blur-xl ${
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
              {clock.time}
            </p>

            <p
              className={`mt-2 text-sm font-medium ${
                isDark ? "text-white/60" : "text-slate-600"
              }`}
            >
              {clock.fullDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppHeader;
