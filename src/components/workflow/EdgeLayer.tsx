import type { WorkflowStep, WorkflowEdge } from "@/types/workflow";
import { NODE_W, NODE_H } from "./CanvasNode";

interface EdgeLayerProps {
  steps: WorkflowStep[];
  edges: WorkflowEdge[];
  pendingEdge: { fromId: string; fromPort: string; x: number; y: number } | null;
  onDeleteEdge: (id: string) => void;
}

function getPortPos(step: WorkflowStep, port: "default" | "yes" | "no" | "input") {
  const cx = step.x + NODE_W / 2;
  const cy = step.y;
  if (port === "input") return { x: cx, y: cy - 10 };
  if (port === "yes")   return { x: step.x + NODE_W * 0.25, y: cy + NODE_H + 10 };
  if (port === "no")    return { x: step.x + NODE_W * 0.75, y: cy + NODE_H + 10 };
  return { x: cx, y: cy + NODE_H + 10 };
}

function bezier(x1: number, y1: number, x2: number, y2: number) {
  const dy = Math.abs(y2 - y1);
  const curve = Math.max(60, dy * 0.5);
  return `M ${x1} ${y1} C ${x1} ${y1 + curve}, ${x2} ${y2 - curve}, ${x2} ${y2}`;
}

const PORT_COLOR: Record<string, string> = {
  yes:     "#4ade80",
  no:      "#f87171",
  default: "#6366f1",
};

export function EdgeLayer({ steps, edges, pendingEdge, onDeleteEdge }: EdgeLayerProps) {
  const stepMap = Object.fromEntries(steps.map((s) => [s.id, s]));

  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" }}
    >
      <defs>
        {["default", "yes", "no"].map((port) => (
          <marker
            key={port}
            id={`arrow-${port}`}
            markerWidth="8" markerHeight="8"
            refX="6" refY="3"
            orient="auto"
          >
            <path d="M0,0 L0,6 L8,3 z" fill={PORT_COLOR[port]} opacity="0.8" />
          </marker>
        ))}
        <marker id="arrow-pending" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#94a3b8" opacity="0.6" />
        </marker>
      </defs>

      {edges.map((edge) => {
        const from = stepMap[edge.fromId];
        const to   = stepMap[edge.toId];
        if (!from || !to) return null;
        const port = edge.fromPort ?? "default";
        const src  = getPortPos(from, port as "default" | "yes" | "no");
        const dst  = getPortPos(to, "input");
        const color = PORT_COLOR[port] ?? PORT_COLOR.default;
        const d = bezier(src.x, src.y, dst.x, dst.y);
        const midX = (src.x + dst.x) / 2;
        const midY = (src.y + dst.y) / 2;

        return (
          <g key={edge.id} style={{ pointerEvents: "all" }}>
            {/* Invisible thick hit area */}
            <path
              d={d}
              fill="none"
              stroke="transparent"
              strokeWidth={12}
              style={{ cursor: "pointer" }}
              onClick={() => onDeleteEdge(edge.id)}
            />
            {/* Visible edge */}
            <path
              d={d}
              fill="none"
              stroke={color}
              strokeWidth={2}
              strokeOpacity={0.7}
              markerEnd={`url(#arrow-${port})`}
            />
            {/* Delete button at midpoint */}
            <g transform={`translate(${midX}, ${midY})`} style={{ cursor: "pointer" }} onClick={() => onDeleteEdge(edge.id)}>
              <circle r={7} fill="#1e2330" stroke={color} strokeWidth={1.5} strokeOpacity={0.5} />
              <text x={0} y={4} textAnchor="middle" fontSize={10} fill={color} opacity={0.7} fontWeight="bold">×</text>
            </g>
          </g>
        );
      })}

      {/* Pending edge while drawing */}
      {pendingEdge && (
        <path
          d={bezier(
            pendingEdge.x, pendingEdge.y,
            pendingEdge.x, pendingEdge.y + 60
          )}
          fill="none"
          stroke="#94a3b8"
          strokeWidth={2}
          strokeDasharray="6 4"
          strokeOpacity={0.5}
          markerEnd="url(#arrow-pending)"
        />
      )}
    </svg>
  );
}
