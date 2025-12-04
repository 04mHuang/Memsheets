// "use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/app/axiosInstance";
import { FaPlus } from "react-icons/fa";

import { Event } from "@/app/types/index";
import EventsModal from "@/app/components/EventsModal";

interface EventsSectionProps {
  sheet_id?: string;
}

const EventsSection = ({ sheet_id }: EventsSectionProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  // States to control modal visibility
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (sheet_id) {
      axiosInstance.get(`/events/${sheet_id}`)
        .then(res => {
          setEvents(res.data.events);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [sheet_id]);
  

  return (
    <section className="basis-1/4 h-[calc(100vh-10rem)] shrink-0">
      <EventsModal isOpen={modalOpen} onClose={() => setModalOpen(false)} sheet_id={sheet_id} setEvents={setEvents} />
      <div className="flex">
        <button
          onClick={() => setModalOpen(true)}
          className="ml-auto bg-support h-10 w-10 rounded-4xl p-2 text-foreground hover:cursor-pointer hover:bg-dark-support hover:text-background"
        >
          <FaPlus className="w-full h-full " />
        </button>
      </div>
      <div className="events">
        <h2 className="sheet-name">Events</h2>
        {events.length === 0 ?
          <p>No events found.</p>
          :
          <ol>
            {events.map((event) => (
              <li key={event.id} className="event-item">
                <h3 className="event-title">{event.name}</h3>
              </li>
            ))}
          </ol>
        }
      </div>
    </section>
  );
}

export default EventsSection;