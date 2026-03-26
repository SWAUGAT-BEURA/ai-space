import type { TaskSheet, Workflow } from "@/types/workflow";

// ─── Workflows ────────────────────────────────────────────────────────────────

export const mockWorkflows: Workflow[] = [
  {
    id: "wf-1",
    name: "Client Onboarding",
    description: "Automate new client intake from email to contract",
    status: "active",
    runs: 14,
    lastRun: "2 hrs ago",
    edges: [
      { id: "e1", fromId: "s1", toId: "s2" },
      { id: "e2", fromId: "s2", toId: "s3" },
      { id: "e3", fromId: "s3", toId: "s4" },
      { id: "e4", fromId: "s4", toId: "s5", fromPort: "yes" },
      { id: "e5", fromId: "s5", toId: "s6" },
      { id: "e6", fromId: "s6", toId: "s7" },
    ],
    steps: [
      { id: "s1", type: "trigger",   x: 80,  y: 80,  label: "New Email Received",      description: "Triggers when a new client email arrives",          config: { source: "Gmail", filter: "subject:onboarding" }, status: "done" },
      { id: "s2", type: "llm_agent", x: 80,  y: 240, label: "Extract Client Info",      description: "Research Agent parses name, company, requirements", config: { agent: "Research Agent", prompt: "Extract client details" }, status: "done" },
      { id: "s3", type: "code",      x: 80,  y: 400, label: "Create CRM Record",        description: "POST to CRM API with extracted data",               config: { language: "javascript", snippet: "await crm.create(data)" }, status: "done" },
      { id: "s4", type: "condition", x: 80,  y: 560, label: "Budget > $5,000?",         description: "Route based on project budget",                     config: { field: "budget", operator: ">", value: "5000" }, status: "idle" },
      { id: "s5", type: "llm_agent", x: 80,  y: 720, label: "Draft Welcome Email",      description: "Personal Assistant drafts personalised reply",      config: { agent: "Personal Assistant", tone: "professional" }, status: "idle" },
      { id: "s6", type: "approval",  x: 80,  y: 880, label: "Human Approval",           description: "Wait for team lead to approve before sending",     config: { approver: "team_lead", timeout: "24h" }, status: "idle" },
      { id: "s7", type: "action",    x: 80,  y: 1040,label: "Send Email + Create Task", description: "Send reply and add follow-up task to sheet",       config: { action: "send_email,create_task" }, status: "idle" },
    ],
  },
  {
    id: "wf-2",
    name: "Invoice Processing",
    description: "Auto-generate and send invoices on task completion",
    status: "active",
    runs: 22,
    lastRun: "30 min ago",
    edges: [
      { id: "e1", fromId: "s1", toId: "s2" },
      { id: "e2", fromId: "s2", toId: "s3" },
      { id: "e3", fromId: "s3", toId: "s4" },
    ],
    steps: [
      { id: "s1", type: "trigger",   x: 80, y: 80,  label: "Task Marked Done",         description: "Fires when a billable task is completed",  config: { sheet: "any", status: "done", tag: "billable" }, status: "done" },
      { id: "s2", type: "code",      x: 80, y: 240, label: "Calculate Invoice Amount",  description: "Sum hours × rate from task metadata",     config: { language: "javascript", snippet: "const total = hours * rate" }, status: "done" },
      { id: "s3", type: "llm_agent", x: 80, y: 400, label: "Generate Invoice PDF",      description: "Document Agent creates formatted invoice", config: { agent: "Document Agent", template: "invoice_v2" }, status: "idle" },
      { id: "s4", type: "action",    x: 80, y: 560, label: "Send + Log to Ledger",      description: "Email invoice and record in Finance Ledger", config: { action: "send_email,ledger_entry" }, status: "idle" },
    ],
  },
  {
    id: "wf-3",
    name: "Research Briefing",
    description: "Daily AI research digest delivered to your inbox",
    status: "draft",
    runs: 0,
    lastRun: "Never",
    edges: [
      { id: "e1", fromId: "s1", toId: "s2" },
      { id: "e2", fromId: "s2", toId: "s3" },
      { id: "e3", fromId: "s3", toId: "s4" },
    ],
    steps: [
      { id: "s1", type: "trigger",   x: 80, y: 80,  label: "Schedule: 8 AM Daily",   description: "Cron trigger every morning",                      config: { cron: "0 8 * * *" }, status: "idle" },
      { id: "s2", type: "llm_agent", x: 80, y: 240, label: "Research Agent Query",    description: "Fetch top news and insights for your profession", config: { agent: "Research Agent", topics: "medical,legal,finance" }, status: "idle" },
      { id: "s3", type: "llm_agent", x: 80, y: 400, label: "Summarise & Prioritise",  description: "Personal Assistant ranks by relevance",           config: { agent: "Personal Assistant", format: "bullet_points" }, status: "idle" },
      { id: "s4", type: "action",    x: 80, y: 560, label: "Send Briefing Email",     description: "Deliver digest to your inbox",                   config: { action: "send_email", template: "daily_briefing" }, status: "idle" },
    ],
  },
];

