import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Plus, CheckCircle2, Circle, Clock, Trash2,
  Zap, GitBranch, Sparkles, MoreHorizontal, Tag, User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockSheets, mockWorkflows } from "@/data/mockData";
import type { SheetTask, TaskStatus, TaskPriority } from "@/types/workflow";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay },
});

const statusCols: { key: TaskStatus; label: string; dot: string; border: string }[] = [
  { key: "todo",        label: "To Do",       dot: "bg-muted-foreground", border: "border-white/10" },
  { key: "in_progress", label: "In Progress", dot: "bg-amber-400",        border: "border-amber-500/20" },
  { key: "review",      label: "Review",      dot: "bg-blue-400",         border: "border-blue-500/20" },
  { key: "done",        label: "Done",        dot: "bg-green-400",        border: "border-green-500/20" },
];

const priorityConfig: Record<TaskPriority, { label: string; class: string }> = {
  high:   { label: "High",   class: "bg-red-500/10 text-red-400 border-red-500/20" },
  medium: { label: "Med",    class: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  low:    { label: "Low",    class: "bg-green-500/10 text-green-400 border-green-500/20" },
};

export default function TaskSheet() {
  const { sheetId } = useParams<{ sheetId: string }>();
  const sheet = mockSheets.find((s) => s.id === sheetId);

  const [tasks, setTasks] = useState<SheetTask[]>(sheet?.tasks ?? []);
  const [addingTo, setAddingTo] = useState<TaskStatus | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<TaskPriority>("medium");
  const [view, setView] = useState<"board" | "list">("board");

  if (!sheet) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Sheet not found.</p>
      </div>
    );
  }

  const wf = sheet.workflowId ? mockWorkflows.find((w) => w.id === sheet.workflowId) : null;

  const moveTask = (id: string, status: TaskStatus) =>
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status } : t));

  const deleteTask = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const addTask = (status: TaskStatus) => {
    if (!newTitle.trim()) return;
    setTasks((prev) => [
      ...prev,
      {
        id: `t-${Date.now()}`,
        title: newTitle,
        status,
        priority: newPriority,
        assignee: "You",
        dueDate: new Date().toISOString().split("T")[0],
        tags: [],
      },
    ]);
    setNewTitle("");
    setAddingTo(null);
  };

  const done  = tasks.filter((t) => t.status === "done").length;
  const total = tasks.length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="max-w-full space-y-6">
      {/* Header */}
      <motion.div {...fade(0)} className="flex items-start gap-4">
        <Link to="/tasks" className="w-8 h-8 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 mt-1">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">{sheet.icon}</span>
            <h1 className="text-2xl font-bold text-white">{sheet.name}</h1>
          </div>
          <p className="text-sm text-muted-foreground">{sheet.description}</p>

          {/* Progress bar */}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex-1 max-w-xs h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-green-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs text-muted-foreground">{done}/{total} done</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* View toggle */}
          <div className="flex glass rounded-xl p-1 gap-1">
            {(["board", "list"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize", view === v ? "bg-white/10 text-white" : "text-muted-foreground hover:text-foreground")}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Workflow button */}
          {wf ? (
            <Link
              to={`/workflow/${wf.id}?sheet=${sheet.id}`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium hover:bg-orange-500/15 transition-colors"
            >
              <Zap className="w-4 h-4" />
              {wf.name}
            </Link>
          ) : (
            <Link
              to={`/workflow/new?sheet=${sheet.id}`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-white/10 text-muted-foreground text-sm hover:border-orange-500/20 hover:text-orange-400 transition-colors"
            >
              <GitBranch className="w-4 h-4" />
              Add Workflow
            </Link>
          )}
        </div>
      </motion.div>

      {/* AI insight */}
      {wf && (
        <motion.div {...fade(0.05)} className="glass rounded-2xl p-4 bg-gradient-to-r from-orange-500/8 to-amber-500/5 border border-orange-500/15 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-semibold text-orange-400 mb-1">Workflow Active — {wf.name}</p>
            <p className="text-xs text-muted-foreground">
              This sheet is driven by a {wf.steps.length}-step workflow. {wf.runs} runs completed.
              AI-assigned tasks are handled automatically by the workflow agents.
            </p>
          </div>
          <Link to={`/workflow/${wf.id}?sheet=${sheet.id}`} className="text-xs text-orange-400 hover:text-orange-300 transition-colors whitespace-nowrap">
            Edit workflow →
          </Link>
        </motion.div>
      )}

      {/* Board view */}
      {view === "board" && (
        <motion.div {...fade(0.1)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {statusCols.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.key);
            return (
              <div key={col.key} className={cn("glass rounded-2xl border", col.border)}>
                {/* Column header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full", col.dot)} />
                    <span className="text-xs font-semibold text-foreground">{col.label}</span>
                    <span className="text-xs text-muted-foreground">({colTasks.length})</span>
                  </div>
                  <button
                    onClick={() => { setAddingTo(col.key); setNewTitle(""); }}
                    className="w-6 h-6 rounded-lg hover:bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Tasks */}
                <div className="p-3 space-y-2 min-h-[80px]">
                  <AnimatePresence>
                    {colTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white/3 rounded-xl p-3 border border-white/5 hover:border-white/10 transition-colors group cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className={cn("text-xs font-medium leading-snug", task.status === "done" ? "line-through text-muted-foreground" : "text-foreground")}>
                            {task.title}
                          </p>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteTask(task.id)}>
                            <Trash2 className="w-3 h-3 text-muted-foreground hover:text-red-400 transition-colors" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={cn("px-1.5 py-0.5 rounded-md text-[9px] font-medium border", priorityConfig[task.priority].class)}>
                            {priorityConfig[task.priority].label}
                          </span>
                          {task.assignee === "AI" && (
                            <span className="px-1.5 py-0.5 rounded-md bg-purple-500/10 text-purple-400 text-[9px] font-medium border border-purple-500/20">AI</span>
                          )}
                          {task.tags.slice(0, 1).map((tag) => (
                            <span key={tag} className="px-1.5 py-0.5 rounded-md bg-white/5 text-muted-foreground text-[9px] border border-white/5">{tag}</span>
                          ))}
                        </div>

                        {/* Move buttons */}
                        <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {statusCols.filter((c) => c.key !== col.key).map((c) => (
                            <button
                              key={c.key}
                              onClick={() => moveTask(task.id, c.key)}
                              className="px-2 py-0.5 rounded-md bg-white/5 text-[9px] text-muted-foreground hover:text-foreground border border-white/5 transition-colors"
                            >
                              → {c.label}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Inline add */}
                  <AnimatePresence>
                    {addingTo === col.key && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                        <div className="space-y-2 pt-1">
                          <input
                            autoFocus
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") addTask(col.key); if (e.key === "Escape") setAddingTo(null); }}
                            placeholder="Task title..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-green-500/30 transition-colors"
                          />
                          <div className="flex gap-1">
                            {(["low", "medium", "high"] as const).map((p) => (
                              <button
                                key={p}
                                onClick={() => setNewPriority(p)}
                                className={cn("px-2 py-0.5 rounded-md text-[9px] border transition-all", priorityConfig[p].class, newPriority === p ? "ring-1 ring-white/20" : "opacity-50")}
                              >
                                {priorityConfig[p].label}
                              </button>
                            ))}
                            <button onClick={() => addTask(col.key)} className="ml-auto px-2 py-0.5 rounded-md bg-green-500/20 text-green-400 text-[9px] border border-green-500/30">Add</button>
                            <button onClick={() => setAddingTo(null)} className="px-2 py-0.5 rounded-md text-[9px] text-muted-foreground">✕</button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* List view */}
      {view === "list" && (
        <motion.div {...fade(0.1)} className="glass rounded-2xl divide-y divide-white/5">
          {tasks.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 px-5 py-3.5 group hover:bg-white/3 transition-colors"
            >
              <button onClick={() => moveTask(task.id, task.status === "done" ? "todo" : "done")} className="text-muted-foreground hover:text-green-400 transition-colors flex-shrink-0">
                {task.status === "done" ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Circle className="w-4 h-4" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-medium truncate", task.status === "done" ? "line-through text-muted-foreground" : "text-foreground")}>{task.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {task.tags.map((tag) => (
                    <span key={tag} className="text-[10px] text-muted-foreground">{tag}</span>
                  ))}
                </div>
              </div>
              <span className={cn("px-2 py-0.5 rounded-md text-[10px] border", priorityConfig[task.priority].class)}>{priorityConfig[task.priority].label}</span>
              <span className={cn("w-2 h-2 rounded-full flex-shrink-0", { todo: "bg-muted-foreground", in_progress: "bg-amber-400", review: "bg-blue-400", done: "bg-green-400" }[task.status])} />
              <span className="text-xs text-muted-foreground flex items-center gap-1 hidden sm:flex">
                <Clock className="w-3 h-3" /> {task.dueDate}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <User className="w-3 h-3" /> {task.assignee}
              </span>
              <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
