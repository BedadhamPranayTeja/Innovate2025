import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, Lock, Globe, Crown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Team, TeamPrivacy } from "@/types";

interface TeamCardProps {
  team: Team;
  index?: number;
  onJoin?: (team: Team) => void;
  showActions?: boolean;
}

export function TeamCard({ team, index = 0, onJoin, showActions = true }: TeamCardProps) {
  const isPrivate = team.privacy === TeamPrivacy.PRIVATE;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Link 
                  to={`/teams/${team.id}`}
                  className="font-semibold truncate hover:text-primary transition-colors"
                >
                  {team.name}
                </Link>
                {isPrivate ? (
                  <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                ) : (
                  <Globe className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {team.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-4">
            {team.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Crown className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="sr-only">Team</span> Leader
              </span>
              <span className="font-mono bg-muted px-2 py-0.5 rounded" aria-label={`Invite code: ${team.inviteCode}`}>
                {team.inviteCode}
              </span>
            </div>
            {showActions && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" asChild>
                  <Link to={`/teams/${team.id}`}>View</Link>
                </Button>
                {!isPrivate && onJoin && (
                  <Button size="sm" onClick={() => onJoin(team)}>
                    Join
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
