import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search, CheckSquare, Wallet, FileText, Mail, Zap,
  Database, Bot, ArrowUpRight, Clock, Sparkles, Activity, ChevronRight
} from "lucide-react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const agentCards = [
  { title: "Research", desc: "Web search & summarization", icon: Search, color: "from-cyan-500/20 to-blue-500/10", border: "border-cyan-500/20", iconColor: "text-cyan-400", link: "/research" },
  { title: "Tasks", desc: "5 pending · 2 due today", icon: CheckSquare, color: "from-green-500/20 to-emerald-500/10", border: "border-green-500/20", iconColor: "text-green-400", link: "/tasks" },
  { title: "Finance", desc: "Balance: $4,280", icon: Wallet, color: "from-emerald-500/20 to-teal-500/10", border: "border-emerald-500/20", iconColor: "text-emerald-400", link: "/ledger" },
  { title: "Documents", desc: "12 files · 3 summarized", icon: FileText, color: "from-pink-500/20 to-rose-500/10", border: "border-pink-500/20", iconColor: "text-pink-400", link: "/documents" },
  { title: "Email", desc: "8 unread · 3 tasks found", icon: Mail, color: "from-amber-500/20 to-yellow-500/10", border: "border-amber-500/20", iconColor: "text-amber-400", link: "/email" },
  { title: "Automation", desc: "3 workflows running", icon: Zap, color: "from-orange-500/20 to-amber-500/10", border: "border-orange-500/20", iconColor: "text-orange-400", link: "/automation" },
  { title: "Memory", desc: "42 preferences stored", icon: Database, color: "from-violet-500/20 to-purple-500/10", border: "border-violet-500/20", iconColor: "text-violet-400", link: "/memory" },
  { title: "Agent Hub", desc: "7 agents · all healthy", icon: Bot, color: "from-blue-500/20 to-indigo-500/10", border: "border-blue-500/20", iconColor: "text-blue-400", link: "/agents" },
];

const recentActivity = [
  { text: "Research: Summarized GST rules for freelancers", time: "12 min ago", icon: Search, color: "text-cyan-400" },
  { text: "Task completed: Review Q4 budget report", time: "1 hr ago", icon: CheckSquare, color: "text-green-400" },
  { text: "Email: Drafted reply to client proposal", time: "2 hrs ago", icon: Mail, color: "text-amber-400" },
  { text: "Document: Extracted key points from contract.pdf", time: "3 hrs ago", icon: FileText, color: "text-pink-400" },
  { text: "Automation: Invoice workflow triggered", time: "Yesterday", icon: Zap, color: "text-orange-400" },
];

const stats = [
  { label: "Tasks Done", value: "24", change: "+8 this week", icon: CheckSquare, color: "text-green-400", bg: "bg-green-500/10" },
  { label: "AI Queries", value: "138", change: "+22 today", icon: Sparkles, color: "text-blue-400", bg: "bg-blue-500/10" },
  { label: "Automations", value: "3", change: "Active now", icon: Activity, color: "text-orange-400", bg: "bg-orange-500/10" },
  { label: "Time Saved", value: "4.2h", change: "This week", icon: Clock, color: "text-purple-400", bg: "bg-purple-500/10" },
];

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <motion.div {...fade(0)} className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{getGreeting()}, Professional 👋</p>
          <h1 className="text-2xl font-bold text-foreground">Your AI Workspace</h1>
          <p className="text-sm text-muted-foreground mt-1">All agents are running. Here's what's happening today.</p>
        </div>
        <Link to="/agents" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium hover:bg-blue-500/15 transition-colors">
          <Bot className="w-4 h-4" />
          Manage Agents
        </Link>
      </motion.div>

      <motion.div {...fade(0.05)} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="glass rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-[10px] ${s.color} mt-0.5`}>{s.change}</p>
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div {...fade(0.1)}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">Active Agents</h2>
          <Link to="/agents" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {agentCards.map((card, i) => (
            <motion.div key={card.title} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.04 }}>
              <Link to={card.link}>
                <div className={`glass rounded-2xl p-4 border ${card.border} bg-gradient-to-br ${card.color} hover:scale-[1.02] transition-all duration-200 cursor-pointer group`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                      <card.icon className={`w-4 h-4 ${card.iconColor}`} />
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse mt-1" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{card.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{card.desc}</p>
                  <div className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">
                    Open <ArrowUpRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div {...fade(0.2)} className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Recent Activity</h2>
            <span className="text-xs text-muted-foreground">Today</span>
          </div>
          <div className="glass rounded-2xl divide-y divide-white/5">
            {recentActivity.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.06 }} className="flex items-center gap-3 px-4 py-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <p className="text-sm text-foreground flex-1 truncate">{item.text}</p>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fade(0.25)}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Quick Actions</h2>
          </div>
          <div className="glass rounded-2xl p-4 space-y-1">
            {[
              { label: "Ask Research Agent", icon: Search, link: "/research", color: "text-cyan-400" },
              { label: "Create a Task", icon: CheckSquare, link: "/tasks", color: "text-green-400" },
              { label: "Upload Document", icon: FileText, link: "/documents", color: "text-pink-400" },
              { label: "Add Transaction", icon: Wallet, link: "/ledger", color: "text-emerald-400" },
              { label: "New Automation", icon: Zap, link: "/automation", color: "text-orange-400" },
            ].map((action) => (
              <Link key={action.label} to={action.link}>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer">
                  <action.icon className={`w-4 h-4 ${action.color}`} />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{action.label}</span>
                  <ArrowUpRight className="w-3 h-3 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4 glass rounded-2xl p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/5 border border-blue-500/15">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold text-blue-400">AI Insight</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You have 2 high-priority tasks due tomorrow. Consider delegating the invoice review to the Automation agent.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
