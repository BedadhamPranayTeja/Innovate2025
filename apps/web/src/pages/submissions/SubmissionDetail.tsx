import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Github,
  Play,
  Star,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/shared";
import { useSubmissionStore } from "@/stores/submissionStore";
import { SubmissionStatus } from "@/types";
import { format } from "date-fns";

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

export default function SubmissionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { submissions } = useSubmissionStore();

  const submission = submissions.find((s) => s.id === id);

  if (!submission) {
    return (
      <EmptyState
        icon={FileText}
        title="Submission not found"
        description="This submission doesn't exist or has been deleted."
        action={
          <Button asChild>
            <Link to="/submissions">Back to Submissions</Link>
          </Button>
        }
      />
    );
  }

  const status = statusConfig[submission.status];
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{submission.title}</h1>
              <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                <Users className="w-4 h-4" />
                <Link
                  to={`/teams/${submission.teamId}`}
                  className="hover:text-primary transition-colors"
                >
                  {submission.team.name}
                </Link>
              </div>
            </div>
            <Badge className={status.className}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {status.label}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{submission.description}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Problem Statement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{submission.problemStatement}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Solution</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{submission.solution}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {submission.repoUrl && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a
                    href={submission.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    Repository
                  </a>
                </Button>
              )}
              {submission.demoUrl && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a
                    href={submission.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Live Demo
                  </a>
                </Button>
              )}
              {submission.videoUrl && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a
                    href={submission.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Demo Video
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Tech Stack */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Tech Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {submission.techStack.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Created
                </span>
                <span>{format(new Date(submission.createdAt), "MMM d, yyyy")}</span>
              </div>
              {submission.submittedAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Submitted
                  </span>
                  <span>
                    {format(new Date(submission.submittedAt), "MMM d, yyyy")}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
