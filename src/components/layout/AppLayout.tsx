import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AIChatPanel } from "@/components/chat/AIChatPanel";
import { Bell, Search, Settings } from "lucide-react";
import { useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/":           { title: "Dashboard",       subtitle: "Your AI workspace overview" },
  "/agents":     { title: "Agent Hub",        subtitle: "Manage and monitor your AI agents" },
  "/research":   { title: "Research Agent",   subtitle: "Web search, summarization & knowledge aggregation" },
  "/tasks":      { title: "Task Sheets",      subtitle: "Project sheets each powered by a workflow" },
  "/ledger":     { title: "Finance Ledger",   subtitle: "Track income, expenses and insights" },
  "/documents":  { title: "Document Agent",   subtitle: "Upload, summarize and extract insights" },
  "/email":      { title: "Email Agent",      subtitle: "Read, summarize and draft emails" },
  "/automation": { title: "Automation Agent", subtitle: "Build and manage automated workflows" },
  "/memory":     { title: "Memory Agent",     subtitle: "Preferences, context and personalization" },
};

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const path = location.pathname;

  let page = pageTitles[path];
  if (!page && path.startsWith("/tasks/"))    page = { title: "Task Sheet",       subtitle: "Kanban board with workflow automation" };
  if (!page && path.startsWith("/workflow/")) page = { title: "Workflow Builder",  subtitle: "Visual drag-and-drop workflow canvas" };
  if (!page) page = { title: "ProAI", subtitle: "" };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full mesh-bg dot-grid">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          {/* ── Top bar ── */}
          <header className="h-14 flex items-center justify-between glass-frosted px-5 sticky top-0 z-30 flex-shrink-0">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
              <div className="hidden sm:block">
                <h1 className="text-sm font-semibold text-foreground leading-none">{page.title}</h1>
                <p className="text-[11px] text-muted-foreground mt-0.5">{page.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Search */}
              <button className="w-8 h-8 rounded-xl glass glass-hover flex items-center justify-center text-muted-foreground hover:text-foreground">
                <Search className="w-4 h-4" />
              </button>

              {/* Notifications */}
              <button className="w-8 h-8 rounded-xl glass glass-hover flex items-center justify-center text-muted-foreground hover:text-foreground relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-400 rounded-full ring-1 ring-background" />
              </button>

              {/* Settings */}
              <button className="w-8 h-8 rounded-xl glass glass-hover flex items-center justify-center text-muted-foreground hover:text-foreground">
                <Settings className="w-4 h-4" />
              </button>

              {/* Theme toggle */}
              <ThemeToggle className="mx-1" />

              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-blue-500/20">
                P
              </div>
            </div>
          </header>

          {/* ── Main content ── */}
          <main className="flex-1 p-6 overflow-auto scrollbar-thin">
            {children}
          </main>
        </div>

        <AIChatPanel />
      </div>
    </SidebarProvider>
  );
}
