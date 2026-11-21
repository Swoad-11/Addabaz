import { SERVER_BASE_URL } from "../api";

// Images are either full URLs (Vercel Blob / Cloudinary uploads) or paths on
// the API server (the demo data, e.g. "uploads/avatar/akash.png").
// Returns `fallback` when there is no usable path.
export const getImageUrl = (path, fallback = null) => {
  if (!path || typeof path !== "string") return fallback;
  if (/^https?:\/\//.test(path)) return path;
  if (!path.startsWith("uploads/") && !path.startsWith("/uploads/")) return fallback;
  return `${SERVER_BASE_URL}/${path.replace(/^\//, "")}`;
};
