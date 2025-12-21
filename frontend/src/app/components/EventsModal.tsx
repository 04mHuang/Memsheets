"use client";

import { useState } from "react";
import ModalBase from "@/app/components/ModalBase";
import { CustomModalProps, Event } from "@/app/types/index";
import axiosInstance from "@/app/axiosInstance";

interface EventModalProps extends CustomModalProps {
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  sheet_id?: string;
  refetchEvents: () => void;
}

const EventsModal = ({ isOpen, onClose, sheet_id, refetchEvents }: EventModalProps) => {
  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    reminder: "None",
    date: new Date().toISOString().slice(0, 10)
  });

  const createEvent = async () => {
    try {
      const res = await axiosInstance.post(`/events/${sheet_id}/create`, eventData);
      if (res.data?.message) {
        refetchEvents();
        setEventData({ name: "", description: "", reminder: "None", date: new Date().toISOString().slice(0, 10) });
        onClose();
      }
    }
    catch (error) {
      console.error(error);
    }
  }
  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title={`Create New Event`} >
      <form id="event-form" onSubmit={(e) => { e.preventDefault(); createEvent(); }} className="space-y-4 text-left">
        <div>
          <label className="block text-sm font-medium mb-1 text-left">Event Name</label>
          <input
            type="text"
            value={eventData.name}
            onChange={(e) => setEventData(prev => ({ ...prev, name: e.target.value }))}
            className="sheet-input"
            placeholder="Untitled Event"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-left">Description</label>
          <textarea
            value={eventData.description}
            onChange={(e) => setEventData(prev => ({ ...prev, description: e.target.value }))}
            className="sheet-input"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-left">Date</label>
          <input
            type="date"
            value={eventData.date}
            onChange={(e) => setEventData(prev => ({ ...prev, date: e.target.value }))}
            className="sheet-input"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-left">Reminder</label>
          <select
            value={eventData.reminder}
            onChange={(e) => setEventData(prev => ({ ...prev, reminder: e.target.value }))}
            className="sheet-input"
          >
            <option value="None">None</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>
      </form>
      <div className="mt-8 mx-5 flex justify-between">
        <button
          onClick={onClose}
          className="border-light-foreground border-1 px-4 py-2 rounded-sm cursor-pointer hover:bg-foreground/[0.1] hover-animation"
        >
          Cancel
        </button>
        <button
          type="submit"
          form="event-form"
          className="text-foreground border border-dark-support bg-support px-4 py-2 rounded-sm cursor-pointer hover:bg-dark-support hover:text-background hover:border-support hover-animation"
        >
          Save
        </button>
      </div>
    </ModalBase>
  );
}
export default EventsModal;