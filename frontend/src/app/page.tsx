"use client";

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import rrulePlugin from "@fullcalendar/rrule";
import { isDarkColor } from "@/app/util/colorUtil";
import axiosInstance from "@/app/axiosInstance";
import { Event } from "@/app/types/index";
import EventsSection from "@/app/components/EventsSection";

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
  color: string;
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
    <main className="max-w-full flex px-10 my-10 justify-center gap-6">
      <section className="flex-4 bg-amber-50 p-4">
        <FullCalendar
          plugins={[dayGridPlugin, rrulePlugin]}
          contentHeight="auto"
          timeZone="local"
          dayMaxEvents={3} // Show max 3 events, then "+more" link
          events={calendar.map((c: CalendarEvent) => ({
            title: c.summary,
            start: c.start.date || c.start.dateTime?.split('T')[0],
            allDay: true, // Force all-day display
            rrule: c.recurrence?.[0], // Pass RRULE string
            backgroundColor: c.color, // Use sheet color
            borderColor: isDarkColor(c.color) ? 'var(--background)' : 'var(--foreground)',
            textColor: isDarkColor(c.color) ? 'var(--background)' : 'var(--foreground)',
          }))}
        />
      </section>
      <EventsSection />
    </main>
  );
}
export default Home;