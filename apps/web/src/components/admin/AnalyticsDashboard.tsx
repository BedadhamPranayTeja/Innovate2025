import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from "recharts";

// Mock registration data
const registrationData = [
  { date: "Nov 1", registrations: 12, submissions: 0 },
  { date: "Nov 5", registrations: 28, submissions: 0 },
  { date: "Nov 10", registrations: 45, submissions: 5 },
  { date: "Nov 15", registrations: 67, submissions: 12 },
  { date: "Nov 20", registrations: 89, submissions: 24 },
  { date: "Nov 25", registrations: 112, submissions: 38 },
  { date: "Dec 1", registrations: 134, submissions: 52 },
  { date: "Dec 4", registrations: 156, submissions: 67 },
];

const roleDistribution = [
  { name: "Students", value: 120, color: "hsl(var(--role-student))" },
  { name: "Judges", value: 15, color: "hsl(var(--role-judge))" },
  { name: "Admins", value: 5, color: "hsl(var(--role-admin))" },
];

const submissionsByCategory = [
  { category: "AI/ML", count: 24 },
  { category: "Web3", count: 18 },
  { category: "EdTech", count: 15 },
  { category: "FinTech", count: 12 },
  { category: "HealthTech", count: 8 },
];

export function AnalyticsDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Registrations", value: "156", change: "+12%", positive: true },
          { label: "Active Teams", value: "42", change: "+8%", positive: true },
          { label: "Submissions", value: "67", change: "+23%", positive: true },
          { label: "Avg. Score", value: "78.5", change: "+5%", positive: true },
        ].map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <span className={`text-xs ${kpi.positive ? "text-success" : "text-destructive"}`}>
                    {kpi.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Registration Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Registration & Submission Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={registrationData}>
                <defs>
                  <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }} 
                />
                <Area
                  type="monotone"
                  dataKey="registrations"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorReg)"
                  name="Registrations"
                />
                <Area
                  type="monotone"
                  dataKey="submissions"
                  stroke="hsl(var(--success))"
                  fillOpacity={1}
                  fill="url(#colorSub)"
                  name="Submissions"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Role Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>User Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {roleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Submissions by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Submissions by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={submissionsByCategory} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="category" type="category" width={80} className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                  <Bar 
                    dataKey="count" 
                    fill="hsl(var(--primary))" 
                    radius={[0, 4, 4, 0]}
                    name="Submissions"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
