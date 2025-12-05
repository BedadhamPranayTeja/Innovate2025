import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoringCriterion, CriterionScore } from "@/types";
import { cn } from "@/lib/utils";

// Default scoring criteria
const defaultCriteria: ScoringCriterion[] = [
  {
    id: "innovation",
    name: "Innovation",
    description: "Originality and creativity of the solution",
    maxScore: 25,
    weight: 1,
  },
  {
    id: "technical",
    name: "Technical Implementation",
    description: "Code quality, architecture, and technical complexity",
    maxScore: 25,
    weight: 1,
  },
  {
    id: "impact",
    name: "Impact & Usefulness",
    description: "Potential real-world impact and problem-solving effectiveness",
    maxScore: 25,
    weight: 1,
  },
  {
    id: "presentation",
    name: "Presentation",
    description: "Clarity of documentation, demo, and overall polish",
    maxScore: 25,
    weight: 1,
  },
];

interface ScoringRubricProps {
  criteria?: ScoringCriterion[];
  scores: CriterionScore[];
  onScoreChange: (scores: CriterionScore[]) => void;
}

export function ScoringRubric({
  criteria = defaultCriteria,
  scores,
  onScoreChange,
}: ScoringRubricProps) {
  const getScoreForCriterion = (criterionId: string) => {
    return scores.find((s) => s.criterionId === criterionId)?.score || 0;
  };

  const getFeedbackForCriterion = (criterionId: string) => {
    return scores.find((s) => s.criterionId === criterionId)?.feedback || "";
  };

  const updateScore = (criterionId: string, score: number) => {
    const existing = scores.find((s) => s.criterionId === criterionId);
    if (existing) {
      onScoreChange(
        scores.map((s) =>
          s.criterionId === criterionId ? { ...s, score } : s
        )
      );
    } else {
      onScoreChange([...scores, { criterionId, score }]);
    }
  };

  const updateFeedback = (criterionId: string, feedback: string) => {
    const existing = scores.find((s) => s.criterionId === criterionId);
    if (existing) {
      onScoreChange(
        scores.map((s) =>
          s.criterionId === criterionId ? { ...s, feedback } : s
        )
      );
    } else {
      onScoreChange([...scores, { criterionId, score: 0, feedback }]);
    }
  };

  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return "text-success";
    if (percentage >= 60) return "text-warning";
    if (percentage >= 40) return "text-orange-500";
    return "text-destructive";
  };

  const totalScore = criteria.reduce((acc, c) => {
    const score = getScoreForCriterion(c.id);
    return acc + score;
  }, 0);

  const maxTotal = criteria.reduce((acc, c) => acc + c.maxScore, 0);

  return (
    <div className="space-y-4">
      {criteria.map((criterion) => {
        const score = getScoreForCriterion(criterion.id);
        const feedback = getFeedbackForCriterion(criterion.id);

        return (
          <Card key={criterion.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{criterion.name}</CardTitle>
                <span
                  className={cn(
                    "text-2xl font-bold tabular-nums",
                    getScoreColor(score, criterion.maxScore)
                  )}
                >
                  {score}
                  <span className="text-sm text-muted-foreground font-normal">
                    /{criterion.maxScore}
                  </span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {criterion.description}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="pt-2">
                <Slider
                  value={[score]}
                  onValueChange={([value]) => updateScore(criterion.id, value)}
                  max={criterion.maxScore}
                  step={1}
                  className="cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0</span>
                  <span>{criterion.maxScore}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Feedback (Optional)</Label>
                <Textarea
                  placeholder="Add specific feedback for this criterion..."
                  value={feedback}
                  onChange={(e) => updateFeedback(criterion.id, e.target.value)}
                  rows={2}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Total Score */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Total Score</span>
            <span className={cn("text-3xl font-bold", getScoreColor(totalScore, maxTotal))}>
              {totalScore}
              <span className="text-lg text-muted-foreground font-normal">
                /{maxTotal}
              </span>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
