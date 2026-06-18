"use client";

interface TimeSlotSelectorProps {
  selectedTimeSlot: string;
  setSelectedTimeSlot: (slot: string) => void;
}

const TIME_SLOTS = [
  "10:30 AM",
  "12:00 PM",
  "02:30 PM",
  "04:00 PM",
];

export function TimeSlotSelector({
  selectedTimeSlot,
  setSelectedTimeSlot,
}: TimeSlotSelectorProps) {
  return (
    <div className="space-y-2 select-none">
      <label className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant block mb-2">
        Available Slots
      </label>
      <div className="grid grid-cols-2 gap-3">
        {TIME_SLOTS.map((slot) => {
          const isActive = selectedTimeSlot === slot;
          return (
            <button
              key={slot}
              onClick={() => setSelectedTimeSlot(slot)}
              className={`py-2.5 text-xs sm:text-sm rounded-xl font-bold transition-all duration-300 active:scale-[0.97] cursor-pointer text-center ${
                isActive
                  ? "border border-primary bg-primary/5 text-primary"
                  : "border border-outline-variant/20 hover:border-primary text-on-surface hover:text-primary bg-transparent"
              }`}
            >
              {slot}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TimeSlotSelector;
