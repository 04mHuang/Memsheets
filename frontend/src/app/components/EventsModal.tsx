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
  // Get user's timezone
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [eventData, setEventData] = useState({
    summary: "",
    description: "",
    recurrence: "None",
    event_date: new Date().toISOString().slice(0, 10),
    timezone: userTimezone
  });

  const handleInputChange = (field: string, value: string) => {
    setEventData(prev => ({ ...prev, [field]: value }));
  };

  const createEvent = async () => {
    try {
      const res = await axiosInstance.post(`/events/${sheet_id}/create`, eventData);
      if (res.data?.message) {
        refetchEvents();
        setEventData({ summary: "", description: "", recurrence: "None", event_date: new Date().toISOString().slice(0, 10), timezone: userTimezone });
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
            value={eventData.summary}
            onChange={(e) => handleInputChange('summary', e.target.value)}
            className="sheet-input"
            placeholder="Untitled Event"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-left">Description</label>
          <textarea
            value={eventData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="sheet-input"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-left">Date</label>
          <input
            type="date"
            value={eventData.event_date}
            onChange={(e) => handleInputChange('event_date', e.target.value)}
            className="sheet-input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-left">Timezone</label>
          <select
            value={eventData.timezone}
            onChange={(e) => handleInputChange('timezone', e.target.value)}
            className="sheet-input"
          >
            <option value={userTimezone}>{userTimezone} (Your Timezone)</option>
            <option value="UTC">UTC (Coordinated Universal Time)</option>
            <option value="America/New_York">EST/EDT (Eastern Time)</option>
            <option value="America/Chicago">CST/CDT (Central Time)</option>
            <option value="America/Denver">MST/MDT (Mountain Time)</option>
            <option value="America/Los_Angeles">PST/PDT (Pacific Time)</option>
            <option value="Europe/London">GMT/BST (London)</option>
            <option value="Europe/Paris">CET/CEST (Central Europe)</option>
            <option value="Asia/Tokyo">JST (Japan Standard Time)</option>
            <option value="Asia/Shanghai">CST (China Standard Time)</option>
            <option value="Australia/Sydney">AEST/AEDT (Sydney)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-left">Recurrence</label>
          <select
            value={eventData.recurrence}
            onChange={(e) => handleInputChange('recurrence', e.target.value)}
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