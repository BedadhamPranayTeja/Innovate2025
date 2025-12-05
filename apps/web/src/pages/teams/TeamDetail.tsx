import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Copy,
  Globe,
  Lock,
  Settings,
  Users,
  LogOut,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MemberList, JoinRequestCard } from "@/components/team";
import { EmptyState } from "@/components/shared";
import { useTeamStore } from "@/stores/teamStore";
import { useAuthStore } from "@/stores/authStore";
import { TeamPrivacy, MemberStatus, Role } from "@/types";
import { toast } from "sonner";

export default function TeamDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    allTeams,
    members,
    joinRequests,
    approveRequest,
    rejectRequest,
    removeMember,
    leaveTeam,
  } = useTeamStore();

  const team = allTeams.find((t) => t.id === id);

  if (!team) {
    return (
      <EmptyState
        icon={Users}
        title="Team not found"
        description="This team doesn't exist or has been deleted."
        action={
          <Button asChild>
            <Link to="/teams">Browse Teams</Link>
          </Button>
        }
      />
    );
  }

  const isLeader = team.leaderId === user?.id;
  const isPrivate = team.privacy === TeamPrivacy.PRIVATE;
  const teamMembers = members.filter((m) => m.teamId === team.id);
  const pendingRequests = joinRequests.filter(
    (r) => r.teamId === team.id && r.status === MemberStatus.PENDING
  );

  const copyInviteCode = () => {
    navigator.clipboard.writeText(team.inviteCode);
    toast.success("Invite code copied!");
  };

  const handleApprove = async (requestId: string) => {
    await approveRequest(requestId);
    toast.success("Member approved!");
  };

  const handleReject = async (requestId: string) => {
    await rejectRequest(requestId);
    toast.info("Request declined");
  };

  const handleRemoveMember = async (memberId: string) => {
    await removeMember(memberId);
    toast.success("Member removed");
  };

  const handleLeaveTeam = async () => {
    if (!user) return;
    await leaveTeam(user.id);
    toast.success("You left the team");
    navigate("/teams");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/teams")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{team.name}</h1>
            {isPrivate ? (
              <Lock className="w-4 h-4 text-muted-foreground" />
            ) : (
              <Globe className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
          <p className="text-muted-foreground">{team.description}</p>
        </div>
        {isLeader && (
          <Button variant="outline" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="members">
            <TabsList>
              <TabsTrigger value="members" className="gap-2">
                <Users className="w-4 h-4" />
                Members
              </TabsTrigger>
              {isLeader && (
                <TabsTrigger value="requests" className="gap-2">
                  Requests
                  {pendingRequests.length > 0 && (
                    <Badge variant="destructive" className="ml-1 h-5 px-1.5">
                      {pendingRequests.length}
                    </Badge>
                  )}
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="members" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Team Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <MemberList
                    members={teamMembers}
                    currentUserId={user?.id}
                    isLeader={isLeader}
                    onRemoveMember={handleRemoveMember}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {isLeader && (
              <TabsContent value="requests" className="mt-4">
                <div className="space-y-3">
                  {pendingRequests.length === 0 ? (
                    <Card>
                      <CardContent className="py-8 text-center text-muted-foreground">
                        No pending join requests
                      </CardContent>
                    </Card>
                  ) : (
                    pendingRequests.map((request) => (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <JoinRequestCard
                          request={request}
                          onApprove={handleApprove}
                          onReject={handleReject}
                        />
                      </motion.div>
                    ))
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Invite Code Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Invite Code</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-center text-2xl font-mono font-bold tracking-widest bg-muted p-3 rounded-lg">
                  {team.inviteCode}
                </code>
                <Button variant="outline" size="icon" onClick={copyInviteCode}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Share this code with teammates
              </p>
            </CardContent>
          </Card>

          {/* Team Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Team Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Privacy</span>
                <span className="capitalize">{team.privacy}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Max Members</span>
                <span>{team.maxMembers}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current</span>
                <span>
                  {teamMembers.length} / {team.maxMembers}
                </span>
              </div>
              {team.tags.length > 0 && (
                <div className="pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Tags</span>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {team.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          {!isLeader && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Leave Team
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Leave Team?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to leave {team.name}? You'll need to
                    request to rejoin.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLeaveTeam}>
                    Leave Team
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {isLeader && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Team
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Team?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. All members will be removed
                    and any submissions will be lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete Team
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
}
