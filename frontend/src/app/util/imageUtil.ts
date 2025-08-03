// This file contains utility functions for creating alternative text (alt)

// avatarPath example: "/avatars/0_bunny.webp"
export const createAlt = (avatarPath: string) => {
  return avatarPath.slice(avatarPath.indexOf("_")+1, -5);
}