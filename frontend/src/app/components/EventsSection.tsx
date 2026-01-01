"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/app/axiosInstance";
import { FaPlus } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa6";
import { Event } from "@/app/types/index";
import EventsModal from "@/app/components/EventsModal";

// Used in individual sheets and in the homepage for upcoming events
interface EventsSectionProps {
  sheet_id?: string;
}

const EventsSection = ({ sheet_id }: EventsSectionProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const isSheetPage = !!sheet_id;

  const getUpcomingEvents = (events: Event[]): Event[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    return events.filter(event => {
      const eventDate = new Date(event.start.dateTime || event.start.date || '');
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today && eventDate <= nextWeek;
    });
  };

  const displayEvents = isSheetPage ? events : getUpcomingEvents(allEvents);
  const title = isSheetPage ? "Events" : "Upcoming Events";

  const parseRecurrence = (recurrence?: string[]) => {
    if (!recurrence || recurrence.length === 0) return null;
    const rrule = recurrence[0];
    const freqMatch = rrule.match(/FREQ=([A-Z]+)/);
    if (freqMatch) {
      const freq = freqMatch[1].toLowerCase();
      return freq.charAt(0).toUpperCase() + freq.slice(1);
    }
    return null;
  };

  const fetchEvents = () => {
    if (sheet_id) {
      axiosInstance.get(`/events/${sheet_id}`)
        .then(res => {
          setEvents(res.data.events || []);
        })
        .catch(err => {
          console.error('Events endpoint not available:', err.message);
          setEvents([]);
        });
    }
  };

  const fetchAllEvents = () => {
    const auth = localStorage.getItem("auth_method");
    const endpoint = auth === "password" ? "/events/get-events" : "/cal/get-events";

    axiosInstance.get(endpoint)
      .then(res => {
        setAllEvents(res.data || []);
      })
      .catch(err => {
        console.error('Failed to fetch all events:', err);
        setAllEvents([]);
      });
  };

  useEffect(() => {
    if (isSheetPage) {
      fetchEvents();
    } else {
      fetchAllEvents();
    }
  }, [sheet_id, isSheetPage]);


  return (
    <section className="basis-1/4 h-[calc(100vh-10rem)] shrink-0">
      <EventsModal isOpen={modalOpen} onClose={() => setModalOpen(false)} sheet_id={sheet_id} setEvents={setEvents} refetchEvents={fetchEvents} />
      {isSheetPage && (
        <div className="flex">
          <button
            onClick={() => setModalOpen(true)}
            className="ml-auto bg-support h-10 w-10 rounded-4xl p-2 text-foreground hover:cursor-pointer hover:bg-dark-support hover:text-background"
          >
            <FaPlus className="w-full h-full " />
          </button>
        </div>
      )}
      <div className="events">
        <h2 className="sheet-name">{title}</h2>
        {!displayEvents || displayEvents.length === 0 ?
          <p>No events found.</p>
          :
          <ol>
            {displayEvents.map((event, index) => (
              <li key={event?.id || index} className="event-item">
                {!isSheetPage && (
                  <>
                    <FaBookmark color={event.color} className="absolute -top-1 right-2 z-2" size={30} />
                    <FaBookmark className="absolute -top-2 right-1 z-1" size={39} />
                  </>
                )}
                <h3 className="event-title">{event?.summary}</h3>
                <i className="event-date">
                  {event?.start?.dateTime ? new Date(event.start.dateTime).toLocaleDateString() : event?.start?.date ? new Date(event.start.date).toLocaleDateString() : 'No date'}
                  {event?.recurrence && <span> ({parseRecurrence(event.recurrence)})</span>}
                </i>
                <p className="event-description">
                  {isSheetPage
                    ? event?.description
                    : (event?.description?.length > 40
                      ? event.description.substring(0, 40) + '...'
                      : event?.description)
                  }
                </p>
                {!isSheetPage && event?.sheet_name && (
                  <a href={`/groups/${event.group_id}/sheets/${event.sheet_id}`} className="text-dark-support/70 font-bold hover:text-dark-support mt-1">
                    From {event.sheet_name}
                  </a>
                )}
              </li>
            ))}
          </ol>
        }
      </div>
    </section>
  );
}

export default EventsSection;