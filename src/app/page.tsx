"use client";
import React from "react";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar"; 

type Event = { id: number; title: string; time: string; Desc?: string };

const exampleEvents: Record<string, Event[]> = {
  "2025-05-15": [
    { id: 1, title: "Project kickoff", time: "9:00 AM", Desc: "Start new project" },
    { id: 2, title: "Lunch with Sarah", time: "12:30 PM", Desc: "Discuss collaboration" },
    { id: 3, title: "Evening yoga class", time: "6:00 PM", Desc: "Relax and stretch" },
  ],
  "2025-05-02": [
    { id: 4, title: "Team meeting", time: "10:00 AM", Desc: "Weekly sync" },
    { id: 5, title: "Doctor's appointment", time: "2:00 PM", Desc: "Routine check-up" },
    { id: 6, title: "Dinner with family", time: "7:00 PM", Desc: "Family time" },
  ],

  "2025-05-27": [
    { id: 1, title: "Meeting with team", time: "10:00 AM",Desc: "Discuss project updates" },
    { id: 2, title: "Doctor Appointment", time: "3:00 PM", Desc: "Annual check-up" },
    { id: 3, title: "Dinner with friends", time: "7:30 PM", Desc: "Catch up over dinner" },
  ],
  "2025-05-28": [{ id: 4, title: "Project deadline", time: "All day", Desc: "Submit final report" }],
  "2025-05-10": [
    { id: 5, title: "Gym session", time: "6:00 AM", Desc: "Morning workout" },
    { id: 6, title: "Conference call", time: "1:00 PM", Desc: "Weekly sync with client" },
    { id: 6, title: "Conference call", time: "1:00 PM", Desc: "Weekly sync with client" },
  ],
  "2025-05-30": [
    { id: 7, title: "Lunch with client", time: "12:00 PM", Desc: "Discuss project requirements" },
    { id: 8, title: "Evening walk", time: "5:30 PM", Desc: "Relax and unwind" },
    { id: 9, title: "Movie night", time: "8:00 PM", Desc: "Watch the latest release" },
  ],
  "2025-05-31": [
    { id: 10, title: "Weekend getaway", time: "All day", Desc: "Trip to the mountains" },
    { id: 11, title: "Grocery shopping", time: "2:00 PM", Desc: "Buy weekly groceries" },
    { id: 12, title: "Family dinner", time: "6:00 PM", Desc: "Dinner with family" },
  ],

};

function formatDate(date: Date | undefined): string {
  if (!date) return "";
  return date.toISOString().split("T")[0]; 
}

function getTimePeriod(time: string): "Morning" | "Afternoon" | "Evening" | "Other" {
  if (time.toLowerCase() === "all day") return "Other";

  const hourMatch = time.match(/(\d+):\d+\s*(AM|PM)/i);
  if (!hourMatch) return "Other";

  let hour = parseInt(hourMatch[1], 10);
  const meridian = hourMatch[2].toUpperCase();

  if (meridian === "PM" && hour !== 12) hour += 12;
  if (meridian === "AM" && hour === 12) hour = 0;

  if (hour >= 6 && hour < 12) return "Morning";
  if (hour >= 12 && hour < 18) return "Afternoon";
  if (hour >= 18 && hour < 24) return "Evening";
  return "Other";
}

export default function CalendarWithTimeFilter() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  

  const [timeFilters, setTimeFilters] = useState({
    Morning: true,
    Afternoon: true,
    Evening: true,
  });

  function toggleTimeFilter(period: keyof typeof timeFilters) {
    setTimeFilters((prev) => ({ ...prev, [period]: !prev[period] }));
  }

  const allEventsForDate = selectedDate
    ? exampleEvents[formatDate(selectedDate)] || []
    : [];

  const filteredEvents =
    Object.values(timeFilters).some((v) => v) 
      ? allEventsForDate.filter((ev) => {
          const period = getTimePeriod(ev.time);
          if (period === "Other") return false;
          return timeFilters[period];
        })
      : allEventsForDate;

return (
  <div className="min-h-screen bg-gray-50 p-6 flex flex-col space-y-6">
    {/* Top row with sidebar + calendar */}
    <div className="flex space-x-6">
      {/* Sidebar - left fixed width */}
      <aside className="w-72 bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Filter by Time</h2>
        {Object.entries(timeFilters).map(([period, value]) => (
          <label
            key={period}
            className="inline-flex items-center space-x-2 cursor-pointer mb-3"
          >
            <input
              type="checkbox"
              checked={value}
              onChange={() => toggleTimeFilter(period as keyof typeof timeFilters)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span>{period}</span>
          </label>
        ))}
      </aside>

      {/* Calendar - center, flex-grow to fill remaining space */}
      <section className="flex-grow bg-white p-6 rounded shadow">
        <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} />
      </section>
    </div>

    {/* Event list below full width */}
    <section className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">
        {selectedDate
          ? `Events on ${selectedDate.toDateString()}`
          : "Select a date to see events"}
      </h2>

      {!selectedDate ? (
        <p className="text-gray-500">No date selected.</p>
      ) : filteredEvents.length === 0 ? (
        <p className="text-gray-500">No events for this date and time filter.</p>
      ) : (
        <ul className="space-y-3">
          {filteredEvents.map((event) => (
            <li
              key={event.id}
              className="p-3 bg-gray-100 rounded shadow-sm hover:bg-gray-200"
            >
              <p className="font-semibold">{event.title}</p>
              <p className="text-sm text-gray-600">{event.time}</p>
              <p className="text-sm text-gray-600">{event.Desc}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  </div>
);


}
