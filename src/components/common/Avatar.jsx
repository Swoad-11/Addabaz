/* eslint-disable react/prop-types */
import { useState } from "react";
import { getImageUrl } from "../../utils/getImageUrl";

const GRADIENTS = [
  "from-emerald-400 to-sky-500",
  "from-violet-500 to-fuchsia-500",
  "from-amber-400 to-rose-500",
  "from-sky-400 to-indigo-500",
  "from-rose-400 to-orange-400",
  "from-teal-400 to-emerald-600",
  "from-indigo-400 to-purple-600",
  "from-lime-400 to-emerald-500",
];

const initialsOf = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "?";

// same name -> same colour every time
const gradientFor = (name = "") => {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return GRADIENTS[hash % GRADIENTS.length];
};

/**
 * Profile picture. Users without a photo (or with a broken one) get a
 * generated avatar with their initials instead of a stock photo.
 */
export default function Avatar({ src, name = "", className = "h-10 w-10", textClass = "text-sm" }) {
  const url = getImageUrl(src, null);
  const [failedUrl, setFailedUrl] = useState(null);

  if (url && failedUrl !== url) {
    return (
      <img
        className={`shrink-0 rounded-full object-cover ring-1 ring-white/10 ${className}`}
        src={url}
        alt={name || "avatar"}
        onError={() => setFailedUrl(url)}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={name || "avatar"}
      className={`flex-center shrink-0 select-none rounded-full bg-gradient-to-br font-bold text-white ring-1 ring-white/10 ${gradientFor(name)} ${className} ${textClass}`}
    >
      {initialsOf(name)}
    </span>
  );
}
