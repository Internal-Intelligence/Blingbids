import { cn } from "@/lib/utils";
import type { TrustBadge } from "@/lib/types";

const BADGE_CONFIG: Record<TrustBadge, { label: string; icon: string; className: string }> = {
  "bling-verified": {
    label: "Bling Verified",
    icon: "✦",
    className: "border-bling-neon/50 bg-bling-neon/10 text-bling-neon",
  },
  "gia-certified": {
    label: "GIA Certified",
    icon: "💎",
    className: "border-blue-400/50 bg-blue-400/10 text-blue-300",
  },
  "brinks-insured": {
    label: "Brink's Insured",
    icon: "🛡️",
    className: "border-emerald-400/50 bg-emerald-400/10 text-emerald-300",
  },
  "money-back": {
    label: "7-Day Money Back",
    icon: "↩️",
    className: "border-purple-400/50 bg-purple-400/10 text-purple-300",
  },
};

interface TrustBadgePillProps {
  badge: TrustBadge;
  className?: string;
}

export function TrustBadgePill({ badge, className }: TrustBadgePillProps) {
  const config = BADGE_CONFIG[badge];
  return (
    <span
      className={cn(
        "trust-badge animate-sparkle",
        config.className,
        className
      )}
    >
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
}

export function TrustBadgeRow({ badges }: { badges: TrustBadge[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => (
        <TrustBadgePill key={badge} badge={badge} />
      ))}
    </div>
  );
}