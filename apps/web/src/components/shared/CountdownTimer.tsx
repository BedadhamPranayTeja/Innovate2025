import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  targetDate: Date;
  className?: string;
  onComplete?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ targetDate, className, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setIsExpired(true);
        onComplete?.();
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  const timeUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  if (isExpired) {
    return (
      <div className={cn("text-center", className)}>
        <p className="text-2xl font-bold text-primary">Event Started!</p>
      </div>
    );
  }

  return (
    <div className={cn("flex gap-3 md:gap-4", className)}>
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex flex-col items-center"
        >
          <div className="relative">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-card border border-border flex items-center justify-center glass-card">
              <motion.span
                key={unit.value}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className="text-2xl md:text-3xl font-bold font-mono text-foreground"
              >
                {String(unit.value).padStart(2, "0")}
              </motion.span>
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary/20 rounded-full blur-sm" />
          </div>
          <span className="mt-2 text-xs md:text-sm text-muted-foreground font-medium">
            {unit.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
