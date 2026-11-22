/* eslint-disable react/prop-types */
// Text-only wordmark: "Adda" in white, "baz" in the brand gradient
export default function Logo({ className = "" }) {
  return (
    <span className={`inline-flex select-none items-baseline text-2xl font-extrabold tracking-tight ${className}`}>
      Adda<span className="text-gradient">baz</span>
    </span>
  );
}
