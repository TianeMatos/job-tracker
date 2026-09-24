import { cn } from "cn";
import Link from "next/link";

interface LogoProps {
  sizeText?: string
  size?: number
  showText?: boolean
  className?: string
}

export default function LogoMark({
  sizeText = "text-2xl",
  showText = false,
  className,
  size = 75
}: LogoProps) {

  return (
    <Link href="/">
      <div className={cn("flex items-center gap-3", className)}>
        <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
          <defs>
            <linearGradient x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E0BC6E" />
              <stop offset="50%" stopColor="#C99A3D" />
              <stop offset="100%" stopColor="#A87D2A" />
            </linearGradient>
          </defs>
          <rect x="10" y="10" width="180" height="180" rx="44" fill="#C99A3D" />
          {/* Cards empilhados */}
          <rect x="46" y="118" width="108" height="26" rx="7" fill="#0F172A" opacity="0.35" />
          <rect x="42" y="92"  width="116" height="28" rx="8" fill="#0F172A" opacity="0.65" />
          <rect x="38" y="62"  width="124" height="34" rx="9" fill="#0F172A" />
          {/* Detalhes do card topo */}
          <circle cx="56" cy="79" r="6" fill="#C99A3D" />
          <rect x="70" y="74" width="42" height="4" rx="2" fill="#C99A3D" opacity="0.9" />
          <rect x="70" y="82" width="28" height="3" rx="1.5" fill="#C99A3D" opacity="0.55" />
          {/* Check */}
          <circle cx="148" cy="79" r="9" fill="#C99A3D" />
          <path
            d="M144 79 L147 82 L153 75"
            stroke="#0F172A" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round" fill="none"
          />
        </svg>
        {showText && (
          <span className={cn("font-semibold tracking-wider font-serif", sizeText)}>
            Job<span className="text-brand-gold">Tracker</span>
          </span>
        )}
      </div>
    </Link>
  );
}
