/* eslint-disable react/prop-types */
import DefaultAvatar from "../../assets/images/avatars/avatar_1.png";
import { getImageUrl } from "../../utils/getImageUrl";

// Profile picture that falls back to the default avatar if the image is
// missing or fails to load.
export default function Avatar({ src, alt = "avatar", className = "" }) {
  return (
    <img
      className={`rounded-full object-cover ${className}`}
      src={getImageUrl(src)}
      alt={alt}
      onError={(e) => {
        if (e.currentTarget.src !== DefaultAvatar) {
          e.currentTarget.src = DefaultAvatar;
        }
      }}
    />
  );
}
