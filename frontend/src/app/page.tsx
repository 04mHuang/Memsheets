"use client";

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import axiosInstance from "@/app/axiosInstance";

interface CalendarEvent {
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end?: {
    dateTime?: string;
    date?: string;
  };
}

const Home = () => {
  const [calendar, setCalendar] = useState<CalendarEvent[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("/cal/get-events")
        setCalendar(res.data)
      }
      catch (error) {
        console.error(error)
      }
    })();
  }, []);

  return (
    <div className="container max-w-screen-xl px-4">
      <main className="flex flex-col justify-items-center">
        {calendar.length > 0 && <FullCalendar
          plugins={[dayGridPlugin]}
          events={calendar.map((c: CalendarEvent) => ({
            title: c.summary,
            start: c.start.dateTime || c.start.date,
            end: c.end?.dateTime || c.end?.date,
          }))}
          eventClick={(info) => {
            const event = info.event;
            alert(`
              Title: ${event.title}
              Start: ${event.start}
              End: ${event.end}
              Description: ${event.extendedProps.description ?? "—"}
            `);
          }}
        />
        }
      </main>
    </div>
  );
}
export default Home;