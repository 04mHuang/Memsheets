export const isDarkColor = (bgColor: string): boolean => {
  // Skip the '#' and convert R, G, B to decimal
  const r = parseInt(bgColor.substring(1, 3), 16);
  const g = parseInt(bgColor.substring(3, 5), 16);
  const b = parseInt(bgColor.substring(5, 7), 16);

  // Calculate luminance (standard formula)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
  // Threshold for defining when the color is dark or not
  return luminance < 128;
}