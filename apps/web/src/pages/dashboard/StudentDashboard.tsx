import { motion } from "framer-motion";
import { 
  Users, 
  FileText, 
  Trophy, 
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "@/stores/authStore";
import { usePhaseStore } from "@/stores/phaseStore";
import { useTeamStore } from "@/stores/teamStore";
import { Phase } from "@/types";
import { CountdownTimer, PhaseBadge } from "@/components/shared";

const quickActions = [
  { to: "/teams", icon: Users, label: "Find a Team", color: "bg-role-student" },
  { to: "/submissions/new", icon: FileText, label: "Submit Project", color: "bg-phase-live" },
  { to: "/leaderboard", icon: Trophy, label: "View Rankings", color: "bg-phase-post" },
];

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const { currentPhase, event } = usePhaseStore();
  const { myTeam } = useTeamStore();

  const tasks = [
    { label: "Complete Profile", done: true },
    { label: "Join or Create Team", done: !!myTeam },
    { label: "Submit Project", done: false },
    { label: "Get Scored", done: false },
  ];

  const completedTasks = tasks.filter((t) => t.done).length;
  const progress = (completedTasks / tasks.length) * 100;

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
            Welcome back, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your hackathon journey.
          </p>
        </div>
        <PhaseBadge phase={currentPhase} showPulse />
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.to}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={action.to}>
              <Card className="group hover:border-primary/50 transition-all hover:shadow-md cursor-pointer">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{action.label}</p>
                    <p className="text-sm text-muted-foreground">Click to continue</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Journey completion</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              
              <div className="space-y-3 pt-2">
                {tasks.map((task, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      task.done ? "bg-success" : "bg-muted"
                    }`}>
                      {task.done ? (
                        <CheckCircle2 className="w-3 h-3 text-success-foreground" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                      )}
                    </div>
                    <span className={task.done ? "text-foreground" : "text-muted-foreground"}>
                      {task.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Team Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-role-student" />
                Team Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {myTeam ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h3 className="font-semibold text-lg">{myTeam.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{myTeam.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {myTeam.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button asChild className="w-full">
                    <Link to={`/teams/${myTeam.id}`}>View Team Details</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium mb-1">No Team Yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Join or create a team to participate in the hackathon.
                  </p>
                  <Button asChild>
                    <Link to="/teams">Find a Team</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-warning" />
                {currentPhase === Phase.PRE
                  ? "Event Starts In"
                  : currentPhase === Phase.LIVE
                  ? "Submission Deadline"
                  : "Event Concluded"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center py-4">
                <CountdownTimer
                  targetDate={
                    currentPhase === Phase.PRE
                      ? event?.startTime || new Date()
                      : event?.submissionDeadline || new Date()
                  }
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
