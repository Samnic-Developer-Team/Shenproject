"use client";

import { useMemo } from "react";

interface BookingDateSelectorProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export function BookingDateSelector({
  selectedDate,
  setSelectedDate,
}: BookingDateSelectorProps) {
  // Generate next 7 days dynamically
  const dateOptions = useMemo(() => {
    const options = [];
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      options.push({
        dayNum: d.getDate(),
        monthLabel: months[d.getMonth()],
        dateStr: d.toISOString().split("T")[0],
      });
    }
    return options;
  }, []);

  return (
    <div className="space-y-2 select-none">
      <label className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant block mb-2">
        Select Date
      </label>
      <div className="flex gap-2.5 overflow-x-auto pb-2.5 hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {dateOptions.map((opt) => {
          const isActive = selectedDate === opt.dateStr;
          return (
            <button
              key={opt.dateStr}
              onClick={() => setSelectedDate(opt.dateStr)}
              className={`flex-shrink-0 w-14 h-16 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer ${
                isActive
                  ? "bg-primary text-on-primary font-bold shadow-md shadow-primary/20 scale-102"
                  : "bg-surface-container-low text-on-surface font-semibold hover:bg-surface-container-high border border-outline-variant/5"
              }`}
            >
              <span className={`text-[10px] uppercase ${isActive ? "text-on-primary/80" : "text-on-surface-variant"}`}>
                {opt.monthLabel}
              </span>
              <span className="text-lg leading-tight mt-0.5">{opt.dayNum}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default BookingDateSelector;
