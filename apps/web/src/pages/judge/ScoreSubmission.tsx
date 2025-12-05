import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Loader2,
  Play,
  Send,
  SkipForward,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { ScoringRubric } from "@/components/judging";
import { EmptyState } from "@/components/shared";
import { useJudgeStore } from "@/stores/judgeStore";
import { useAuthStore } from "@/stores/authStore";
import { CriterionScore } from "@/types";
import { toast } from "sonner";

export default function ScoreSubmission() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    assignments,
    selectAssignment,
    currentAssignment,
    submitScore,
    skipAssignment,
    fetchAssignments,
  } = useJudgeStore();

  const [scores, setScores] = useState<CriterionScore[]>([]);
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && assignments.length === 0) {
      fetchAssignments(user.id);
    }
  }, [user, assignments.length, fetchAssignments]);

  useEffect(() => {
    if (id) {
      selectAssignment(id);
    }
  }, [id, selectAssignment]);

  if (!currentAssignment) {
    return (
      <EmptyState
        icon={Send}
        title="Assignment not found"
        description="This assignment doesn't exist or has been completed."
        action={
          <Button asChild>
            <Link to="/judge/queue">Back to Queue</Link>
          </Button>
        }
      />
    );
  }

  const submission = currentAssignment.submission;

  const totalScore = scores.reduce((acc, s) => acc + s.score, 0);

  const handleSubmit = async () => {
    if (scores.length === 0) {
      toast.error("Please score at least one criterion");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitScore({
        submissionId: submission.id,
        judgeId: user!.id,
        scores,
        totalScore,
        comments,
      });

      toast.success("Score submitted!", {
        description: `Total: ${totalScore}/100`,
      });

      navigate("/judge/queue");
    } catch (error) {
      toast.error("Failed to submit score");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    await skipAssignment(currentAssignment.id);
    toast.info("Assignment skipped");
    navigate("/judge/queue");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/judge/queue">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">{submission.title}</h1>
          <p className="text-sm text-muted-foreground">
            by {submission.team.name}
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">
              <SkipForward className="w-4 h-4 mr-2" />
              Skip
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Skip this submission?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove the assignment from your queue. You can ask an
                admin to reassign it if needed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSkip}>Skip</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Submission Details */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Project Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Description
                  </h4>
                  <p>{submission.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Problem Statement
                  </h4>
                  <p className="text-sm">{submission.problemStatement}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Solution
                  </h4>
                  <p className="text-sm">{submission.solution}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {submission.techStack.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Project Links</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {submission.repoUrl && (
                <Button variant="outline" size="sm" asChild>
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
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={submission.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Demo
                  </a>
                </Button>
              )}
              {submission.videoUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={submission.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Video
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Scoring Panel */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Score This Submission</h2>
          
          <ScoringRubric scores={scores} onScoreChange={setScores} />

          {/* Overall Comments */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <Label>Overall Comments</Label>
              <Textarea
                placeholder="Add overall feedback for the team..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Submit */}
          <Button
            className="w-full"
            size="lg"
            onClick={handleSubmit}
            disabled={isSubmitting || scores.length === 0}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            <Send className="w-4 h-4 mr-2" />
            Submit Score ({totalScore}/100)
          </Button>
        </div>
      </div>
    </div>
  );
}
