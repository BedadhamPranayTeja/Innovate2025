import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TeamCard, CreateTeamDialog, JoinTeamDialog } from "@/components/team";
import { EmptyState } from "@/components/shared";
import { useTeamStore } from "@/stores/teamStore";
import { useAuthStore } from "@/stores/authStore";
import { Team } from "@/types";

export default function TeamList() {
  const { allTeams, myTeam } = useTeamStore();
  const { user } = useAuthStore();
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");

  const filteredTeams = allTeams.filter(
    (team) =>
      team.name.toLowerCase().includes(search.toLowerCase()) ||
      team.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
  );

  const handleJoinTeam = (team: Team) => {
    setJoinCode(team.inviteCode);
    setJoinOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Teams</h1>
          <p className="text-muted-foreground">
            {myTeam ? "Manage your team or browse others" : "Find or create a team"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setJoinOpen(true)}>
            <Ticket className="w-4 h-4 mr-2" />
            Join with Code
          </Button>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Team
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search teams or tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Team Grid */}
      {filteredTeams.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No teams found"
          description={
            search
              ? "Try a different search term"
              : "Be the first to create a team!"
          }
          action={
            !search && (
              <Button onClick={() => setCreateOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Team
              </Button>
            )
          }
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeams.map((team, index) => (
            <TeamCard
              key={team.id}
              team={team}
              index={index}
              onJoin={handleJoinTeam}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <CreateTeamDialog open={createOpen} onOpenChange={setCreateOpen} />
      <JoinTeamDialog
        open={joinOpen}
        onOpenChange={setJoinOpen}
        prefillCode={joinCode}
      />
    </div>
  );
}
