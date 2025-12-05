import { Phase, Role } from "@/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PhaseBadgeProps {
  phase: Phase;
  className?: string;
  showPulse?: boolean;
}

const phaseConfig = {
  [Phase.PRE]: {
    label: "Registration",
    className: "bg-phase-pre text-phase-pre-foreground",
    glowClass: "glow-phase-pre",
  },
  [Phase.LIVE]: {
    label: "Live",
    className: "bg-phase-live text-phase-live-foreground",
    glowClass: "glow-phase-live",
  },
  [Phase.POST]: {
    label: "Concluded",
    className: "bg-phase-post text-phase-post-foreground",
    glowClass: "glow-phase-post",
  },
};

export function PhaseBadge({ phase, className, showPulse = true }: PhaseBadgeProps) {
  const config = phaseConfig[phase];
  
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold",
        config.className,
        showPulse && phase === Phase.LIVE && "animate-pulse-phase",
        className
      )}
    >
      {phase === Phase.LIVE && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
        </span>
      )}
      {config.label}
    </motion.div>
  );
}

interface RoleBadgeProps {
  role: Role;
  className?: string;
}

const roleConfig = {
  [Role.STUDENT]: {
    label: "Student",
    className: "bg-role-student text-role-student-foreground",
  },
  [Role.JUDGE]: {
    label: "Judge",
    className: "bg-role-judge text-role-judge-foreground",
  },
  [Role.ADMIN]: {
    label: "Admin",
    className: "bg-role-admin text-role-admin-foreground",
  },
};

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const config = roleConfig[role];
  
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
