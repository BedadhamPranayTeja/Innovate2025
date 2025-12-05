import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, ChevronRight, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JudgeAssignment } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface AssignmentQueueProps {
  assignments: JudgeAssignment[];
}

export function AssignmentQueue({ assignments }: AssignmentQueueProps) {
  const pending = assignments.filter((a) => a.status === "pending");
  const completed = assignments.filter((a) => a.status === "completed");

  return (
    <div className="space-y-6">
      {/* Pending */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4 text-warning" />
            Pending Review
          </h3>
          <Badge variant="outline">{pending.length}</Badge>
        </div>
        {pending.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
              No pending assignments
            </CardContent>
          </Card>
        ) : (
          pending.map((assignment, index) => (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <AssignmentCard assignment={assignment} />
            </motion.div>
          ))
        )}
      </div>

      {/* Completed */}
      {completed.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              Completed
            </h3>
            <Badge variant="outline">{completed.length}</Badge>
          </div>
          {completed.map((assignment, index) => (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <AssignmentCard assignment={assignment} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function AssignmentCard({ assignment }: { assignment: JudgeAssignment }) {
  const isCompleted = assignment.status === "completed";

  return (
    <Card
      className={cn(
        "transition-all duration-200",
        isCompleted ? "opacity-60" : "hover:border-primary/50"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate">
              {assignment.submission.title}
            </h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <span>{assignment.submission.team.name}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Due {formatDistanceToNow(new Date(assignment.dueAt), { addSuffix: true })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isCompleted ? (
              <Badge className="bg-success/10 text-success">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Scored
              </Badge>
            ) : (
              <Button size="sm" asChild>
                <Link to={`/judge/score/${assignment.id}`}>
                  Review
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
