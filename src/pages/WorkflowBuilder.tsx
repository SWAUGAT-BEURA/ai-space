import { useState, useCallback, useRef, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import {
  ArrowLeft, Play, Save, ZoomIn, ZoomOut, Maximize2,
  CheckCircle, AlertCircle, Loader2, Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CanvasNode, NODE_META, NODE_W, NODE_H } from "@/components/workflow/CanvasNode";
import { EdgeLayer } from "@/components/workflow/EdgeLayer";
import { NodePalette } from "@/components/workflow/NodePalette";
import { StepEditModal } from "@/components/workflow/StepEditModal";
import { mockWorkflows, mockSheets } from "@/data/mockData";
import type { WorkflowStep, WorkflowEdge, StepType, Workflow } from "@/types/workflow";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeStep(type: StepType, x: number, y: number): WorkflowStep {
  const defaults: Record<StepType, Partial<WorkflowStep>> = {
    trigger:   { label: "New Trigger",      description: "Configure when this workflow starts", config: { source: "manual" } },
    llm_agent: { label: "AI Agent Step",    description: "Run an AI agent on the current data", config: { agent: "Research Agent", prompt: "" } },
    code:      { label: "Code Step",        description: "Execute custom logic",                config: { language: "javascript", snippet: "" } },
    condition: { label: "Check Condition",  description: "Branch based on a value",             config: { field: "", operator: ">", value: "" } },
    action:    { label: "Perform Action",   description: "Execute an output action",            config: { action: "send_email" } },
    delay:     { label: "Wait",             description: "Pause before continuing",             config: { duration: "1", unit: "hours" } },
    approval:  { label: "Request Approval", description: "Wait for human sign-off",            config: { approver: "team_lead", timeout: "24h" } },
  };
  return { id: `step-${Date.now()}-${Math.random().toString(36).slice(2,6)}`, type, x, y, status: "idle", ...defaults[type] } as WorkflowStep;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function WorkflowBuilder() {
  const { workflowId } = useParams<{ workflowId?: string }>();
  const [searchParams] = useSearchParams();
  const sheetId = searchParams.get("sheet");

  const sourceWf = (workflowId && workflowId !== "new") ? mockWorkflows.find((w) => w.id === workflowId) : null;
  const sheet = sheetId ? mockSheets.find((s) => s.id === sheetId) : null;

  const [workflow, setWorkflow] = useState<Workflow>(
    sourceWf ?? {
      id: `wf-${Date.now()}`,
      name: sheet ? `${sheet.name} Workflow` : "New Workflow",
      description: "Describe what this workflow does",
      status: "draft",
      runs: 0,
      lastRun: "Never",
      steps: [],
      edges: [],
    }
  );

  // ── Canvas pan/zoom state ────────────────────────────────────────────────────
  const canvasRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 60, y: 60 });
  const [zoom, setZoom] = useState(1);
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  // ── Node drag state ──────────────────────────────────────────────────────────
  const draggingNode = useRef<{ id: string; startX: number; startY: number; nodeX: number; nodeY: number } | null>(null);

  // ── Edge drawing state ───────────────────────────────────────────────────────
  const [pendingEdge, setPendingEdge] = useState<{ fromId: string; fromPort: "default" | "yes" | "no"; x: number; y: number } | null>(null);

  // ── Selection ────────────────────────────────────────────────────────────────
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingStep, setEditingStep] = useState<WorkflowStep | null>(null);

  // ── Run simulation ───────────────────────────────────────────────────────────
  const [runState, setRunState] = useState<"idle" | "running" | "done" | "error">("idle");
  const [saved, setSaved] = useState(false);

  // ── Palette drag type ────────────────────────────────────────────────────────
  const dragType = useRef<StepType | null>(null);

  // ─── Canvas mouse events ─────────────────────────────────────────────────────

  const canvasToWorld = useCallback((clientX: number, clientY: number) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: (clientX - rect.left - pan.x) / zoom,
      y: (clientY - rect.top  - pan.y) / zoom,
    };
  }, [pan, zoom]);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      // Middle click or alt+drag = pan
      isPanning.current = true;
      panStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
      e.preventDefault();
      return;
    }
    if (e.target === canvasRef.current || (e.target as HTMLElement).dataset.canvas) {
      setSelectedId(null);
      setPendingEdge(null);
    }
  }, [pan]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning.current) {
      setPan({
        x: panStart.current.panX + (e.clientX - panStart.current.x),
        y: panStart.current.panY + (e.clientY - panStart.current.y),
      });
      return;
    }
    if (draggingNode.current) {
      const dx = (e.clientX - draggingNode.current.startX) / zoom;
      const dy = (e.clientY - draggingNode.current.startY) / zoom;
      setWorkflow((prev) => ({
        ...prev,
        steps: prev.steps.map((s) =>
          s.id === draggingNode.current!.id
            ? { ...s, x: Math.max(0, draggingNode.current!.nodeX + dx), y: Math.max(0, draggingNode.current!.nodeY + dy) }
            : s
        ),
      }));
    }
    if (pendingEdge) {
      const world = canvasToWorld(e.clientX, e.clientY);
      setPendingEdge((p) => p ? { ...p, x: world.x, y: world.y } : null);
    }
  }, [zoom, pendingEdge, canvasToWorld]);

  const handleCanvasMouseUp = useCallback(() => {
    isPanning.current = false;
    draggingNode.current = null;
    if (pendingEdge) setPendingEdge(null);
  }, [pendingEdge]);

  // ── Wheel zoom ───────────────────────────────────────────────────────────────

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((z) => Math.min(2, Math.max(0.3, z * delta)));
  }, []);

  // ── Node drag ────────────────────────────────────────────────────────────────

  const handleNodeMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    if ((e.target as HTMLElement).closest(".node-actions")) return;
    e.stopPropagation();
    setSelectedId(id);
    const step = workflow.steps.find((s) => s.id === id)!;
    draggingNode.current = { id, startX: e.clientX, startY: e.clientY, nodeX: step.x, nodeY: step.y };
  }, [workflow.steps]);

  // ── Port connections ─────────────────────────────────────────────────────────

  const handlePortMouseDown = useCallback((e: React.MouseEvent, fromId: string, port: "default" | "yes" | "no") => {
    e.stopPropagation();
    const world = canvasToWorld(e.clientX, e.clientY);
    setPendingEdge({ fromId, fromPort: port, x: world.x, y: world.y });
  }, [canvasToWorld]);

  const handlePortMouseUp = useCallback((e: React.MouseEvent, toId: string) => {
    if (!pendingEdge || pendingEdge.fromId === toId) { setPendingEdge(null); return; }
    // Avoid duplicate edges
    const exists = workflow.edges.some((ed) => ed.fromId === pendingEdge.fromId && ed.toId === toId && ed.fromPort === pendingEdge.fromPort);
    if (!exists) {
      setWorkflow((prev) => ({
        ...prev,
        edges: [...prev.edges, { id: `e-${Date.now()}`, fromId: pendingEdge.fromId, toId, fromPort: pendingEdge.fromPort }],
      }));
    }
    setPendingEdge(null);
  }, [pendingEdge, workflow.edges]);

  // ── Palette drop onto canvas ─────────────────────────────────────────────────

  const handlePaletteDragStart = useCallback((e: React.DragEvent, type: StepType) => {
    dragType.current = type;
    e.dataTransfer.effectAllowed = "copy";
  }, []);

  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!dragType.current) return;
    const world = canvasToWorld(e.clientX, e.clientY);
    const step = makeStep(dragType.current, world.x - NODE_W / 2, world.y - 40);
    setWorkflow((prev) => ({ ...prev, steps: [...prev.steps, step] }));
    dragType.current = null;
  }, [canvasToWorld]);

  const handleCanvasDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; };

  // ── Add from palette click ───────────────────────────────────────────────────

  const addStep = useCallback((type: StepType) => {
    const count = workflow.steps.length;
    const step = makeStep(type, 80 + (count % 4) * 260, 80 + Math.floor(count / 4) * 180);
    setWorkflow((prev) => ({ ...prev, steps: [...prev.steps, step] }));
  }, [workflow.steps.length]);

  // ── Delete ───────────────────────────────────────────────────────────────────

  const deleteStep = useCallback((id: string) => {
    setWorkflow((prev) => ({
      ...prev,
      steps: prev.steps.filter((s) => s.id !== id),
      edges: prev.edges.filter((e) => e.fromId !== id && e.toId !== id),
    }));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const deleteEdge = useCallback((id: string) => {
    setWorkflow((prev) => ({ ...prev, edges: prev.edges.filter((e) => e.id !== id) }));
  }, []);

  const saveStep = useCallback((updated: WorkflowStep) => {
    setWorkflow((prev) => ({ ...prev, steps: prev.steps.map((s) => s.id === updated.id ? updated : s) }));
  }, []);

  // ── Keyboard delete ──────────────────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        deleteStep(selectedId);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedId, deleteStep]);

  // ── Simulate run ─────────────────────────────────────────────────────────────

  const simulateRun = () => {
    if (workflow.steps.length === 0) return;
    setRunState("running");
    setWorkflow((prev) => ({ ...prev, steps: prev.steps.map((s) => ({ ...s, status: "idle" })) }));
    workflow.steps.forEach((_, i) => {
      setTimeout(() => {
        setWorkflow((prev) => ({
          ...prev,
          steps: prev.steps.map((s, idx) =>
            idx === i ? { ...s, status: "running" } : idx < i ? { ...s, status: "done" } : s
          ),
        }));
      }, i * 800);
      if (i === workflow.steps.length - 1) {
        setTimeout(() => {
          setWorkflow((prev) => ({ ...prev, steps: prev.steps.map((s) => ({ ...s, status: "done" })) }));
          setRunState("done");
          setTimeout(() => { setRunState("idle"); setWorkflow((prev) => ({ ...prev, steps: prev.steps.map((s) => ({ ...s, status: "idle" })) })); }, 3000);
        }, (i + 1) * 800);
      }
    });
  };

  const fitView = () => { setPan({ x: 60, y: 60 }); setZoom(1); };

  const runIcon = { idle: <Play className="w-4 h-4" />, running: <Loader2 className="w-4 h-4 animate-spin" />, done: <CheckCircle className="w-4 h-4" />, error: <AlertCircle className="w-4 h-4" /> }[runState];
  const runLabel = { idle: "Test Run", running: "Running…", done: "Done ✓", error: "Error" }[runState];

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col overflow-hidden bg-[#0d1117]">

      {/* ── Top bar ── */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/5 bg-[#141820] flex-shrink-0 z-20">
        <Link
          to={sheetId ? `/tasks/${sheetId}` : "/tasks"}
          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <div className="flex-1 min-w-0">
          <input
            value={workflow.name}
            onChange={(e) => setWorkflow((p) => ({ ...p, name: e.target.value }))}
            className="bg-transparent text-sm font-semibold text-white outline-none w-full placeholder:text-white/30"
            placeholder="Workflow name…"
          />
          <input
            value={workflow.description}
            onChange={(e) => setWorkflow((p) => ({ ...p, description: e.target.value }))}
            className="bg-transparent text-[11px] text-white/40 outline-none w-full mt-0.5 placeholder:text-white/20"
            placeholder="Description…"
          />
        </div>

        {sheet && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-white/50">
            <span>{sheet.icon}</span>
            <span>{sheet.name}</span>
          </div>
        )}

        <span className={cn(
          "px-2.5 py-1 rounded-lg text-[11px] font-semibold border",
          workflow.status === "active" ? "bg-green-500/10 text-green-400 border-green-500/20"
          : workflow.status === "draft" ? "bg-white/5 text-white/40 border-white/10"
          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
        )}>
          {workflow.status}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={simulateRun}
            disabled={runState === "running" || workflow.steps.length === 0}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all",
              runState === "done" ? "bg-green-500/10 text-green-400 border-green-500/20"
              : "bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20 disabled:opacity-30"
            )}
          >
            {runIcon} {runLabel}
          </button>
          <button
            onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all",
              saved ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20"
            )}
          >
            <Save className="w-3.5 h-3.5" /> {saved ? "Saved!" : "Save"}
          </button>
        </div>
      </div>

      {/* ── Main area ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left palette */}
        <div className="w-52 flex-shrink-0 border-r border-white/5 bg-[#141820] overflow-hidden">
          <NodePalette onDragStart={handlePaletteDragStart} onAdd={addStep} />
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="flex-1 relative overflow-hidden"
          style={{
            background: "radial-gradient(circle, #1e2330 1px, transparent 1px)",
            backgroundSize: `${28 * zoom}px ${28 * zoom}px`,
            backgroundPosition: `${pan.x % (28 * zoom)}px ${pan.y % (28 * zoom)}px`,
            cursor: isPanning.current ? "grabbing" : "default",
          }}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          onWheel={handleWheel}
          onDrop={handleCanvasDrop}
          onDragOver={handleCanvasDragOver}
          data-canvas="true"
        >
          {/* Transformed world */}
          <div
            style={{
              position: "absolute",
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "0 0",
              width: 4000,
              height: 4000,
            }}
          >
            {/* SVG edges */}
            <EdgeLayer
              steps={workflow.steps}
              edges={workflow.edges}
              pendingEdge={pendingEdge}
              onDeleteEdge={deleteEdge}
            />

            {/* Nodes */}
            {workflow.steps.map((step) => (
              <CanvasNode
                key={step.id}
                step={step}
                selected={selectedId === step.id}
                connecting={pendingEdge?.fromId === step.id}
                onMouseDown={handleNodeMouseDown}
                onDelete={deleteStep}
                onEdit={setEditingStep}
                onPortMouseDown={handlePortMouseDown}
                onPortMouseUp={handlePortMouseUp}
              />
            ))}

            {/* Empty state */}
            {workflow.steps.length === 0 && (
              <div
                style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
                className="text-center pointer-events-none"
                data-canvas="true"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-white/40 mb-1">Drop nodes here to build your workflow</p>
                <p className="text-xs text-white/20">Drag from the left panel · Connect ports to wire nodes · Alt+drag to pan</p>
              </div>
            )}
          </div>

          {/* ── Canvas controls (bottom right) ── */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 z-10">
            <button onClick={() => setZoom((z) => Math.min(2, z * 1.2))} className="w-8 h-8 rounded-lg bg-[#141820] border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button onClick={() => setZoom((z) => Math.max(0.3, z * 0.8))} className="w-8 h-8 rounded-lg bg-[#141820] border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors">
              <ZoomOut className="w-4 h-4" />
            </button>
            <button onClick={fitView} className="w-8 h-8 rounded-lg bg-[#141820] border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom indicator */}
          <div className="absolute bottom-4 left-4 px-2 py-1 rounded-lg bg-[#141820] border border-white/10 text-[10px] text-white/30 font-mono z-10">
            {Math.round(zoom * 100)}%
          </div>

          {/* Node count */}
          <div className="absolute top-3 right-3 flex items-center gap-3 z-10">
            <span className="px-2 py-1 rounded-lg bg-[#141820] border border-white/10 text-[10px] text-white/30">
              {workflow.steps.length} nodes · {workflow.edges.length} connections
            </span>
            {selectedId && (
              <button
                onClick={() => deleteStep(selectedId)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-medium hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="w-3 h-3" /> Delete selected
              </button>
            )}
          </div>

          {/* Instructions overlay */}
          <div className="absolute top-3 left-3 z-10 space-y-1">
            {[
              "Drag nodes from left panel",
              "Drag output port → input port to connect",
              "Click edge × to delete it",
              "Alt + drag canvas to pan",
              "Scroll to zoom",
            ].map((tip) => (
              <div key={tip} className="px-2 py-0.5 rounded bg-[#141820]/80 text-[9px] text-white/25 border border-white/5">
                {tip}
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — selected node inspector */}
        {selectedId && (() => {
          const step = workflow.steps.find((s) => s.id === selectedId);
          if (!step) return null;
          const meta = NODE_META[step.type];
          const Icon = meta.icon;
          return (
            <div className="w-56 flex-shrink-0 border-l border-white/5 bg-[#141820] overflow-y-auto">
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", meta.bg)}>
                    <Icon className={cn("w-3.5 h-3.5", meta.color)} />
                  </div>
                  <div>
                    <p className={cn("text-[10px] font-bold uppercase tracking-wider", meta.color)}>{meta.label}</p>
                    <p className="text-xs font-semibold text-white truncate">{step.label}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/30">Config</p>
                  {Object.entries(step.config).map(([k, v]) => (
                    <div key={k}>
                      <p className="text-[9px] text-white/30 mb-0.5 capitalize">{k}</p>
                      <p className="text-[11px] text-white/70 bg-white/5 rounded-lg px-2 py-1.5 border border-white/5 break-all">{v || "—"}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setEditingStep(step)}
                  className="w-full py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold hover:bg-blue-500/20 transition-colors"
                >
                  Edit Step
                </button>
                <button
                  onClick={() => deleteStep(selectedId)}
                  className="w-full py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-colors"
                >
                  Delete Node
                </button>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Edit modal */}
      <StepEditModal step={editingStep} onSave={saveStep} onClose={() => setEditingStep(null)} />
    </div>
  );
}
