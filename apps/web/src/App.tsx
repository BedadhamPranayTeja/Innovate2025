import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Role } from "@/types";

// Layout
import { AppShell, RoleGuard } from "@/components/layout";
import { ErrorBoundary } from "@/components/shared";

// Pages
import Landing from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import JudgeDashboard from "./pages/dashboard/JudgeDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import Leaderboard from "./pages/Leaderboard";
import TeamList from "./pages/teams/TeamList";
import TeamDetail from "./pages/teams/TeamDetail";
import MySubmissions from "./pages/submissions/MySubmissions";
import NewSubmission from "./pages/submissions/NewSubmission";
import SubmissionDetail from "./pages/submissions/SubmissionDetail";
import JudgeQueue from "./pages/judge/JudgeQueue";
import ScoreSubmission from "./pages/judge/ScoreSubmission";
import PaymentPage from "./pages/payment/PaymentPage";
import TicketPage from "./pages/payment/TicketPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Dashboard router component
function DashboardRouter() {
  const { user } = useAuthStore();
  
  switch (user?.role) {
    case Role.JUDGE:
      return <JudgeDashboard />;
    case Role.ADMIN:
      return <AdminDashboard />;
    default:
      return <StudentDashboard />;
  }
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/leaderboard" element={<Leaderboard />} />

          {/* Protected routes with AppShell */}
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<DashboardRouter />} />
            <Route path="/teams" element={<TeamList />} />
            <Route path="/teams/:id" element={<TeamDetail />} />
            <Route path="/submissions" element={<MySubmissions />} />
            <Route path="/submissions/new" element={<NewSubmission />} />
            <Route path="/submissions/:id" element={<SubmissionDetail />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/ticket" element={<TicketPage />} />
            
            {/* Judge routes */}
            <Route element={<RoleGuard allowed={[Role.JUDGE, Role.ADMIN]} />}>
              <Route path="/judge/queue" element={<JudgeQueue />} />
              <Route path="/judge/score/:id" element={<ScoreSubmission />} />
            </Route>

            {/* Admin routes */}
            <Route element={<RoleGuard allowed={[Role.ADMIN]} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminDashboard />} />
              <Route path="/admin/teams" element={<AdminDashboard />} />
              <Route path="/admin/analytics" element={<AdminDashboard />} />
              <Route path="/admin/settings" element={<AdminDashboard />} />
            </Route>
          </Route>

          {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
