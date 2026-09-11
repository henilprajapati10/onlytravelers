type Tone = "dark" | "light";

export function LogoMark({
  className = "",
  size = 40,
  tone = "dark",
}: {
  className?: string;
  size?: number;
  tone?: Tone;
}) {
  const bird = tone === "light" ? "#ffffff" : "#0f2440";
  const eye = tone === "light" ? "#0b1b30" : "#fbf8f3";
  return (
    <svg
      viewBox="0 0 100 70"
      width={size}
      height={size * 0.7}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M40 4 C44 20 52 34 66 40 C74 43.5 80 44.5 90 45"
        stroke={bird}
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d="M6 58 C22 54 34 50 46 42 C54.5 36.5 60 32 66 26"
        stroke={bird}
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path d="M18 62 C30 56 40 51 48 45" stroke={bird} strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="78" cy="34" r="7.5" fill={bird} />
      <circle cx="81" cy="32" r="0.9" fill={eye} />
      <path d="M85 34.5 L98 32.5 L85 30.5 Z" fill="#e8492a" />
    </svg>
  );
}

export default function Logo({
  className = "",
  iconOnly = false,
  size = 36,
  tone = "dark",
}: {
  className?: string;
  iconOnly?: boolean;
  size?: number;
  tone?: Tone;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark size={size} tone={tone} />
      {!iconOnly && (
        <span className="font-display text-xl font-semibold leading-none tracking-tight lowercase">
          <span className={tone === "light" ? "text-white" : "text-navy-700"}>only</span>
          <span className={tone === "light" ? "text-coral-400" : "text-coral-500"}>travelers</span>
        </span>
      )}
    </span>
  );
}
