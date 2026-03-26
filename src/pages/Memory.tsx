import { motion } from "framer-motion";
import { Database, User, Settings, Tag, Clock, Sparkles, Brain, Shield, Trash2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

interface MemoryItem {
  id: string;
  category: string;
  key: string;
  value: string;
  source: string;
  timestamp: string;
}

const memoryItems: MemoryItem[] = [
  { id: "1", category: "Preferences", key: "Profession", value: "Medical Doctor — Cardiologist", source: "Profile", timestamp: "2026-03-01" },
  { id: "2", category: "Preferences", key: "Work Hours", value: "Mon–Fri, 9 AM – 6 PM", source: "Calendar", timestamp: "2026-03-10" },
  { id: "3", category: "Preferences", key: "Currency", value: "USD", source: "Ledger", timestamp: "2026-03-15" },
  { id: "4", category: "Behavior", key: "Task Priority Style", value: "Prefers high-priority tasks first", source: "Task Agent", timestamp: "2026-03-20" },
  { id: "5", category: "Behavior", key: "Email Response Time", value: "Usually replies within 4 hours", source: "Email Agent", timestamp: "2026-03-22" },
  { id: "6", category: "Context", key: "Active Projects", value: "Clinic expansion, Research paper, Tax filing", source: "Task Agent", timestamp: "2026-03-24" },
  { id: "7", category: "Context", key: "Key Clients", value: "Acme Corp, Dr. Sharma's Clinic, LegalEase Ltd", source: "Email Agent", timestamp: "2026-03-25" },
  { id: "8", category: "Finance", key: "Monthly Budget", value: "$6,000 target", source: "Ledger", timestamp: "2026-03-01" },
  { id: "9", category: "Finance", key: "Tax Category", value: "Self-employed professional", source: "Ledger", timestamp: "2026-03-15" },
];

const categoryConfig: Record<string, { color: string; bg: string; border: string }> = {
  Preferences: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  Behavior: { color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  Context: { color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  Finance: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
};

const categories = ["All", "Preferences", "Behavior", "Context", "Finance"];

export default function Memory() {
  const [filter, setFilter] = useState("All");
  const [items, setItems] = useState<MemoryItem[]>(memoryItems);

  const filtered = filter === "All" ? items : items.filter((m) => m.category === filter);
  const deleteItem = (id: string) => setItems((prev) => prev.filter((m) => m.id !== id));

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div {...fade(0)} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Memory Agent</h1>
          <p className="text-sm text-muted-foreground mt-1">{items.length} stored memories · personalization context</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass border border-violet-500/20">
          <Shield className="w-4 h-4 text-violet-400" />
          <span className="text-xs text-violet-400 font-medium">Private & Encrypted</span>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div {...fade(0.05)} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.slice(1).map((cat) => {
          const cfg = categoryConfig[cat];
          const count = items.filter((m) => m.category === cat).length;
          return (
            <div key={cat} className={cn("glass rounded-2xl p-4 border", cfg.border)}>
              <p className={`text-xl font-bold ${cfg.color}`}>{count}</p>
              <p className="text-xs text-muted-foreground mt-1">{cat}</p>
            </div>
          );
        })}
      </motion.div>

      {/* AI insight */}
      <motion.div {...fade(0.08)} className="glass rounded-2xl p-4 bg-gradient-to-r from-violet-500/8 to-purple-500/5 border border-violet-500/15 flex items-start gap-3">
        <Brain className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-violet-400 mb-1">Memory Insight</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Based on your behavior patterns, the AI has learned you prefer concise summaries and high-priority task ordering. Your finance context helps the Ledger Agent auto-categorize transactions.
          </p>
        </div>
      </motion.div>

      {/* Filter */}
      <motion.div {...fade(0.1)} className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              filter === cat
                ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                : "glass text-muted-foreground hover:text-foreground"
            )}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Memory items */}
      <div className="space-y-2">
        {filtered.map((item, i) => {
          const cfg = categoryConfig[item.category];
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl px-4 py-3.5 flex items-center gap-4 group hover:bg-white/3 transition-colors"
            >
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", cfg.bg)}>
                <Tag className={cn("w-3.5 h-3.5", cfg.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{item.key}</p>
                  <span className={cn("px-2 py-0.5 rounded-md text-[10px] font-medium border", cfg.bg, cfg.color, cfg.border)}>
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{item.value}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {item.timestamp}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">via {item.source}</p>
              </div>
              <button
                onClick={() => deleteItem(item.id)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
