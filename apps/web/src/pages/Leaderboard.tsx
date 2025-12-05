import { motion } from "framer-motion";
import { Trophy, Medal, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useJudgeStore } from "@/stores/judgeStore";

export default function Leaderboard() {
  const { leaderboard } = useJudgeStore();

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
    return <span className="w-6 h-6 flex items-center justify-center font-bold text-muted-foreground">{rank}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Trophy className="w-8 h-8 text-primary" />
          Leaderboard
        </h1>
        <p className="text-muted-foreground mt-1">Top performing teams</p>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle>Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboard.map((entry, index) => (
              <motion.div
                key={entry.teamId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-4 p-4 rounded-xl ${
                  entry.rank <= 3 ? "bg-primary/5 border border-primary/20" : "bg-muted/50"
                }`}
              >
                <div className="w-10 h-10 flex items-center justify-center">
                  {getRankIcon(entry.rank)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{entry.teamName}</p>
                  <p className="text-sm text-muted-foreground">{entry.submission.title}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{entry.avgScore.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">{entry.judgeCount} judges</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
