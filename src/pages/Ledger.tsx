import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, Sparkles, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
}

const initialTransactions: Transaction[] = [
  { id: "1", type: "income", amount: 5200, category: "Salary", description: "Monthly salary", date: "2026-03-25" },
  { id: "2", type: "expense", amount: 42, category: "Groceries", description: "Weekly groceries", date: "2026-03-25" },
  { id: "3", type: "expense", amount: 120, category: "Utilities", description: "Electric bill", date: "2026-03-24" },
  { id: "4", type: "income", amount: 350, category: "Freelance", description: "Logo design project", date: "2026-03-23" },
  { id: "5", type: "expense", amount: 89, category: "Entertainment", description: "Concert tickets", date: "2026-03-22" },
  { id: "6", type: "expense", amount: 450, category: "Professional", description: "Medical conference fee", date: "2026-03-21" },
];

const categories = ["Salary", "Freelance", "Consulting", "Groceries", "Utilities", "Entertainment", "Transport", "Health", "Professional", "Other"];

export default function Ledger() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [showAdd, setShowAdd] = useState(false);
  const [newTx, setNewTx] = useState({ type: "expense" as "income" | "expense", amount: "", category: "Other", description: "" });

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const addTransaction = () => {
    if (!newTx.amount || !newTx.description) return;
    setTransactions((prev) => [
      { id: Date.now().toString(), ...newTx, amount: parseFloat(newTx.amount), date: new Date().toISOString().split("T")[0] },
      ...prev,
    ]);
    setNewTx({ type: "expense", amount: "", category: "Other", description: "" });
    setShowAdd(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div {...fade(0)} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Finance Ledger</h1>
          <p className="text-sm text-muted-foreground mt-1">Track income, expenses and AI-powered insights</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/15 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Transaction
        </button>
      </motion.div>

      {/* Summary cards */}
      <motion.div {...fade(0.05)} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5 border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-teal-500/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Income</p>
          </div>
          <p className="text-2xl font-bold text-emerald-400">${totalIncome.toLocaleString()}</p>
        </div>
        <div className="glass rounded-2xl p-5 border border-red-500/20 bg-gradient-to-br from-red-500/10 to-rose-500/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/15 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-red-400" />
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Expenses</p>
          </div>
          <p className="text-2xl font-bold text-red-400">${totalExpense.toLocaleString()}</p>
        </div>
        <div className="glass rounded-2xl p-5 border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-indigo-500/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Net Balance</p>
          </div>
          <p className={cn("text-2xl font-bold", balance >= 0 ? "text-blue-400" : "text-red-400")}>${balance.toLocaleString()}</p>
        </div>
      </motion.div>

      {/* AI insight */}
      <motion.div {...fade(0.1)} className="glass rounded-2xl p-4 bg-gradient-to-r from-blue-500/8 to-purple-500/5 border border-blue-500/15 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-blue-400 mb-1">Finance Insight</p>
          <p className="text-xs text-muted-foreground">Your professional expenses this month are $450. These may be tax-deductible. Consider logging them under "Professional Development" for easier tax filing.</p>
        </div>
      </motion.div>

      {/* Add form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            <div className="glass rounded-2xl p-5 border border-emerald-500/15 space-y-4">
              <div className="flex gap-2">
                {(["income", "expense"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setNewTx((p) => ({ ...p, type: t }))}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm border transition-all capitalize font-medium",
                      newTx.type === t
                        ? t === "income" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"
                        : "bg-white/5 text-muted-foreground border-white/10"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={newTx.amount}
                  onChange={(e) => setNewTx((p) => ({ ...p, amount: e.target.value }))}
                  type="number"
                  placeholder="Amount ($)"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-emerald-500/30 transition-colors"
                />
                <select
                  value={newTx.category}
                  onChange={(e) => setNewTx((p) => ({ ...p, category: e.target.value }))}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-foreground outline-none"
                >
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex gap-3">
                <input
                  value={newTx.description}
                  onChange={(e) => setNewTx((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Description"
                  onKeyDown={(e) => e.key === "Enter" && addTransaction()}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-emerald-500/30 transition-colors"
                />
                <button onClick={addTransaction} className="px-5 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 text-sm font-medium border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors">
                  Add
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transaction list */}
      <motion.div {...fade(0.15)}>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Transactions</p>
        <div className="glass rounded-2xl divide-y divide-white/5">
          {transactions.map((tx, i) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 px-4 py-3.5"
            >
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", tx.type === "income" ? "bg-emerald-500/15" : "bg-red-500/15")}>
                {tx.type === "income" ? <ArrowUpRight className="w-4 h-4 text-emerald-400" /> : <ArrowDownRight className="w-4 h-4 text-red-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{tx.description}</p>
                <p className="text-xs text-muted-foreground">{tx.category}</p>
              </div>
              <div className="text-right">
                <p className={cn("text-sm font-semibold", tx.type === "income" ? "text-emerald-400" : "text-red-400")}>
                  {tx.type === "income" ? "+" : "-"}${tx.amount.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">{tx.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
