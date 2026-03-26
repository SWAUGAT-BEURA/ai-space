import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Image, File, Eye, Sparkles, ChevronDown, ChevronUp, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

interface Document {
  id: string;
  title: string;
  type: "pdf" | "text" | "image";
  summary: string;
  keyPoints: string[];
  uploadedAt: string;
  size: string;
}

const initialDocs: Document[] = [
  {
    id: "1", title: "Q4 Budget Report.pdf", type: "pdf", size: "2.4 MB",
    summary: "Comprehensive budget report covering Q4 2025 expenditures and projections for the upcoming fiscal year.",
    keyPoints: ["Total spend: $124K", "Under budget by 8%", "Marketing highest category", "Recommend 12% increase in R&D"],
    uploadedAt: "2026-03-24",
  },
  {
    id: "2", title: "Client Contract — Acme Corp.txt", type: "text", size: "48 KB",
    summary: "Service agreement between parties covering scope, deliverables, payment terms and termination clauses.",
    keyPoints: ["Contract value: $18,000", "6-month term", "30-day termination notice", "IP ownership: client"],
    uploadedAt: "2026-03-23",
  },
  {
    id: "3", title: "Architecture Diagram.png", type: "image", size: "1.1 MB",
    summary: "System architecture diagram for the new microservices platform with deployment topology.",
    keyPoints: ["5 microservices", "Event-driven architecture", "Kubernetes deployment", "Redis caching layer"],
    uploadedAt: "2026-03-22",
  },
];

const typeConfig = {
  pdf: { icon: FileText, color: "text-red-400", bg: "bg-red-500/10", label: "PDF" },
  text: { icon: File, color: "text-blue-400", bg: "bg-blue-500/10", label: "TXT" },
  image: { icon: Image, color: "text-purple-400", bg: "bg-purple-500/10", label: "IMG" },
};

export default function Documents() {
  const [docs] = useState<Document[]>(initialDocs);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = docs.filter((d) => d.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div {...fade(0)} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Documents</h1>
          <p className="text-sm text-muted-foreground mt-1">{docs.length} files · AI-powered summaries</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm font-medium hover:bg-pink-500/15 transition-colors">
          <Upload className="w-4 h-4" /> Upload
        </button>
      </motion.div>

      {/* Upload zone */}
      <motion.div {...fade(0.05)}>
        <div className="glass rounded-2xl border-2 border-dashed border-white/10 hover:border-pink-500/30 transition-colors p-10 text-center cursor-pointer group">
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-500/15 transition-colors">
            <Upload className="w-5 h-5 text-pink-400" />
          </div>
          <p className="text-sm font-medium text-foreground">Drop files here or click to browse</p>
          <p className="text-xs text-muted-foreground mt-1">PDF, TXT, images up to 20MB · AI will auto-summarize</p>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div {...fade(0.08)}>
        <div className="glass rounded-xl flex items-center gap-3 px-4 py-2.5 border border-white/5">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
      </motion.div>

      {/* Document list */}
      <div className="space-y-3">
        {filtered.map((doc, i) => {
          const cfg = typeConfig[doc.type];
          const isExpanded = expandedId === doc.id;
          return (
            <motion.div key={doc.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <div className="glass rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-colors">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : doc.id)}
                  className="w-full flex items-center gap-4 p-4 text-left"
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", cfg.bg)}>
                    <cfg.icon className={cn("w-5 h-5", cfg.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{doc.title}</p>
                    <p className="text-xs text-muted-foreground">{doc.uploadedAt} · {doc.size}</p>
                  </div>
                  <span className={cn("px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase", cfg.bg, cfg.color)}>
                    {cfg.label}
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-white/5 p-5 space-y-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                          <span className="text-xs font-semibold text-pink-400 uppercase tracking-wider">AI Summary</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{doc.summary}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Key Points</p>
                        <div className="flex flex-wrap gap-2">
                          {doc.keyPoints.map((point, j) => (
                            <span key={j} className="px-3 py-1 rounded-full text-xs bg-pink-500/10 text-pink-400 border border-pink-500/20">
                              {point}
                            </span>
                          ))}
                        </div>
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
