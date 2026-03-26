import { STEP_META } from "./StepNode";
import type { StepType } from "@/types/workflow";
import { cn } from "@/lib/utils";

interface StepPaletteProps {
  onAdd: (type: StepType) => void;
}

export function StepPalette({ onAdd }: StepPaletteProps) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-1 mb-3">
        Step Types
      </p>
      {(Object.entries(STEP_META) as [StepType, typeof STEP_META[StepType]][]).map(([type, meta]) => {
        const Icon = meta.icon;
        return (
          <button
            key={type}
            onClick={() => onAdd(type)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left group",
              "glass hover:bg-white/5",
              meta.border
            )}
          >
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", meta.bg)}>
              <Icon className={cn("w-4 h-4", meta.color)} />
            </div>
            <div className="min-w-0">
              <p className={cn("text-xs font-semibold", meta.color)}>{meta.label}</p>
              <p className="text-[10px] text-muted-foreground leading-tight">{meta.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
