import { NODE_META } from "./CanvasNode";
import type { StepType } from "@/types/workflow";
import { cn } from "@/lib/utils";

interface NodePaletteProps {
  onDragStart: (e: React.DragEvent, type: StepType) => void;
  onAdd: (type: StepType) => void;
}

const GROUPS: { label: string; types: StepType[] }[] = [
  { label: "Start",      types: ["trigger"] },
  { label: "AI / Logic", types: ["llm_agent", "condition"] },
  { label: "Code",       types: ["code"] },
  { label: "Control",    types: ["delay", "approval"] },
  { label: "Output",     types: ["action"] },
];

export function NodePalette({ onDragStart, onAdd }: NodePaletteProps) {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-4 pt-4 pb-2 border-b border-white/5">
        <p className="text-xs font-bold text-white">Node Types</p>
        <p className="text-[10px] text-white/40 mt-0.5">Drag onto canvas or click to add</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {GROUPS.map((group) => (
          <div key={group.label}>
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 px-1 mb-1.5">{group.label}</p>
            <div className="space-y-1.5">
              {group.types.map((type) => {
                const meta = NODE_META[type];
                const Icon = meta.icon;
                return (
                  <div
                    key={type}
                    draggable
                    onDragStart={(e) => onDragStart(e, type)}
                    onClick={() => onAdd(type)}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2.5 rounded-xl border cursor-grab active:cursor-grabbing",
                      "bg-[#141820] hover:bg-white/5 transition-all select-none",
                      meta.border,
                      "hover:shadow-lg",
                      `hover:${meta.glow}`
                    )}
                  >
                    <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0", meta.bg)}>
                      <Icon className={cn("w-3.5 h-3.5", meta.color)} />
                    </div>
                    <div className="min-w-0">
                      <p className={cn("text-xs font-semibold leading-none", meta.color)}>{meta.label}</p>
                      <p className="text-[9px] text-white/30 mt-0.5 leading-tight truncate">{meta.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
