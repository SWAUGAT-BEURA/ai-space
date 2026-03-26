import { useRef } from "react";
import { motion } from "framer-motion";
import {
  Zap, Brain, Code2, GitBranch, MousePointerClick,
  Clock, ShieldCheck, GripVertical, Trash2, Settings2, ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkflowStep, StepType } from "@/types/workflow";

// ─── Step meta ────────────────────────────────────────────────────────────────

export const STEP_META: Record<StepType, {
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  description: string;
}> = {
  trigger:   { label: "Trigger",    icon: Zap,              color: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/25",  description: "Starts the workflow" },
  llm_agent: { label: "LLM Agent",  icon: Brain,            color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/25", description: "Run an AI agent step" },
  code:      { label: "Code",       icon: Code2,            color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/25",   description: "Execute custom code" },
  condition: { label: "Condition",  icon: GitBranch,        color: "text-cyan-400",   bg: "bg-cyan-500/10",   border: "border-cyan-500/25",   description: "Branch on a condition" },
  action:    { label: "Action",     icon: MousePointerClick,color: "text-green-400",  bg: "bg-green-500/10",  border: "border-green-500/25",  description: "Perform an action" },
  delay:     { label: "Delay",      icon: Clock,            color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/25", description: "Wait before next step" },
  approval:  { label: "Approval",   icon: ShieldCheck,      color: "text-red-400",    bg: "bg-red-500/10",    border: "border-red-500/25",    description: "Require human approval" },
};

// ─── Status dot ───────────────────────────────────────────────────────────────

const statusDot: Record<string, string> = {
  idle:    "bg-muted-foreground",
  running: "bg-amber-400 animate-pulse",
  done:    "bg-green-400",
  error:   "bg-red-400",
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface StepNodeProps {
  step: WorkflowStep;
  index: number;
  isLast: boolean;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent, id: string) => void;
  onDrop: (e: React.DragEvent, id: string) => void;
  onDragEnd: () => void;
  onDelete: (id: string) => void;
  onEdit: (step: WorkflowStep) => void;
  dragOverId: string | null;
}

export function StepNode({
  step, index, isLast, isDragging,
  onDragStart, onDragOver, onDrop, onDragEnd,
  onDelete, onEdit, dragOverId,
}: StepNodeProps) {
  const meta = STEP_META[step.type];
  const Icon = meta.icon;
  const isOver = dragOverId === step.id;

  return (
    <div className="flex flex-col items-center">
      {/* Drop indicator above */}
      <div className={cn("w-full h-0.5 rounded-full mb-2 transition-all duration-150", isOver ? "bg-blue-400 opacity-100" : "opacity-0")} />

      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.04 }}
        draggable
        onDragStart={(e) => onDragStart(e as unknown as React.DragEvent, step.id)}
        onDragOver={(e) => onDragOver(e as unknown as React.DragEvent, step.id)}
        onDrop={(e) => onDrop(e as unknown as React.DragEvent, step.id)}
        onDragEnd={onDragEnd}
        className={cn(
          "w-full glass rounded-2xl border transition-all duration-150 group",
          meta.border,
          isDragging ? "opacity-40 scale-95" : "hover:border-opacity-60",
          isOver && "ring-1 ring-blue-400/40"
        )}
      >
        <div className="flex items-start gap-3 p-4">
          {/* Drag handle */}
          <div className="flex-shrink-0 mt-0.5 cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground transition-colors">
            <GripVertical className="w-4 h-4" />
          </div>

          {/* Step number */}
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-muted-foreground mt-0.5">
            {index + 1}
          </div>

          {/* Icon */}
          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", meta.bg)}>
            <Icon className={cn("w-4 h-4", meta.color)} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={cn("text-[10px] font-semibold uppercase tracking-wider", meta.color)}>{meta.label}</span>
              {step.status && (
                <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", statusDot[step.status])} />
              )}
            </div>
            <p className="text-sm font-semibold text-white leading-snug">{step.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{step.description}</p>

            {/* Config pills */}
            {Object.keys(step.config).length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {Object.entries(step.config).slice(0, 3).map(([k, v]) => (
                  <span key={k} className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-muted-foreground border border-white/5">
                    {k}: <span className="text-foreground">{v}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(step)}
              className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <Settings2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(step.id)}
              className="w-7 h-7 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-muted-foreground hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Connector arrow */}
      {!isLast && (
        <div className="flex flex-col items-center my-1">
          <div className="w-px h-4 bg-white/10" />
          <ChevronDown className="w-3 h-3 text-white/20 -mt-0.5" />
        </div>
      )}
    </div>
  );
}
