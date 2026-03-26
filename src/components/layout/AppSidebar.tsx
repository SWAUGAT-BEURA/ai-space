import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard, Search, CheckSquare, Wallet,
  FileText, Mail, Zap, Database, Bot,
  Sparkles, Users, Plus, GitBranch
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navGroups = [
  {
    label: "Core",
    items: [
      { title: "Dashboard", url: "/",        icon: LayoutDashboard, color: "text-blue-400",    dot: "bg-blue-400" },
      { title: "Agents",    url: "/agents",  icon: Bot,             color: "text-purple-400",  dot: "bg-purple-400" },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { title: "Research",  url: "/research", icon: Search,      color: "text-cyan-400",    dot: "bg-cyan-400" },
    ],
  },
  {
    label: "Productivity",
    items: [
      { title: "Tasks",     url: "/tasks",     icon: CheckSquare, color: "text-green-400",   dot: "bg-green-400" },
      { title: "Email",     url: "/email",     icon: Mail,        color: "text-amber-400",   dot: "bg-amber-400" },
      { title: "Documents", url: "/documents", icon: FileText,    color: "text-pink-400",    dot: "bg-pink-400" },
    ],
  },
  {
    label: "Finance",
    items: [
      { title: "Ledger",    url: "/ledger",    icon: Wallet,      color: "text-emerald-400", dot: "bg-emerald-400" },
    ],
  },
  {
    label: "Execution",
    items: [
      { title: "Automation", url: "/automation", icon: Zap,      color: "text-orange-400",  dot: "bg-orange-400" },
      { title: "Memory",     url: "/memory",     icon: Database, color: "text-violet-400",  dot: "bg-violet-400" },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-white/5">
      <SidebarContent className="pt-3 pb-4">

        {/* Logo */}
        <div className={cn("px-3 pb-5 flex items-center gap-3", collapsed && "justify-center")}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <span className="text-base font-bold text-white tracking-tight">ProAI</span>
              <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Workspace</p>
            </div>
          )}
        </div>

        {/* Nav groups */}
        {navGroups.map((group) => (
          <SidebarGroup key={group.label} className="py-0.5">
            {!collapsed && (
              <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 px-3 mb-0.5">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = item.url === "/"
                    ? location.pathname === "/"
                    : location.pathname === item.url || location.pathname.startsWith(item.url + "/");
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link
                          to={item.url}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 group relative",
                            isActive
                              ? "bg-white/10 text-white"
                              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                          )}
                        >
                          {isActive && (
                            <span className={cn("absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full", item.dot)} />
                          )}
                          <item.icon className={cn("w-4 h-4 flex-shrink-0", isActive ? item.color : "group-hover:text-foreground")} />
                          {!collapsed && (
                            <span className="flex-1 font-medium">{item.title}</span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* Quick Create */}
        {!collapsed && (
          <SidebarGroup className="py-0.5 mt-3">
            <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 px-3 mb-0.5">
              Quick Create
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-2 space-y-0.5">
                <Link
                  to="/tasks"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-green-400 hover:bg-green-500/5 transition-all group"
                >
                  <div className="w-5 h-5 rounded-md bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors flex-shrink-0">
                    <Plus className="w-3 h-3 text-green-400" />
                  </div>
                  New Task Sheet
                </Link>
                <Link
                  to="/workflow/new"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-orange-400 hover:bg-orange-500/5 transition-all group"
                >
                  <div className="w-5 h-5 rounded-md bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors flex-shrink-0">
                    <GitBranch className="w-3 h-3 text-orange-400" />
                  </div>
                  New Workflow
                </Link>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Bottom plan card */}
        {!collapsed && (
          <div className="mt-auto px-3 pt-4">
            <div className="glass rounded-xl p-3 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">Professional Plan</p>
                  <p className="text-[10px] text-muted-foreground">7 agents active</p>
                </div>
              </div>
              <div className="w-full bg-muted/50 rounded-full h-1">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full w-3/5" />
              </div>
              <p className="text-[10px] text-muted-foreground">60% of quota used</p>
            </div>
          </div>
        )}

      </SidebarContent>
    </Sidebar>
  );
}
