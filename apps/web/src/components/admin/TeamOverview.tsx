import { motion } from "framer-motion";
import { Users, Lock, Globe, Code, Trash2, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTeamStore } from "@/stores/teamStore";
import { TeamPrivacy } from "@/types";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function TeamOverview() {
  const { allTeams } = useTeamStore();
  const navigate = useNavigate();

  const publicTeams = allTeams.filter((t) => t.privacy === TeamPrivacy.PUBLIC);
  const privateTeams = allTeams.filter((t) => t.privacy === TeamPrivacy.PRIVATE);

  const tagCounts = allTeams.reduce((acc, team) => {
    team.tags.forEach((tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const handleViewTeam = (teamId: string) => {
    navigate(`/teams/${teamId}`);
  };

  const handleDeleteTeam = (teamId: string, teamName: string) => {
    toast.success(`Team "${teamName}" deleted`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Users className="w-8 h-8 mx-auto text-primary mb-2" />
              <p className="text-3xl font-bold">{allTeams.length}</p>
              <p className="text-sm text-muted-foreground">Total Teams</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Globe className="w-8 h-8 mx-auto text-success mb-2" />
              <p className="text-3xl font-bold">{publicTeams.length}</p>
              <p className="text-sm text-muted-foreground">Public</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Lock className="w-8 h-8 mx-auto text-warning mb-2" />
              <p className="text-3xl font-bold">{privateTeams.length}</p>
              <p className="text-sm text-muted-foreground">Private</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Code className="w-8 h-8 mx-auto text-phase-live mb-2" />
              <p className="text-3xl font-bold">{topTags.length}</p>
              <p className="text-sm text-muted-foreground">Tech Tags</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Popular Technologies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topTags.map(([tag, count]) => (
            <div key={tag} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{tag}</span>
                <span className="text-muted-foreground">{count} teams</span>
              </div>
              <Progress value={(count / allTeams.length) * 100} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Teams List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Teams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {allTeams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{team.name}</p>
                    {team.privacy === TeamPrivacy.PRIVATE ? (
                      <Lock className="w-3 h-3 text-muted-foreground" />
                    ) : (
                      <Globe className="w-3 h-3 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    Code: {team.inviteCode}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex gap-1">
                    {team.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleViewTeam(team.id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDeleteTeam(team.id, team.name)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
