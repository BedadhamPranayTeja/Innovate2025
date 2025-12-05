import { Link } from "react-router-dom";
import { ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubmissionForm } from "@/components/submission";
import { EmptyState } from "@/components/shared";
import { useTeamStore } from "@/stores/teamStore";

export default function NewSubmission() {
  const { myTeam } = useTeamStore();

  if (!myTeam) {
    return (
      <EmptyState
        icon={Users}
        title="Join a team first"
        description="You need to be part of a team to submit a project."
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
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/submissions">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-semibold">New Submission</h1>
          <p className="text-sm text-muted-foreground">
            Submitting as {myTeam.name}
          </p>
        </div>
      </div>

      <SubmissionForm />
    </div>
  );
}
