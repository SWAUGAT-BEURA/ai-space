import { useRef } from "react";
import {
  Zap, Brain, Code2, GitBranch, MousePointerClick,
  Clock, ShieldCheck, Trash2, Settings2
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkflowStep, StepType } from "@/types/workflow";

// ─── Node meta ────────────────────────────────────────────────────────────────

export const NODE_META: Record<StepType, {
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  headerBg: string;
  glow: string;
  description: string;
}> = {
  trigger:   { label: "Trigger",    icon: Zap,               color: "text-amber-300",  bg: "bg-amber-500/10",  border: "border-amber-500/40",  headerBg: "bg-amber-500/20",  glow: "shadow-amber-500/20",  description: "Starts the workflow" },
  llm_agent: { label: "LLM Agent",  icon: Brain,             color: "text-purple-300", bg: "bg-purple-500/10", border: "border-purple-500/40", headerBg: "bg-purple-500/20", glow: "shadow-purple-500/20", description: "Run an AI agent step" },
  code:      { label: "Code",       icon: Code2,             color: "text-blue-300",   bg: "bg-blue-500/10",   border: "border-blue-500/40",   headerBg: "bg-blue-500/20",   glow: "shadow-blue-500/20",   description: "Execute custom code" },
  condition: { label: "Condition",  icon: GitBranch,         color: "text-cyan-300",   bg: "bg-cyan-500/10",   border: "border-cyan-500/40",   headerBg: "bg-cyan-500/20",   glow: "shadow-cyan-500/20",   description: "Branch on a condition" },
  action:    { label: "Action",     icon: MousePointerClick, color: "text-green-300",  bg: "bg-green-500/10",  border: "border-green-500/40",  headerBg: "bg-green-500/20",  glow: "shadow-green-500/20",  description: "Perform an action" },
  delay:     { label: "Delay",      icon: Clock,             color: "text-orange-300", bg: "bg-orange-500/10", border: "border-orange-500/40", headerBg: "bg-orange-500/20", glow: "shadow-orange-500/20", description: "Wait before next step" },
  approval:  { label: "Approval",   icon: ShieldCheck,       color: "text-red-300",    bg: "bg-red-500/10",    border: "border-red-500/40",    headerBg: "bg-red-500/20",    glow: "shadow-red-500/20",    description: "Require human approval" },
};

export const STATUS_RING: Record<string, string> = {
  idle:    "",
  running: "ring-2 ring-amber-400/60 shadow-lg shadow-amber-400/20",
  done:    "ring-2 ring-green-400/60 shadow-lg shadow-green-400/20",
  error:   "ring-2 ring-red-400/60 shadow-lg shadow-red-400/20",
};

export const STATUS_DOT: Record<string, string> = {
  idle:    "bg-white/20",
  running: "bg-amber-400 animate-pulse",
  done:    "bg-green-400",
  error:   "bg-red-400",
};

// Node dimensions (used for edge calculations)
export const NODE_W = 220;
export const NODE_H = 90; // approximate, varies

