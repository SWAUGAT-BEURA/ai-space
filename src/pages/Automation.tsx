import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Play, Pause, Plus, CheckCircle, Clock, ArrowRight, Activity, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  status: "active" | "paused";
  runs: number;
  lastRun: string;
  category: string;
}

const initialWorkflows: Workflow[] = [
  { id: "1", name: "Invoice Auto-Send", description: "Automatically send invoices when a project is marked complete", trigger: "Task completed", action: "Send email + create ledger entry", status: "active", runs: 12, lastRun: "2 hrs ago", category: "Finance" },
  { id: "2", name: "Email → Task Extractor", description: "Extract action items from emails and add them to Tasks", trigger: "New email received", action: "Create tasks from email", status: "active", runs: 34, lastRun: "10 min ago", category: "Productivity" },
  { id: "3", name: "Weekly Finance Report", description: "Generate and email a weekly summary of income and expenses", trigger: "Every Monday 9 AM", action: "Generate report + send email", status: "active", runs: 8, lastRun: "3 days ago", category: "Finance" },
  { id: "4", name: "Document Summarizer", description: "Auto-summarize uploaded documents using the Document Agent", trigger: "File uploaded", action: "Summarize + extract key points", status: "paused", runs: 5, lastRun: "1 week ago", category: "Documents" },
  { id: "5", name: "Appointment Reminder", description: "Send reminders 24 hours before scheduled appointments", trigger: "24h before calendar event", action: "Send SMS + email reminder", status: "paused", runs: 22, lastRun: "2 days ago", category: "Scheduling" },
];

const templates = [
  { name: "Client Follow-up", trigger: "7 days after last contact", icon: "📧" },
  { name: "Expense Alert", trigger: "Expense > $500", icon: "💰" },
  { name: "Daily Briefing", trigger: "Every morning 8 AM", icon: "☀️" },
  { name: "Contract Expiry Alert", trigger: "30 days before expiry", icon: "📋" },
];

export default function Automation() {
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows);

  const toggleWorkflow = (id: string) => {
    setWorkflows((prev) => prev.map((w) => w.id === id ? { ...w, status: w.status === "active" ? "paused" : "active" } : w));
  };

  const active = workflows.filter((w) => w.status === "active").length;
  const totalRuns = workflows.reduce((s, w) => s + w.runs, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div {...fade(0)} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Automation Agent</h1>
          <p className="text-sm text-muted-foreground mt-1">Build workflows that run automatically</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium hover:bg-orange-500/15 transition-colors">
          <Plus className="w-4 h-4" /> New Workflow
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div {...fade(0.05)} className="grid grid-cols-3 gap-4">
        {[
          { label: "Active", value: active, color: "text-green-400", bg: "bg-green-500/10" },
          { label: "Total Runs", value: totalRuns, color: "text-orange-400", bg: "bg-orange-500/10" },
          { label: "Time Saved", value: "6.4h", color: "text-blue-400", bg: "bg-blue-500/10" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Workflows */}
      <motion.div {...fade(0.1)}>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Your Workflows</p>
        <div className="space-y-3">
          {workflows.map((wf, i) => (
            <motion.div key={wf.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <div className={cn("glass rounded-2xl p-5 border transition-colors", wf.status === "active" ? "border-orange-500/20" : "border-white/5")}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5", wf.status === "active" ? "bg-orange-500/15" : "bg-white/5")}>
                      <Zap className={cn("w-4 h-4", wf.status === "active" ? "text-orange-400" : "text-muted-foreground")} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-foreground">{wf.name}</p>
                        <span className={cn("px-2 py-0.5 rounded-md text-[10px] font-medium", wf.status === "active" ? "bg-green-500/15 text-green-400" : "bg-muted/30 text-muted-foreground")}>
                          {wf.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{wf.description}</p>

                      {/* Trigger → Action flow */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs border border-blue-500/20 flex items-center gap-1.5">
                          <Clock className="w-3 h-3" /> {wf.trigger}
                        </span>
                        <ArrowRight className="w-3 h-3 text-muted-foreground" />
                        <span className="px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-400 text-xs border border-orange-500/20 flex items-center gap-1.5">
                          <CheckCircle className="w-3 h-3" /> {wf.action}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{wf.runs} runs</p>
                      <p className="text-[11px] text-muted-foreground">{wf.lastRun}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleWorkflow(wf.id)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                          wf.status === "active"
                            ? "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/15"
                            : "bg-white/5 text-muted-foreground border border-white/10 hover:text-foreground"
                        )}
                      >
                        {wf.status === "active" ? <><Pause className="w-3 h-3" /> Pause</> : <><Play className="w-3 h-3" /> Resume</>}
                      </button>
                      <button className="w-7 h-7 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                        <Settings className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Templates */}
      <motion.div {...fade(0.2)}>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Quick Templates</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {templates.map((t) => (
            <button key={t.name} className="glass rounded-2xl p-4 text-left hover:bg-white/5 transition-colors border border-white/5 hover:border-orange-500/20 group">
              <span className="text-2xl mb-3 block">{t.icon}</span>
              <p className="text-sm font-medium text-foreground group-hover:text-foreground transition-colors">{t.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{t.trigger}</p>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
