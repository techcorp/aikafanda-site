"use client";

import React, { useState } from "react";

const SLOTS = [
  { time: "10:00", disabled: false },
  { time: "10:30", disabled: false },
  { time: "11:00", disabled: true },
  { time: "11:30", disabled: false },
  { time: "14:00", disabled: true },
  { time: "14:30", disabled: false },
  { time: "15:00", disabled: false },
  { time: "15:30", disabled: false },
  { time: "16:00", disabled: false },
];

interface CalendarSlotsProps {
  onSelectSlot: (slotText: string) => void;
}

export default function CalendarSlots({ onSelectSlot }: CalendarSlotsProps) {
  const [selected, setSelected] = useState("");

  const handleSelect = (time: string) => {
    setSelected(time);
    onSelectSlot(`Thu 23 May · ${time} PKT`);
  };

  return (
    <div className="glass calendar-mock">
      <div className="cal-head">
        <h4>Book a 15-min slot</h4>
        <span>Thu · 23 May</span>
      </div>
      <div className="cal-slots" id="cal-slots">
        {SLOTS.map((s) => {
          const isSelected = selected === s.time;
          return (
            <button
              key={s.time}
              type="button"
              className={`cal-slot ${s.disabled ? "disabled" : ""}`}
              disabled={s.disabled}
              onClick={() => handleSelect(s.time)}
              style={
                isSelected
                  ? {
                      background: "rgba(139, 92, 246, 0.15)",
                      borderColor: "var(--primary)",
                      color: "var(--accent)",
                    }
                  : {}
              }
            >
              {s.time}
            </button>
          );
        })}
      </div>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--fg-dim)", marginTop: "4px" }}>
        All times PKT (GMT+5)
      </span>
    </div>
  );
}
