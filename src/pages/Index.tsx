import { motion } from "framer-motion";
import { CheckSquare, Wallet, FileText, Zap, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AIOrb } from "@/components/ui/AIOrb";
import { Link } from "react-router-dom";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const summaryCards = [
  { title: "Tasks Due Today", value: "5", icon: CheckSquare, glow: "cyan" as const, color: "text-primary", link: "/tasks" },
  { title: "Balance", value: "$4,280", icon: Wallet, glow: "green" as const, color: "text-success", link: "/ledger" },
  { title: "Documents", value: "12", icon: FileText, glow: "purple" as const, color: "text-secondary", link: "/documents" },
  { title: "Automations", value: "3 active", icon: Zap, glow: "cyan" as const, color: "text-primary", link: "/" },
];

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <AIOrb size="lg" />
        <div>
          <h1 className="text-3xl font-bold neon-text-cyan text-primary">
            {getGreeting()}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's your workspace overview for today
          </p>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <Link to={card.link} key={card.title}>
            <GlassCard
              glow={card.glow}
              hover3d
              className="cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{card.title}</p>
                  <p className={`text-2xl font-bold mt-2 ${card.color}`}>{card.value}</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/30">
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                <span>View details</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <GlassCard className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "New Task", icon: CheckSquare, link: "/tasks" },
            { label: "Add Transaction", icon: Wallet, link: "/ledger" },
            { label: "Upload Document", icon: FileText, link: "/documents" },
            { label: "AI Assistant", icon: Zap, link: "/" },
          ].map((action) => (
            <Link to={action.link} key={action.label}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="glass rounded-lg p-4 text-center cursor-pointer hover:border-primary/30 transition-colors group"
              >
                <action.icon className="w-5 h-5 mx-auto text-muted-foreground group-hover:text-primary transition-colors" />
                <p className="text-sm mt-2 text-muted-foreground group-hover:text-foreground transition-colors">{action.label}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </GlassCard>

      {/* Recent Activity Placeholder */}
      <GlassCard>
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { text: "Completed: Review Q4 report", time: "2 hours ago", color: "text-success" },
            { text: "New expense: $42 — Groceries", time: "4 hours ago", color: "text-destructive" },
            { text: "Document uploaded: Budget_2025.pdf", time: "Yesterday", color: "text-secondary" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between py-2 border-b border-border/20 last:border-0"
            >
              <span className={`text-sm ${item.color}`}>{item.text}</span>
              <span className="text-xs text-muted-foreground">{item.time}</span>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