// ─── Task Sheets ──────────────────────────────────────────────────────────────

export const mockSheets: TaskSheet[] = [
  {
    id: "sheet-1",
    name: "Client Onboarding",
    description: "Track all new client intake tasks",
    color: "blue",
    icon: "🤝",
    workflowId: "wf-1",
    createdAt: "2026-03-01",
    tasks: [
      { id: "t1", title: "Send welcome email to Acme Corp",       status: "done",        priority: "high",   assignee: "You", dueDate: "2026-03-25", tags: ["email", "billable"] },
      { id: "t2", title: "Collect signed NDA",                    status: "in_progress", priority: "high",   assignee: "You", dueDate: "2026-03-27", tags: ["legal"] },
      { id: "t3", title: "Schedule kickoff call",                 status: "todo",        priority: "medium", assignee: "You", dueDate: "2026-03-28", tags: ["meeting"] },
      { id: "t4", title: "Set up project workspace",              status: "todo",        priority: "low",    assignee: "You", dueDate: "2026-03-30", tags: [] },
      { id: "t5", title: "Create CRM record",                     status: "done",        priority: "medium", assignee: "AI",  dueDate: "2026-03-25", tags: ["automated"] },
    ],
  },
  {
    id: "sheet-2",
    name: "Invoice & Billing",
    description: "Manage all billing tasks and payment follow-ups",
    color: "emerald",
    icon: "💰",
    workflowId: "wf-2",
    createdAt: "2026-03-05",
    tasks: [
      { id: "t1", title: "Generate March invoice — LegalEase",    status: "in_progress", priority: "high",   assignee: "AI",  dueDate: "2026-03-28", tags: ["billable", "automated"] },
      { id: "t2", title: "Follow up on overdue payment — Acme",   status: "todo",        priority: "high",   assignee: "You", dueDate: "2026-03-27", tags: ["urgent"] },
      { id: "t3", title: "Reconcile Q1 expenses",                 status: "todo",        priority: "medium", assignee: "You", dueDate: "2026-03-31", tags: ["finance"] },
      { id: "t4", title: "Update billing rates for 2026",         status: "done",        priority: "low",    assignee: "You", dueDate: "2026-03-20", tags: [] },
    ],
  },
  {
    id: "sheet-3",
    name: "Research Projects",
    description: "Active research tasks and literature reviews",
    color: "cyan",
    icon: "🔬",
    workflowId: "wf-3",
    createdAt: "2026-03-10",
    tasks: [
      { id: "t1", title: "Literature review: preventive cardiology", status: "in_progress", priority: "high",   assignee: "AI",  dueDate: "2026-04-01", tags: ["research"] },
      { id: "t2", title: "Summarise 5 key papers",                   status: "todo",        priority: "medium", assignee: "AI",  dueDate: "2026-04-03", tags: ["automated"] },
      { id: "t3", title: "Draft abstract for conference",            status: "todo",        priority: "high",   assignee: "You", dueDate: "2026-04-05", tags: ["writing"] },
    ],
  },
  {
    id: "sheet-4",
    name: "Personal Admin",
    description: "Day-to-day personal and admin tasks",
    color: "purple",
    icon: "📋",
    workflowId: null,
    createdAt: "2026-03-15",
    tasks: [
      { id: "t1", title: "File Q1 tax return",         status: "todo", priority: "high",   assignee: "You", dueDate: "2026-03-31", tags: ["tax", "urgent"] },
      { id: "t2", title: "Renew professional licence", status: "todo", priority: "medium", assignee: "You", dueDate: "2026-04-15", tags: [] },
      { id: "t3", title: "Book annual health check",   status: "done", priority: "low",    assignee: "You", dueDate: "2026-03-20", tags: ["health"] },
    ],
  },
];
