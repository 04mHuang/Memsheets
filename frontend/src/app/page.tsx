"use client";

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import rrulePlugin from "@fullcalendar/rrule";
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
  recurrence?: string[];
}

const Home = () => {
  const [calendar, setCalendar] = useState<CalendarEvent[]>([]);
  useEffect(() => {
    const auth = localStorage.getItem("auth_method");
    (async () => {
      try {
        let res = null;
        if (auth == "password") {
          res = await axiosInstance.get("/events/get-events");
        }
        else {
          res = await axiosInstance.get("/cal/get-events");
        }
        setCalendar(res.data)
        console.log(res)
      }
      catch (error) {
        console.error(error)
      }
    })();    
  }, []);

  return (
    <div className="container max-w-screen-xl px-4">
      <main className="flex flex-col justify-items-center">
        <FullCalendar
          plugins={[dayGridPlugin, rrulePlugin]}
          events={calendar.map((c: CalendarEvent) => ({
            title: c.summary,
            start: c.start.dateTime || c.start.date,
            end: c.end?.dateTime || c.end?.date,
            allDay: true, // Force all-day display
            rrule: c.recurrence?.[0], // Pass RRULE string
          }))}
          eventClick={(info: any) => {
            const event = info.event;
            alert(`
              Title: ${event.title}
              Start: ${event.start}
              End: ${event.end}
              Description: ${event.extendedProps.description ?? "—"}
            `);
          }}
        />
      </main>
    </div>
  );
}
export default Home;