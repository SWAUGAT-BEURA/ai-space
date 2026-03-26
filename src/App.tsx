import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index.tsx";
import Tasks from "./pages/Tasks.tsx";
import TaskSheet from "./pages/TaskSheet.tsx";
import WorkflowBuilder from "./pages/WorkflowBuilder.tsx";
import Ledger from "./pages/Ledger.tsx";
import Documents from "./pages/Documents.tsx";
import Research from "./pages/Research.tsx";
import Email from "./pages/Email.tsx";
import Automation from "./pages/Automation.tsx";
import Memory from "./pages/Memory.tsx";
import Agents from "./pages/Agents.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/research" element={<Research />} />
            {/* Task sheets */}
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/tasks/:sheetId" element={<TaskSheet />} />
            {/* Workflow builder — create new or edit existing */}
            <Route path="/workflow/new" element={<WorkflowBuilder />} />
            <Route path="/workflow/:workflowId" element={<WorkflowBuilder />} />
            {/* Other pages */}
            <Route path="/ledger" element={<Ledger />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/email" element={<Email />} />
            <Route path="/automation" element={<Automation />} />
            <Route path="/memory" element={<Memory />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