interface CanvasNodeProps {
  step: WorkflowStep;
  selected: boolean;
  connecting: boolean; // currently being used as edge source
  onMouseDown: (e: React.MouseEvent, id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (step: WorkflowStep) => void;
  onPortMouseDown: (e: React.MouseEvent, fromId: string, port: "default" | "yes" | "no") => void;
  onPortMouseUp: (e: React.MouseEvent, toId: string) => void;
}

export function CanvasNode({
  step, selected, connecting,
  onMouseDown, onDelete, onEdit,
  onPortMouseDown, onPortMouseUp,
}: CanvasNodeProps) {
  const meta = NODE_META[step.type];
  const Icon = meta.icon;
  const isCondition = step.type === "condition";

  return (
    <div
      style={{ position: "absolute", left: step.x, top: step.y, width: NODE_W }}
      className={cn(
        "rounded-2xl border cursor-grab active:cursor-grabbing select-none transition-shadow duration-150",
        "bg-[#141820]",
        meta.border,
        selected && "ring-2 ring-blue-400/70 shadow-xl shadow-blue-500/10",
        step.status && STATUS_RING[step.status],
        connecting && "ring-2 ring-orange-400/60"
      )}
      onMouseDown={(e) => onMouseDown(e, step.id)}
      onMouseUp={(e) => onPortMouseUp(e, step.id)}
    >
      {/* Header */}
      <div className={cn("flex items-center gap-2 px-3 py-2 rounded-t-2xl", meta.headerBg)}>
        <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0", meta.bg)}>
          <Icon className={cn("w-3.5 h-3.5", meta.color)} />
        </div>
        <span className={cn("text-[10px] font-bold uppercase tracking-widest flex-1 truncate", meta.color)}>
          {meta.label}
        </span>
        {/* Status dot */}
        {step.status && (
          <span className={cn("w-2 h-2 rounded-full flex-shrink-0", STATUS_DOT[step.status])} />
        )}
        {/* Actions */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 node-actions">
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onEdit(step); }}
            className="w-5 h-5 rounded flex items-center justify-center hover:bg-white/10 text-white/40 hover:text-white transition-colors"
          >
            <Settings2 className="w-3 h-3" />
          </button>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onDelete(step.id); }}
            className="w-5 h-5 rounded flex items-center justify-center hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-3 py-2.5">
        <p className="text-xs font-semibold text-white leading-snug truncate">{step.label}</p>
        <p className="text-[10px] text-white/40 mt-0.5 leading-relaxed line-clamp-2">{step.description}</p>

        {/* Config preview */}
        {Object.keys(step.config).length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {Object.entries(step.config).slice(0, 2).map(([k, v]) => (
              <span key={k} className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] text-white/40 border border-white/5 truncate max-w-[90px]">
                {v}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Input port (top center) */}
      {step.type !== "trigger" && (
        <div
          className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#141820] border-2 border-white/20 hover:border-blue-400 hover:bg-blue-400/20 transition-colors cursor-crosshair z-10 flex items-center justify-center"
          onMouseUp={(e) => { e.stopPropagation(); onPortMouseUp(e, step.id); }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
        </div>
      )}

      {/* Output port(s) (bottom) */}
      {isCondition ? (
        <>
          {/* Yes branch */}
          <div
            className="absolute -bottom-2.5 left-1/4 -translate-x-1/2 w-4 h-4 rounded-full bg-[#141820] border-2 border-green-500/50 hover:border-green-400 hover:bg-green-400/20 transition-colors cursor-crosshair z-10 flex items-center justify-center group/port"
            onMouseDown={(e) => { e.stopPropagation(); onPortMouseDown(e, step.id, "yes"); }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400/60" />
            <span className="absolute -bottom-4 text-[8px] text-green-400 font-bold whitespace-nowrap">YES</span>
          </div>
          {/* No branch */}
          <div
            className="absolute -bottom-2.5 left-3/4 -translate-x-1/2 w-4 h-4 rounded-full bg-[#141820] border-2 border-red-500/50 hover:border-red-400 hover:bg-red-400/20 transition-colors cursor-crosshair z-10 flex items-center justify-center group/port"
            onMouseDown={(e) => { e.stopPropagation(); onPortMouseDown(e, step.id, "no"); }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400/60" />
            <span className="absolute -bottom-4 text-[8px] text-red-400 font-bold whitespace-nowrap">NO</span>
          </div>
        </>
      ) : (
        <div
          className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#141820] border-2 border-white/20 hover:border-orange-400 hover:bg-orange-400/20 transition-colors cursor-crosshair z-10 flex items-center justify-center"
          onMouseDown={(e) => { e.stopPropagation(); onPortMouseDown(e, step.id, "default"); }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
        </div>
      )}
    </div>
  );
}
