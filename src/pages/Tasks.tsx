import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus, CheckCircle2, Zap, ChevronRight,
  MoreHorizontal, Sparkles, GitBranch, Circle, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockSheets, mockWorkflows } from "@/data/mockData";
import type { TaskSheet } from "@/types/workflow";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

export const colorMap: Record<string, { border: string; bg: string; text: string; glow: string; swatch: string }> = {
  blue:    { border: "border-blue-500/20",    bg: "bg-blue-500/10",    text: "text-blue-400",    glow: "from-blue-500/10 to-indigo-500/5",    swatch: "bg-blue-500" },
  emerald: { border: "border-emerald-500/20", bg: "bg-emerald-500/10", text: "text-emerald-400", glow: "from-emerald-500/10 to-teal-500/5",   swatch: "bg-emerald-500" },
  cyan:    { border: "border-cyan-500/20",    bg: "bg-cyan-500/10",    text: "text-cyan-400",    glow: "from-cyan-500/10 to-blue-500/5",      swatch: "bg-cyan-500" },
  purple:  { border: "border-purple-500/20",  bg: "bg-purple-500/10",  text: "text-purple-400",  glow: "from-purple-500/10 to-violet-500/5",  swatch: "bg-purple-500" },
  amber:   { border: "border-amber-500/20",   bg: "bg-amber-500/10",   text: "text-amber-400",   glow: "from-amber-500/10 to-yellow-500/5",   swatch: "bg-amber-500" },
  pink:    { border: "border-pink-500/20",    bg: "bg-pink-500/10",    text: "text-pink-400",    glow: "from-pink-500/10 to-rose-500/5",      swatch: "bg-pink-500" },
};

const EMOJI_OPTIONS = ["📋", "🤝", "💰", "🔬", "⚖️", "🏥", "📁", "🎯", "🚀", "💼", "📊", "🗂️"];

