import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Sparkles, CheckSquare, Reply, Archive, Star, Clock, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  time: string;
  read: boolean;
  starred: boolean;
  summary: string;
  tasks: string[];
  draftReply: string;
}

const initialEmails: Email[] = [
  {
    id: "1", from: "client@acmecorp.com", subject: "Project Proposal Review", time: "10:32 AM", read: false, starred: true,
    preview: "Hi, I've reviewed the proposal and have a few questions about the timeline...",
    summary: "Client is requesting clarification on the project timeline and wants to discuss budget adjustments before signing.",
    tasks: ["Schedule call with client", "Prepare revised timeline", "Update budget estimate"],
    draftReply: "Hi, thank you for reviewing the proposal. I'd be happy to schedule a call to discuss the timeline in detail. Would Thursday at 3 PM work for you?",
  },
  {
    id: "2", from: "accounts@taxportal.gov", subject: "Q1 Tax Filing Reminder", time: "9:15 AM", read: false, starred: false,
    preview: "This is a reminder that Q1 tax filings are due by March 31st...",
    summary: "Official reminder that Q1 tax filing deadline is March 31st. Action required to avoid penalties.",
    tasks: ["File Q1 taxes before March 31", "Gather income documents", "Consult accountant"],
    draftReply: "Thank you for the reminder. I will ensure the filing is completed before the deadline.",
  },
  {
    id: "3", from: "team@workspace.io", subject: "Weekly Team Sync Notes", time: "Yesterday", read: true, starred: false,
    preview: "Here are the notes from yesterday's team sync meeting...",
    summary: "Team sync covered sprint progress, 3 blockers identified, and design review scheduled for next week.",
    tasks: ["Review design mockups", "Resolve blocker #2 (API integration)"],
    draftReply: "Thanks for sharing the notes. I'll take a look at the design mockups and get back to you by EOD.",
  },
  {
    id: "4", from: "newsletter@medjournal.com", subject: "Latest Research in Cardiology", time: "2 days ago", read: true, starred: false,
    preview: "This month's top research papers in cardiology and preventive medicine...",
    summary: "Monthly newsletter with 5 research papers on cardiology. One paper on preventive care is highly relevant to your practice.",
    tasks: ["Read paper on preventive cardiology"],
    draftReply: "",
  },
];

export default function Email() {
  const [emails, setEmails] = useState<Email[]>(initialEmails);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [generatingReply, setGeneratingReply] = useState<string | null>(null);
  const [draftVisible, setDraftVisible] = useState<string | null>(null);

  const unread = emails.filter((e) => !e.read).length;

  const markRead = (id: string) => setEmails((prev) => prev.map((e) => e.id === id ? { ...e, read: true } : e));
  const toggleStar = (id: string) => setEmails((prev) => prev.map((e) => e.id === id ? { ...e, starred: !e.starred } : e));

  const generateReply = (id: string) => {
    setGeneratingReply(id);
    setTimeout(() => {
      setGeneratingReply(null);
      setDraftVisible(id);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div {...fade(0)} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Email Agent</h1>
          <p className="text-sm text-muted-foreground mt-1">{unread} unread · AI summarization & task extraction</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
            {unread} Unread
          </span>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div {...fade(0.05)} className="grid grid-cols-3 gap-4">
        {[
          { label: "Unread", value: unread, color: "text-amber-400", bg: "bg-amber-500/10" },
          { label: "Tasks Found", value: emails.reduce((s, e) => s + e.tasks.length, 0), color: "text-green-400", bg: "bg-green-500/10" },
          { label: "Starred", value: emails.filter((e) => e.starred).length, color: "text-yellow-400", bg: "bg-yellow-500/10" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Email list */}
      <div className="space-y-3">
        {emails.map((email, i) => {
          const isExpanded = expandedId === email.id;
          return (
            <motion.div key={email.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <div className={cn("glass rounded-2xl overflow-hidden border transition-colors", !email.read ? "border-amber-500/20" : "border-white/5")}>
                <button
                  onClick={() => { setExpandedId(isExpanded ? null : email.id); markRead(email.id); }}
                  className="w-full flex items-center gap-4 p-4 text-left"
                >
                  <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", !email.read ? "bg-amber-500/15" : "bg-white/5")}>
                    <Mail className={cn("w-4 h-4", !email.read ? "text-amber-400" : "text-muted-foreground")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={cn("text-sm truncate", !email.read ? "font-semibold text-foreground" : "font-medium text-foreground")}>{email.subject}</p>
                      {!email.read && <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{email.from} · {email.preview}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); toggleStar(email.id); }} className="text-muted-foreground hover:text-yellow-400 transition-colors">
                      <Star className={cn("w-4 h-4", email.starred && "fill-yellow-400 text-yellow-400")} />
                    </button>
                    <span className="text-xs text-muted-foreground">{email.time}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="border-t border-white/5 p-5 space-y-4">
                      {/* AI Summary */}
                      <div className="bg-amber-500/5 rounded-xl p-4 border border-amber-500/15">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">AI Summary</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{email.summary}</p>
                      </div>

                      {/* Extracted tasks */}
                      {email.tasks.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <CheckSquare className="w-3.5 h-3.5 text-green-400" />
                            <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">Extracted Tasks</span>
                          </div>
                          <div className="space-y-1.5">
                            {email.tasks.map((task, j) => (
                              <div key={j} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/5 border border-green-500/15">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                                <span className="text-xs text-foreground">{task}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Draft reply */}
                      {draftVisible === email.id && email.draftReply && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Reply className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Draft Reply</span>
                          </div>
                          <div className="bg-blue-500/5 rounded-xl p-4 border border-blue-500/15">
                            <p className="text-sm text-muted-foreground leading-relaxed">{email.draftReply}</p>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-1">
                        {email.draftReply && (
                          <button
                            onClick={() => generateReply(email.id)}
                            disabled={generatingReply === email.id}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20 hover:bg-blue-500/15 transition-colors disabled:opacity-50"
                          >
                            {generatingReply === email.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Reply className="w-3 h-3" />}
                            Draft Reply
                          </button>
                        )}
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-muted-foreground text-xs font-medium border border-white/10 hover:text-foreground transition-colors">
                          <Archive className="w-3 h-3" /> Archive
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
