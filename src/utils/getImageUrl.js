import { SERVER_BASE_URL } from "../api";
import DefaultAvatar from "../assets/images/avatars/avatar_1.png";

// Images are either full URLs (Cloudinary uploads) or paths on the API server
// (the demo data, e.g. "uploads/avatar/akash.png").
export const getImageUrl = (path, fallback = DefaultAvatar) => {
  if (!path) return fallback;
  if (/^https?:\/\//.test(path)) return path;
  return `${SERVER_BASE_URL}/${path.replace(/^\//, "")}`;
};
