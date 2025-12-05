import { usePhaseStore } from "@/stores/phaseStore";
import { useAuthStore } from "@/stores/authStore";
import { PhaseBadge } from "@/components/shared";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Header() {
  const { currentPhase, event } = usePhaseStore();
  const { user } = useAuthStore();

  return (
    <header 
      className="sticky top-0 z-30 h-14 sm:h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      role="banner"
    >
      <div className="flex items-center justify-between h-full px-4 md:px-6 ml-12 md:ml-0">
        <div className="flex items-center gap-2 sm:gap-4">
          <h1 className="text-base sm:text-lg font-semibold text-foreground hidden sm:block">
            {event?.name || "Innovate 2025"}
          </h1>
          <PhaseBadge phase={currentPhase} />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              placeholder="Search..."
              className="w-64 pl-9 bg-muted/50"
              aria-label="Search"
            />
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative h-9 w-9 sm:h-10 sm:w-10"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-destructive rounded-full" aria-label="New notifications" />
          </Button>

          <div className="hidden md:flex items-center gap-2 pl-3 border-l border-border">
            <span className="text-sm text-muted-foreground">
              Welcome, <span className="font-medium text-foreground">{user?.name}</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
