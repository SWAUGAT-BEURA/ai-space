// ─── Step Types ───────────────────────────────────────────────────────────────

export type StepType =
  | "trigger"
  | "llm_agent"
  | "code"
  | "condition"
  | "action"
  | "delay"
  | "approval";

export interface WorkflowStep {
  id: string;
  type: StepType;
  label: string;
  description: string;
  config: Record<string, string>;
  // canvas position
  x: number;
  y: number;
  // runtime state
  status?: "idle" | "running" | "done" | "error";
}

// A directed edge between two nodes
export interface WorkflowEdge {
  id: string;
  fromId: string;
  toId: string;
  fromPort?: "yes" | "no" | "default";
}

// ─── Workflow ─────────────────────────────────────────────────────────────────

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  edges: WorkflowEdge[];
  status: "active" | "paused" | "draft";
  runs: number;
  lastRun: string;
}

// ─── Task Sheet ───────────────────────────────────────────────────────────────

export type TaskStatus = "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface SheetTask {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  dueDate: string;
  tags: string[];
}

export interface TaskSheet {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  workflowId: string | null;
  tasks: SheetTask[];
  createdAt: string;
}
