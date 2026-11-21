/* eslint-disable react/prop-types */
export default function Logo({ className = "", showText = true }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <img src="/favicon.svg" alt="" className="h-9 w-9 rounded-xl shadow-glow" />
      {showText && (
        <span className="text-xl font-extrabold tracking-tight">
          Face<span className="text-gradient">Hook</span>
        </span>
      )}
    </span>
  );
}
