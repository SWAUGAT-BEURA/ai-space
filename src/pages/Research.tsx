import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Globe, BookOpen, CheckCircle, Loader2, Sparkles, ExternalLink, Clock, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

const suggestedQueries = [
  "GST rules for freelancers in India",
  "Best investment options for doctors 2026",
  "Legal contract clauses to watch out for",
  "Tax deductions for self-employed professionals",
  "How to structure a retainer agreement",
];

interface ResearchResult {
  query: string;
  summary: string;
  sources: { title: string; url: string; domain: string }[];
  keyPoints: string[];
  timestamp: string;
}

const mockResults: Record<string, ResearchResult> = {
  default: {
    query: "",
    summary: "Based on multiple authoritative sources, here is a comprehensive summary of your query. The research agent has aggregated information from top sources and verified key facts for accuracy.",
    sources: [
      { title: "Official Government Portal", url: "#", domain: "gov.in" },
      { title: "Financial Times Analysis", url: "#", domain: "ft.com" },
      { title: "Expert Legal Commentary", url: "#", domain: "legalservices.com" },
    ],
    keyPoints: [
      "Key finding #1 with verified data",
      "Important regulation or rule to note",
      "Actionable recommendation for professionals",
      "Common misconception clarified",
    ],
    timestamp: "Just now",
  },
};

const recentSearches = [
  { query: "GST rules for freelancers", time: "2 hrs ago" },
  { query: "Investment options comparison 2026", time: "Yesterday" },
  { query: "Contract termination clauses", time: "2 days ago" },
];

export default function Research() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);

  const handleSearch = (q?: string) => {
    const searchQuery = q ?? query;
    if (!searchQuery.trim()) return;
    setQuery(searchQuery);
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult({ ...mockResults.default, query: searchQuery });
      setLoading(false);
    }, 1800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div {...fade(0)}>
        <h1 className="text-2xl font-bold text-white mb-1">Research Agent</h1>
        <p className="text-sm text-muted-foreground">Ask anything — web search, summarization & fact verification</p>
      </motion.div>

      {/* Search bar */}
      <motion.div {...fade(0.05)}>
        <div className="glass rounded-2xl p-1.5 flex items-center gap-2 border border-cyan-500/20 focus-within:border-cyan-500/40 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0 ml-1">
            <Search className="w-4 h-4 text-cyan-400" />
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Ask the Research Agent anything..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none py-2"
          />
          <button
            onClick={() => handleSearch()}
            disabled={loading || !query.trim()}
            className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 text-sm font-medium border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors disabled:opacity-40 mr-1"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
          </button>
        </div>
      </motion.div>

      {/* Suggested queries */}
      {!result && !loading && (
        <motion.div {...fade(0.1)}>
          <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Suggested for you</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQueries.map((q) => (
              <button
                key={q}
                onClick={() => handleSearch(q)}
                className="px-3 py-2 rounded-xl glass text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all border border-white/5 hover:border-cyan-500/20"
              >
                {q}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Loading state */}
      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass rounded-2xl p-8 text-center border border-cyan-500/15">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
            </div>
            <p className="text-sm font-medium text-foreground">Researching across multiple sources...</p>
            <p className="text-xs text-muted-foreground mt-1">Aggregating, verifying and summarizing</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Summary */}
            <div className="glass rounded-2xl p-6 border border-cyan-500/15">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">AI Summary</span>
                <span className="ml-auto text-xs text-muted-foreground">{result.timestamp}</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-4">{result.summary}</p>
              <div className="space-y-2">
                {result.keyPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sources */}
            <div className="glass rounded-2xl p-5 border border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sources</span>
              </div>
              <div className="space-y-2">
                {result.sources.map((src, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold text-muted-foreground">{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{src.title}</p>
                      <p className="text-xs text-muted-foreground">{src.domain}</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent searches */}
      {!result && !loading && (
        <motion.div {...fade(0.15)}>
          <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Recent Searches</p>
          <div className="glass rounded-2xl divide-y divide-white/5">
            {recentSearches.map((s, i) => (
              <button key={i} onClick={() => handleSearch(s.query)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/3 transition-colors text-left">
                <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm text-foreground flex-1">{s.query}</span>
                <span className="text-xs text-muted-foreground">{s.time}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
