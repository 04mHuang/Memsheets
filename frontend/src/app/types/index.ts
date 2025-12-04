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
  name: string;
}