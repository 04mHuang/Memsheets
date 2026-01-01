// This file contains utility functions for managing colors in the application.

// Check for background color versus text color contrast/visibility
export const isDarkColor = (bgColor: string): boolean => {
  const hex = parseInt(bgColor.slice(1), 16);
  const r = (hex >> 16) & 255;
  const g = (hex >> 8) & 255;
  const b = hex & 255;
  
  // Threshold for defining whether the color is dark or not
  return (0.299 * r + 0.587 * g + 0.114 * b) < 150;
}

// Modify hex color brightness
export const adjustColor = (hex: string, amount: number) => {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 255) + amount));
  const b = Math.max(0, Math.min(255, (num & 255) + amount));
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
};
