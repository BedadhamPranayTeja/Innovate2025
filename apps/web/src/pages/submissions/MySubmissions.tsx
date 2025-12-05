import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubmissionCard } from "@/components/submission";
import { EmptyState } from "@/components/shared";
import { useSubmissionStore } from "@/stores/submissionStore";
import { useTeamStore } from "@/stores/teamStore";

export default function MySubmissions() {
  const { submissions } = useSubmissionStore();
  const { myTeam } = useTeamStore();

  const teamSubmissions = myTeam
    ? submissions.filter((s) => s.teamId === myTeam.id)
    : [];

  if (!myTeam) {
    return (
      <EmptyState
        icon={FileText}
        title="Join a team first"
        description="You need to be part of a team to create and view submissions."
        action={
          <Button asChild>
            <Link to="/teams">Browse Teams</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Submissions</h1>
          <p className="text-muted-foreground">
            Submissions for {myTeam.name}
          </p>
        </div>
        <Button asChild>
          <Link to="/submissions/new">
            <Plus className="w-4 h-4 mr-2" />
            New Submission
          </Link>
        </Button>
      </div>

      {teamSubmissions.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No submissions yet"
          description="Create your first submission to enter Innovate 2025."
          action={
            <Button asChild>
              <Link to="/submissions/new">
                <Plus className="w-4 h-4 mr-2" />
                Create Submission
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {teamSubmissions.map((submission, index) => (
            <SubmissionCard
              key={submission.id}
              submission={submission}
              index={index}
              showTeam={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