function SheetCard({ sheet, onDelete }: { sheet: TaskSheet; onDelete: (id: string) => void }) {
  const c = colorMap[sheet.color] ?? colorMap.blue;
  const wf = sheet.workflowId ? mockWorkflows.find((w) => w.id === sheet.workflowId) : null;
  const done = sheet.tasks.filter((t) => t.status === "done").length;
  const total = sheet.tasks.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn("glass rounded-2xl border bg-gradient-to-br flex flex-col", c.border, c.glow, "hover:border-opacity-60 transition-all group")}
    >
      {/* Header */}
      <div className="p-5 pb-3 flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl leading-none">{sheet.icon}</span>
            <div>
              <h3 className="text-sm font-semibold text-foreground">{sheet.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{sheet.description}</p>
            </div>
          </div>
          <button
            onClick={() => onDelete(sheet.id)}
            className="w-7 h-7 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 flex items-center justify-center text-muted-foreground hover:text-red-400 transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-1">
          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-700", c.swatch, "opacity-70")}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className={cn("text-xs font-semibold tabular-nums", c.text)}>{pct}%</span>
        </div>
        <p className="text-[11px] text-muted-foreground">{done} of {total} tasks complete</p>

        {/* Task preview */}
        <div className="mt-3 space-y-1.5">
          {sheet.tasks.slice(0, 3).map((task) => (
            <div key={task.id} className="flex items-center gap-2">
              {task.status === "done"
                ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                : <Circle className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />
              }
              <span className={cn("text-xs truncate", task.status === "done" ? "line-through text-muted-foreground" : "text-foreground/80")}>
                {task.title}
              </span>
              {task.assignee === "AI" && (
                <span className="ml-auto flex-shrink-0 px-1.5 py-0.5 rounded-md bg-purple-500/10 text-purple-400 text-[9px] font-semibold border border-purple-500/20">AI</span>
              )}
            </div>
          ))}
          {sheet.tasks.length > 3 && (
            <p className="text-[11px] text-muted-foreground pl-5">+{sheet.tasks.length - 3} more</p>
          )}
          {sheet.tasks.length === 0 && (
            <p className="text-[11px] text-muted-foreground italic">No tasks yet — open sheet to add</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between gap-2">
        {wf ? (
          <Link
            to={`/workflow/${wf.id}?sheet=${sheet.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[11px] font-medium hover:bg-orange-500/20 transition-colors"
          >
            <Zap className="w-3 h-3" />
            {wf.name}
          </Link>
        ) : (
          <Link
            to={`/workflow/new?sheet=${sheet.id}`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-dashed border-white/15 text-muted-foreground text-[11px] hover:border-orange-500/30 hover:text-orange-400 transition-colors"
          >
            <GitBranch className="w-3 h-3" />
            Add workflow
          </Link>
        )}

        <Link
          to={`/tasks/${sheet.id}`}
          className={cn("flex items-center gap-1 text-xs font-semibold transition-colors ml-auto", c.text, "hover:opacity-80")}
        >
          Open sheet <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}

// ─── New Sheet Modal ──────────────────────────────────────────────────────────

interface NewSheetModalProps {
  onClose: () => void;
  onCreate: (sheet: TaskSheet) => void;
}

function NewSheetModal({ onClose, onCreate }: NewSheetModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("📋");
  const [color, setColor] = useState("blue");
  const [withWorkflow, setWithWorkflow] = useState(false);
  const navigate = useNavigate();

  const handleCreate = () => {
    if (!name.trim()) return;
    const newSheet: TaskSheet = {
      id: `sheet-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || "No description",
      icon,
      color,
      workflowId: null,
      tasks: [],
      createdAt: new Date().toISOString().split("T")[0],
    };
    onCreate(newSheet);
    onClose();
    if (withWorkflow) {
      navigate(`/workflow/new?sheet=${newSheet.id}`);
    } else {
      navigate(`/tasks/${newSheet.id}`);
    }
  };

  return (
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
        <div className="glass-strong rounded-2xl w-full max-w-md border border-white/10 pointer-events-auto shadow-2xl shadow-black/50">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <p className="text-sm font-semibold text-foreground">Create New Task Sheet</p>
            <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            {/* Icon + Name */}
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Sheet Name</label>
              <div className="flex gap-2">
                {/* Emoji picker */}
                <div className="relative group/emoji">
                  <button className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl hover:bg-white/10 transition-colors">
                    {icon}
                  </button>
                  <div className="absolute top-full left-0 mt-1 z-10 hidden group-hover/emoji:grid grid-cols-6 gap-1 p-2 glass-strong rounded-xl border border-white/10 shadow-xl">
                    {EMOJI_OPTIONS.map((e) => (
                      <button key={e} onClick={() => setIcon(e)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-base transition-colors">
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  placeholder="e.g. Client Onboarding, Q2 Research..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-green-500/40 transition-colors"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Description <span className="opacity-50">(optional)</span></label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this sheet for?"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-green-500/40 transition-colors"
              />
            </div>

            {/* Color */}
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Color</label>
              <div className="flex gap-2">
                {Object.entries(colorMap).map(([key, c]) => (
                  <button
                    key={key}
                    onClick={() => setColor(key)}
                    className={cn(
                      "w-7 h-7 rounded-full transition-all",
                      c.swatch,
                      color === key ? "ring-2 ring-white ring-offset-2 ring-offset-card scale-110" : "opacity-60 hover:opacity-100"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Workflow option */}
            <button
              onClick={() => setWithWorkflow(!withWorkflow)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left",
                withWorkflow
                  ? "bg-orange-500/10 border-orange-500/30 text-orange-400"
                  : "bg-white/3 border-white/10 text-muted-foreground hover:border-white/20"
              )}
            >
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", withWorkflow ? "bg-orange-500/20" : "bg-white/5")}>
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Create a workflow for this sheet</p>
                <p className="text-xs opacity-70 mt-0.5">Opens the workflow builder after creating</p>
              </div>
              <div className={cn("ml-auto w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all", withWorkflow ? "bg-orange-400 border-orange-400" : "border-white/20")} />
            </button>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-white/5">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!name.trim()}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-green-500/20 text-green-400 text-sm font-semibold border border-green-500/30 hover:bg-green-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              {withWorkflow ? "Create & Build Workflow" : "Create Sheet"}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Tasks() {
  const [sheets, setSheets] = useState<TaskSheet[]>(mockSheets);
  const [showNew, setShowNew] = useState(false);

  const addSheet = (sheet: TaskSheet) => setSheets((prev) => [sheet, ...prev]);
  const deleteSheet = (id: string) => setSheets((prev) => prev.filter((s) => s.id !== id));

  const totalTasks = sheets.reduce((s, sh) => s + sh.tasks.length, 0);
  const doneTasks  = sheets.reduce((s, sh) => s + sh.tasks.filter((t) => t.status === "done").length, 0);
  const aiTasks    = sheets.reduce((s, sh) => s + sh.tasks.filter((t) => t.assignee === "AI").length, 0);
  const wfCount    = sheets.filter((s) => s.workflowId).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div {...fade(0)} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Task Sheets</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {sheets.length} sheets · {totalTasks} tasks · each sheet can be powered by a workflow
          </p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold hover:bg-green-500/20 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Sheet
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div {...fade(0.05)} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Tasks",  value: totalTasks, color: "text-blue-400",   bg: "bg-blue-500/10",   icon: "📋" },
          { label: "Completed",    value: doneTasks,  color: "text-green-400",  bg: "bg-green-500/10",  icon: "✅" },
          { label: "AI-Automated", value: aiTasks,    color: "text-purple-400", bg: "bg-purple-500/10", icon: "🤖" },
          { label: "Workflows",    value: wfCount,    color: "text-orange-400", bg: "bg-orange-500/10", icon: "⚡" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-4 flex items-center gap-3">
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-lg", s.bg)}>
              {s.icon}
            </div>
            <div>
              <p className={cn("text-xl font-bold", s.color)}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* How it works hint — shown when no sheets have workflows */}
      {wfCount === 0 && (
        <motion.div {...fade(0.08)} className="glass rounded-2xl p-4 border border-orange-500/15 bg-gradient-to-r from-orange-500/5 to-amber-500/5 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-orange-400 mb-1">How workflows work</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Each sheet can have a workflow — a series of steps (AI agents, code, conditions, approvals) that run automatically.
              Click <span className="text-orange-400 font-medium">"Add workflow"</span> on any sheet card, or check the <span className="text-orange-400 font-medium">"Create a workflow"</span> option when making a new sheet.
            </p>
          </div>
        </motion.div>
      )}

      {/* Sheet grid */}
      <motion.div {...fade(0.1)}>
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {sheets.map((sheet) => (
              <SheetCard key={sheet.id} sheet={sheet} onDelete={deleteSheet} />
            ))}

            {/* Add new sheet card */}
            <motion.button
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowNew(true)}
              className="glass rounded-2xl border-2 border-dashed border-white/10 hover:border-green-500/30 hover:bg-green-500/5 transition-all p-8 flex flex-col items-center justify-center gap-3 text-center group min-h-[200px]"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 group-hover:bg-green-500/10 flex items-center justify-center transition-colors">
                <Plus className="w-6 h-6 text-muted-foreground group-hover:text-green-400 transition-colors" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">New Sheet</p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">Create a task sheet with optional workflow</p>
              </div>
            </motion.button>
          </div>
        </AnimatePresence>
      </motion.div>

      {/* New sheet modal */}
      <AnimatePresence>
        {showNew && <NewSheetModal onClose={() => setShowNew(false)} onCreate={addSheet} />}
      </AnimatePresence>
    </div>
  );
}
