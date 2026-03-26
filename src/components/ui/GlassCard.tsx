import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: "cyan" | "purple" | "green" | "pink" | "none";
  hover3d?: boolean;
}

export function GlassCard({ className, glow = "none", hover3d = false, children, ...props }: GlassCardProps) {
  const glowClass = {
    cyan: "neon-glow-cyan",
    purple: "neon-glow-purple",
    green: "neon-glow-green",
    pink: "",
    none: "",
  }[glow];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "glass rounded-xl p-6",
        hover3d && "perspective-card",
        glowClass,
        className
      )}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
}
