import { useEffect, useMemo, useState } from "react";

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

  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: CLOCK_TIME_ZONE,
      hour: "numeric",
      hour12: false,
    }).format(date),
  );

  return {
    time,
    fullDate,
    isDay: hour >= 6 && hour < 18,
  };
}

function useHeaderClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  return useMemo(() => formatClockParts(now), [now]);
}

export default useHeaderClock;
