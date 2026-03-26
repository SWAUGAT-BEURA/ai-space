import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { STEP_META } from "./StepNode";
import type { WorkflowStep } from "@/types/workflow";

// Agent options for LLM steps
const AGENTS = [
  "Research Agent", "Task Agent", "Email Agent", "Finance Agent",
  "Document Agent", "Automation Agent", "Memory Agent", "Personal Assistant",
];

interface StepEditModalProps {
  step: WorkflowStep | null;
  onSave: (step: WorkflowStep) => void;
  onClose: () => void;
}

export function StepEditModal({ step, onSave, onClose }: StepEditModalProps) {
  const [local, setLocal] = useState<WorkflowStep | null>(null);

  useEffect(() => {
    setLocal(step ? { ...step, config: { ...step.config } } : null);
  }, [step]);

  if (!local) return null;
  const meta = STEP_META[local.type];
  const Icon = meta.icon;

  const setConfig = (key: string, val: string) =>
    setLocal((p) => p ? { ...p, config: { ...p.config, [key]: val } } : p);

  return (
    <AnimatePresence>
      {step && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="glass-strong rounded-2xl w-full max-w-lg border border-white/10 pointer-events-auto shadow-2xl shadow-black/50">
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", meta.bg)}>
                  <Icon className={cn("w-4 h-4", meta.color)} />
                </div>
                <div className="flex-1">
                  <p className={cn("text-xs font-semibold uppercase tracking-wider", meta.color)}>{meta.label}</p>
                  <p className="text-sm font-semibold text-white">Configure Step</p>
                </div>
                <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                {/* Label */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Step Label</label>
                  <input
                    value={local.label}
                    onChange={(e) => setLocal((p) => p ? { ...p, label: e.target.value } : p)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-blue-500/40 transition-colors"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Description</label>
                  <input
                    value={local.description}
                    onChange={(e) => setLocal((p) => p ? { ...p, description: e.target.value } : p)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-blue-500/40 transition-colors"
                  />
                </div>

                {/* Type-specific config */}
                {local.type === "llm_agent" && (
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Agent</label>
                    <select
                      value={local.config.agent ?? ""}
                      onChange={(e) => setConfig("agent", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none"
                    >
                      {AGENTS.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                    <label className="text-xs text-muted-foreground mb-1.5 block mt-3">Prompt / Instruction</label>
                    <textarea
                      value={local.config.prompt ?? ""}
                      onChange={(e) => setConfig("prompt", e.target.value)}
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none resize-none focus:border-purple-500/40 transition-colors"
                      placeholder="Describe what the agent should do..."
                    />
                  </div>
                )}

                {local.type === "code" && (
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Language</label>
                    <select
                      value={local.config.language ?? "javascript"}
                      onChange={(e) => setConfig("language", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none mb-3"
                    >
                      {["javascript", "python", "typescript"].map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Code Snippet</label>
                    <textarea
                      value={local.config.snippet ?? ""}
                      onChange={(e) => setConfig("snippet", e.target.value)}
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-blue-300 font-mono outline-none resize-none focus:border-blue-500/40 transition-colors"
                      placeholder="// your code here"
                    />
                  </div>
                )}

                {local.type === "condition" && (
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">Field</label>
                      <input value={local.config.field ?? ""} onChange={(e) => setConfig("field", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-foreground outline-none" placeholder="budget" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">Operator</label>
                      <select value={local.config.operator ?? ">"} onChange={(e) => setConfig("operator", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-foreground outline-none">
                        {[">", "<", "=", ">=", "<=", "!=", "contains"].map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">Value</label>
                      <input value={local.config.value ?? ""} onChange={(e) => setConfig("value", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-foreground outline-none" placeholder="5000" />
                    </div>
                  </div>
                )}

                {local.type === "trigger" && (
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Trigger Source</label>
                    <select
                      value={local.config.source ?? "schedule"}
                      onChange={(e) => setConfig("source", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none"
                    >
                      {["schedule", "email", "task_status", "file_upload", "webhook", "manual"].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                )}

                {local.type === "delay" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">Duration</label>
                      <input value={local.config.duration ?? "1"} onChange={(e) => setConfig("duration", e.target.value)} type="number" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">Unit</label>
                      <select value={local.config.unit ?? "hours"} onChange={(e) => setConfig("unit", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none">
                        {["minutes", "hours", "days"].map((u) => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {local.type === "approval" && (
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Approver</label>
                    <input value={local.config.approver ?? ""} onChange={(e) => setConfig("approver", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none" placeholder="team_lead" />
                    <label className="text-xs text-muted-foreground mb-1.5 block mt-3">Timeout</label>
                    <input value={local.config.timeout ?? "24h"} onChange={(e) => setConfig("timeout", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none" placeholder="24h" />
                  </div>
                )}

                {local.type === "action" && (
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Actions (comma-separated)</label>
                    <input value={local.config.action ?? ""} onChange={(e) => setConfig("action", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none" placeholder="send_email,create_task,ledger_entry" />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-white/5">
                <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cancel
                </button>
                <button
                  onClick={() => { onSave(local); onClose(); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 text-sm font-medium border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" /> Save Step
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
