"use client";

import { useState } from "react";
import ModalBase from "@/app/components/ModalBase";
import { CustomModalProps, Event } from "@/app/types/index";
import axiosInstance from "@/app/axiosInstance";

interface EventModalProps extends CustomModalProps {
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  sheet_id?: string;
}

const EventsModal = ({ isOpen, onClose, setEvents, sheet_id }: EventModalProps) => {
  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    reminder: "none"
  });

  const createEvent = async () => {
    try {
      const res = await axiosInstance.post(`/events/${sheet_id}/create`, eventData);
      setEvents(prev => [...prev, res.data?.event]);
      setEventData({ name: "", description: "", reminder: "none" });
      onClose();
    }
    catch (error) {
      console.error(error);
    }
  }
  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title={`Create New Event`} >
      <form onSubmit={(e) => { e.preventDefault(); createEvent(); }} className="space-y-4 text-left">
        <div>
          <label className="block text-sm font-medium mb-1 text-left">Event Name</label>
          <input
            type="text"
            value={eventData.name}
            onChange={(e) => setEventData(prev => ({ ...prev, name: e.target.value }))}
            className="sheet-input"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-left">Description</label>
          <textarea
            value={eventData.description}
            onChange={(e) => setEventData(prev => ({ ...prev, description: e.target.value }))}
            className="sheet-input"
            rows={3}
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
            <option value="none">None</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
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
          onClick={createEvent}
          className="bg-accent border-accent border-1 text-background px-4 py-2 rounded-sm cursor-pointer hover:bg-red-400 hover:border-red-400 hover-animation"
        >
          Create
        </button>
      </div>
    </ModalBase>
  );
}
export default EventsModal;