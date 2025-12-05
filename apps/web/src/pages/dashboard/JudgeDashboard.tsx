import { motion } from "framer-motion";
import { 
  Gavel, 
  CheckCircle2, 
  Clock, 
  BarChart3,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "@/stores/authStore";
import { useJudgeStore } from "@/stores/judgeStore";
import { PhaseBadge } from "@/components/shared";
import { usePhaseStore } from "@/stores/phaseStore";

export default function JudgeDashboard() {
  const { user } = useAuthStore();
  const { currentPhase } = usePhaseStore();
  const { assignments } = useJudgeStore();

  const pendingCount = assignments.filter((a) => a.status === "pending").length;
  const completedCount = assignments.filter((a) => a.status === "completed").length;
  const totalAssignments = assignments.length;
  const progress = totalAssignments > 0 ? (completedCount / totalAssignments) * 100 : 0;

  const stats = [
    { label: "Pending", value: pendingCount, icon: Clock, color: "text-warning" },
    { label: "Completed", value: completedCount, icon: CheckCircle2, color: "text-success" },
    { label: "Total", value: totalAssignments, icon: Gavel, color: "text-primary" },
  ];

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
            Judge Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.name}. You have {pendingCount} submissions to review.
          </p>
        </div>
        <PhaseBadge phase={currentPhase} showPulse />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center`}>
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
                <BarChart3 className="w-5 h-5 text-primary" />
                Scoring Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Assignments completed</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
              <p className="text-sm text-muted-foreground">
                {completedCount} of {totalAssignments} submissions scored
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-between" size="lg">
                <Link to="/judge/queue">
                  <span className="flex items-center gap-2">
                    <Gavel className="w-5 h-5" />
                    Start Scoring
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-between" size="lg">
                <Link to="/leaderboard">
                  <span className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    View Leaderboard
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Pending Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingCount > 0 ? (
              <div className="space-y-3">
                {assignments
                  .filter((a) => a.status === "pending")
                  .slice(0, 3)
                  .map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-medium">{assignment.submission.title}</p>
                        <p className="text-sm text-muted-foreground">
                          by {assignment.submission.team.name}
                        </p>
                      </div>
                      <Button asChild size="sm">
                        <Link to={`/judge/score/${assignment.submissionId}`}>
                          Score
                        </Link>
                      </Button>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3" />
                <p className="text-muted-foreground">All caught up! No pending assignments.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
