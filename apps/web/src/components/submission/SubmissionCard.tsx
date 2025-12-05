import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  Star,
  ExternalLink,
  Github,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Submission, SubmissionStatus } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface SubmissionCardProps {
  submission: Submission;
  index?: number;
  showTeam?: boolean;
}

const statusConfig = {
  [SubmissionStatus.DRAFT]: {
    label: "Draft",
    icon: FileText,
    className: "bg-muted text-muted-foreground",
  },
  [SubmissionStatus.SUBMITTED]: {
    label: "Submitted",
    icon: CheckCircle2,
    className: "bg-success/10 text-success",
  },
  [SubmissionStatus.SCORED]: {
    label: "Scored",
    icon: Star,
    className: "bg-warning/10 text-warning",
  },
};

export function SubmissionCard({
  submission,
  index = 0,
  showTeam = true,
}: SubmissionCardProps) {
  const status = statusConfig[submission.status];
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="group hover:border-primary/50 transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <Link
                to={`/submissions/${submission.id}`}
                className="font-semibold text-lg hover:text-primary transition-colors line-clamp-1"
              >
                {submission.title}
              </Link>
              {showTeam && (
                <p className="text-sm text-muted-foreground">
                  by {submission.team.name}
                </p>
              )}
            </div>
            <Badge className={status.className}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {status.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {submission.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {submission.techStack.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
            {submission.techStack.length > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{submission.techStack.length - 4}
              </Badge>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              <time dateTime={new Date(submission.submittedAt || submission.createdAt).toISOString()}>
                {submission.submittedAt
                  ? `Submitted ${formatDistanceToNow(new Date(submission.submittedAt), { addSuffix: true })}`
                  : `Created ${formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}`}
              </time>
            </div>

            <div className="flex gap-1">
              {submission.repoUrl && (
                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                  <a
                    href={submission.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View GitHub repository"
                  >
                    <Github className="w-4 h-4" aria-hidden="true" />
                  </a>
                </Button>
              )}
              {submission.demoUrl && (
                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                  <a
                    href={submission.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View live demo"
                  >
                    <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
