import { motion } from "framer-motion";
import {
  Bot, Search, CheckSquare, Wallet, FileText, Mail, Zap,
  Database, Shield, Brain, Users, Activity, MoreHorizontal,
  Play, Pause, Settings, TrendingUp
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

interface Agent {
  id: string;
  name: string;
  role: string;
  category: string;
  icon: React.ElementType;
  iconColor: string;
  bg: string;
  border: string;
  status: "active" | "idle" | "paused";
  queries: number;
  accuracy: number;
  lastRun: string;
  description: string;
}

const agents: Agent[] = [
  { id: "orchestrator", name: "Orchestrator", role: "Master Control", category: "Core", icon: Brain, iconColor: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", status: "active", queries: 342, accuracy: 98, lastRun: "Just now", description: "Routes tasks to the right agents and manages execution order." },
  { id: "research", name: "Research Agent", role: "Intelligence", category: "Intelligence", icon: Search, iconColor: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", status: "active", queries: 128, accuracy: 94, lastRun: "2 min ago", description: "Web search, multi-source aggregation and fact verification." },
  { id: "task", name: "Task Agent", role: "Productivity", category: "Productivity", icon: CheckSquare, iconColor: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", status: "active", queries: 89, accuracy: 99, lastRun: "5 min ago", description: "Creates, prioritizes and tracks tasks with smart reminders." },
  { id: "email", name: "Email Agent", role: "Communication", category: "Communication", icon: Mail, iconColor: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", status: "active", queries: 56, accuracy: 96, lastRun: "10 min ago", description: "Reads, summarizes and drafts email replies automatically." },
  { id: "ledger", name: "Finance Agent", role: "Finance", category: "Finance", icon: Wallet, iconColor: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", status: "active", queries: 34, accuracy: 99, lastRun: "1 hr ago", description: "Tracks income, expenses and generates financial insights." },
  { id: "document", name: "Document Agent", role: "Content", category: "Content", icon: FileText, iconColor: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20", status: "active", queries: 47, accuracy: 95, lastRun: "30 min ago", description: "Summarizes PDFs, extracts key points and highlights risks." },
  { id: "automation", name: "Automation Agent", role: "Execution", category: "Execution", icon: Zap, iconColor: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", status: "active", queries: 23, accuracy: 97, lastRun: "15 min ago", description: "Executes workflows and triggers actions across integrations." },
  { id: "memory", name: "Memory Agent", role: "Context", category: "Memory", icon: Database, iconColor: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", status: "active", queries: 201, accuracy: 100, lastRun: "Always on", description: "Stores preferences, behavior patterns and long-term context." },
  { id: "approval", name: "Approval Agent", role: "Safety", category: "Safety", icon: Shield, iconColor: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", status: "active", queries: 18, accuracy: 100, lastRun: "3 min ago", description: "Validates actions before execution to prevent mistakes." },
  { id: "assistant", name: "Personal Assistant", role: "Interface", category: "Interface", icon: Users, iconColor: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20", status: "active", queries: 312, accuracy: 97, lastRun: "Just now", description: "Unified interface that talks to all agents and gives final responses." },
];

const categories = ["All", "Core", "Intelligence", "Productivity", "Communication", "Finance", "Content", "Execution", "Memory", "Safety", "Interface"];

export default function Agents() {
  const [filter, setFilter] = useState("All");
  const [agentStates, setAgentStates] = useState<Record<string, "active" | "idle" | "paused">>(
    Object.fromEntries(agents.map((a) => [a.id, a.status]))
  );

  const filtered = filter === "All" ? agents : agents.filter((a) => a.category === filter);

  const toggleAgent = (id: string) => {
    setAgentStates((prev) => ({
      ...prev,
      [id]: prev[id] === "active" ? "paused" : "active",
    }));
  };

  const activeCount = Object.values(agentStates).filter((s) => s === "active").length;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <motion.div {...fade(0)} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Agent Hub</h1>
          <p className="text-sm text-muted-foreground mt-1">{activeCount} of {agents.length} agents active</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-sm text-foreground font-medium">System Healthy</span>
          </div>
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div {...fade(0.05)} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Agents", value: agents.length, icon: Bot, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Active", value: activeCount, icon: Activity, color: "text-green-400", bg: "bg-green-500/10" },
          { label: "Total Queries", value: agents.reduce((s, a) => s + a.queries, 0), icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-500/10" },
          { label: "Avg Accuracy", value: `${Math.round(agents.reduce((s, a) => s + a.accuracy, 0) / agents.length)}%`, icon: Shield, color: "text-amber-400", bg: "bg-amber-500/10" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Category filter */}
      <motion.div {...fade(0.1)} className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              filter === cat
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "glass text-muted-foreground hover:text-foreground"
            )}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Agent cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((agent, i) => {
          const status = agentStates[agent.id];
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass rounded-2xl p-5 border ${agent.border} hover:border-opacity-40 transition-all`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${agent.bg} flex items-center justify-center`}>
                    <agent.icon className={`w-5 h-5 ${agent.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className={cn("w-2 h-2 rounded-full", status === "active" ? "bg-green-400 animate-pulse" : "bg-muted-foreground")} />
                  <span className="text-xs text-muted-foreground capitalize">{status}</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mb-4">{agent.description}</p>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center">
                  <p className="text-sm font-bold text-white">{agent.queries}</p>
                  <p className="text-[10px] text-muted-foreground">Queries</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-white">{agent.accuracy}%</p>
                  <p className="text-[10px] text-muted-foreground">Accuracy</p>
                </div>
                <div className="text-center">
                  <p className="text-[11px] font-medium text-white truncate">{agent.lastRun}</p>
                  <p className="text-[10px] text-muted-foreground">Last run</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleAgent(agent.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all",
                    status === "active"
                      ? "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/15"
                      : "bg-muted/30 text-muted-foreground border border-border hover:bg-muted/50"
                  )}
                >
                  {status === "active" ? <><Pause className="w-3 h-3" /> Pause</> : <><Play className="w-3 h-3" /> Resume</>}
                </button>
                <button className="w-8 h-8 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <Settings className="w-3.5 h-3.5" />
                </button>
                <button className="w-8 h-8 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
