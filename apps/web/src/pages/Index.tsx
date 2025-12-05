import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Users, 
  Trophy, 
  Zap, 
  Calendar,
  Code,
  Lightbulb,
  Rocket,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePhaseStore } from "@/stores/phaseStore";
import { useAuthStore } from "@/stores/authStore";
import { CountdownTimer, PhaseBadge } from "@/components/shared";
import heroBg from "@/assets/hero-bg.jpg";

const features = [
  {
    icon: Users,
    title: "Team Formation",
    description: "Form teams of up to 5 members. Collaborate with the best minds.",
  },
  {
    icon: Lightbulb,
    title: "Innovative Challenges",
    description: "Solve real-world problems across multiple domains and tracks.",
  },
  {
    icon: Code,
    title: "Build & Submit",
    description: "48 hours to turn your ideas into working prototypes.",
  },
  {
    icon: Trophy,
    title: "Win Prizes",
    description: "Compete for cash prizes, mentorship, and opportunities.",
  },
];

const stats = [
  { value: "1000+", label: "Participants" },
  { value: "₹5L+", label: "Prize Pool" },
  { value: "48", label: "Hours" },
  { value: "50+", label: "Mentors" },
];

export default function Landing() {
  const { currentPhase, event } = usePhaseStore();
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">Innovate 2025</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
              <Link to="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link to="/leaderboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Leaderboard
              </Link>
              <PhaseBadge phase={currentPhase} />
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              {isAuthenticated ? (
                <Button asChild size="sm" className="sm:size-default">
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild size="sm" className="hidden sm:inline-flex">
                    <Link to="/auth/login">Sign in</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link to="/auth/register">Register</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="Hero background"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <PhaseBadge phase={currentPhase} className="mb-6" />
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6">
              <span className="text-gradient-hero">Innovate 2025</span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
              The Ultimate Hackathon Experience. Build, collaborate, and compete with 
              the brightest minds to solve real-world challenges.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button size="lg" asChild className="glow-primary">
                <Link to="/auth/register">
                  Register Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/leaderboard">
                  <Trophy className="w-5 h-5 mr-2" />
                  View Leaderboard
                </Link>
              </Button>
            </div>

            {/* Countdown */}
            <div className="mb-8">
              <p className="text-sm text-muted-foreground mb-4">Event starts in:</p>
              <div className="flex justify-center">
                <CountdownTimer targetDate={event?.startTime || new Date("2025-01-15T09:00:00")} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
          >
            <div className="w-1 h-2 rounded-full bg-muted-foreground" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Innovate 2025?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need for an unforgettable hackathon experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Event Timeline
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { phase: "PRE", title: "Registration", date: "Dec 1 - Jan 14", icon: Calendar, description: "Register your team and complete payment" },
              { phase: "LIVE", title: "Hackathon", date: "Jan 15 - Jan 17", icon: Zap, description: "48 hours of intense building and innovation" },
              { phase: "POST", title: "Results", date: "Jan 18", icon: Trophy, description: "Winners announced and prizes distributed" },
            ].map((item, index) => (
              <motion.div
                key={item.phase}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative p-6 rounded-2xl bg-card border border-border text-center"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    item.phase === "PRE" ? "bg-phase-pre text-phase-pre-foreground" :
                    item.phase === "LIVE" ? "bg-phase-live text-phase-live-foreground" :
                    "bg-phase-post text-phase-post-foreground"
                  }`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mt-4 mb-1">{item.title}</h3>
                <p className="text-sm font-medium text-primary mb-2">{item.date}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Rocket className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Innovate?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Join thousands of participants and build something amazing. 
              Registration closes soon!
            </p>
            <Button size="lg" asChild className="glow-primary">
              <Link to="/auth/register">
                Register Your Team
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold">Innovate 2025</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Innovate EOS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
