// This file contains interfaces used across multiple files

// Used for sheets and groups after fetching their data
export interface GSInterface {
  id: number;
  name: string;
  color: string;
}
export interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export interface SelectOption {
  value: string;
  label: string;
  color: string;
}
export interface Event {
  id: string;
  summary: string;
  description: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end?: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  recurrence?: string[];
  sheet_id?: string;
  group_id?: string;
  sheet_name?: string;
  color?: string;
}