import { motion } from "framer-motion";
import { 
  Users, 
  FileText, 
  CreditCard, 
  Settings,
  Play,
  Pause,
  CheckCircle,
  BarChart3,
  LayoutGrid
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePhaseStore } from "@/stores/phaseStore";
import { useTeamStore } from "@/stores/teamStore";
import { useSubmissionStore } from "@/stores/submissionStore";
import { Phase } from "@/types";
import { PhaseBadge } from "@/components/shared";
import { UserTable, TeamOverview, AnalyticsDashboard } from "@/components/admin";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { currentPhase, setPhase } = usePhaseStore();
  const { allTeams } = useTeamStore();
  const { submissions } = useSubmissionStore();

  const stats = [
    { label: "Total Teams", value: allTeams.length, icon: Users, color: "text-role-student" },
    { label: "Submissions", value: submissions.length, icon: FileText, color: "text-phase-live" },
    { label: "Registrations", value: allTeams.length * 3, icon: CreditCard, color: "text-success" },
  ];

  const handlePhaseChange = (phase: Phase) => {
    setPhase(phase);
    toast.success(`Phase changed to ${phase}`);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Admin Command Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor the hackathon from here.
          </p>
        </div>
        <PhaseBadge phase={currentPhase} showPulse />
      </motion.div>

      {/* Phase Control */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Phase Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                variant={currentPhase === Phase.PRE ? "default" : "outline"}
                onClick={() => handlePhaseChange(Phase.PRE)}
                className="flex items-center gap-2"
              >
                <Pause className="w-4 h-4" />
                PRE (Registration)
              </Button>
              <Button
                variant={currentPhase === Phase.LIVE ? "default" : "outline"}
                onClick={() => handlePhaseChange(Phase.LIVE)}
                className="flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                LIVE (Hackathon)
              </Button>
              <Button
                variant={currentPhase === Phase.POST ? "default" : "outline"}
                onClick={() => handlePhaseChange(Phase.POST)}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                POST (Results)
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabbed Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="teams" className="gap-2">
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Teams</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="users">
            <UserTable />
          </TabsContent>

          <TabsContent value="teams">
            <TeamOverview />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
