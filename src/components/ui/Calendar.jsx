import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toYMD(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseYMD(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function buildCells(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrev = new Date(prevYear, prevMonth + 1, 0).getDate();
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  const cells = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ date: new Date(prevYear, prevMonth, daysInPrev - i), current: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), current: true });
  }
  let nd = 1;
  while (cells.length < 42) {
    cells.push({ date: new Date(nextYear, nextMonth, nd++), current: false });
  }

  return cells;
}

function Calendar({ value, onChange }) {
  const todayYMD = toYMD(new Date());
  const today = new Date();
  const seed = value ? parseYMD(value) : new Date();

  const [viewYear, setViewYear] = useState(seed.getFullYear());
  const [viewMonth, setViewMonth] = useState(seed.getMonth());
  const [view, setView] = useState("days");

  const cells = useMemo(() => buildCells(viewYear, viewMonth), [viewYear, viewMonth]);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  }

  function selectMonth(i) {
    setViewMonth(i);
    setView("days");
  }

  if (view === "months") {
    return (
      <div className="cal">
        <div className="cal-header">
          <button
            type="button"
            className="cal-nav-btn"
            onClick={() => setViewYear((y) => y - 1)}
            aria-label="Previous year"
          >
            <ChevronLeft size={13} strokeWidth={2.5} />
          </button>

          <button
            type="button"
            className="cal-month-label"
            onClick={() => setView("days")}
            aria-label="Back to day view"
          >
            {viewYear}
          </button>

          <button
            type="button"
            className="cal-nav-btn"
            onClick={() => setViewYear((y) => y + 1)}
            aria-label="Next year"
          >
            <ChevronRight size={13} strokeWidth={2.5} />
          </button>
        </div>

        <div className="cal-month-grid">
          {MONTHS.map((name, i) => {
            const isSelected = i === viewMonth;
            const isThisMonth = i === today.getMonth() && viewYear === today.getFullYear();
            const cls = [
              "cal-month-cell",
              isSelected && "is-selected",
              isThisMonth && "is-today",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <button
                key={i}
                type="button"
                className={cls}
                onClick={() => selectMonth(i)}
                aria-label={`${name} ${viewYear}`}
                aria-selected={isSelected}
                aria-current={isThisMonth ? "date" : undefined}
              >
                {name.slice(0, 3)}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="cal">
      <div className="cal-header">
        <button type="button" className="cal-nav-btn" onClick={prevMonth} aria-label="Previous month">
          <ChevronLeft size={13} strokeWidth={2.5} />
        </button>

        <button
          type="button"
          className="cal-month-label"
          onClick={() => setView("months")}
          aria-label="Pick month and year"
        >
          {MONTHS[viewMonth]} {viewYear}
        </button>

        <button type="button" className="cal-nav-btn" onClick={nextMonth} aria-label="Next month">
          <ChevronRight size={13} strokeWidth={2.5} />
        </button>
      </div>

      <div className="cal-grid">
        {WEEKDAYS.map((d) => (
          <span key={d} className="cal-weekday">{d}</span>
        ))}

        {cells.map(({ date, current }, i) => {
          const ymd = toYMD(date);
          const isToday = ymd === todayYMD;
          const isSelected = value === ymd;

          const cls = [
            "cal-day",
            isToday && "is-today",
            isSelected && "is-selected",
            !current && "is-other-month",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={i}
              type="button"
              className={cls}
              onClick={() => onChange?.(ymd)}
              aria-label={date.toLocaleDateString("en-US", {
                month: "long", day: "numeric", year: "numeric",
              })}
              aria-selected={isSelected}
              aria-current={isToday ? "date" : undefined}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;
export { toYMD, parseYMD };
