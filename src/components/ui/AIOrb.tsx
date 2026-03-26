import { cn } from "@/lib/utils";

interface AIOrbProps {
  size?: "sm" | "md" | "lg";
  animate?: boolean;
  className?: string;
}

export function AIOrb({ size = "md", animate = true, className }: AIOrbProps) {
  const sizeClasses = { sm: "w-6 h-6", md: "w-10 h-10", lg: "w-16 h-16" };
  const innerSize = { sm: "w-3 h-3", md: "w-5 h-5", lg: "w-8 h-8" };

  return (
    <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)}>
      {/* Outer glow ring */}
      <div className={cn(
        "absolute inset-0 rounded-full bg-primary/20 blur-md",
        animate && "animate-pulse-glow"
      )} />
      {/* Orbiting particle */}
      <div
        className="absolute w-1.5 h-1.5 rounded-full bg-neon-purple"
        style={{ animation: animate ? "orbit 3s linear infinite" : "none" }}
      />
      {/* Core */}
      <div className={cn(
        "relative rounded-full bg-gradient-to-br from-primary to-neon-purple",
        innerSize[size],
        animate && "animate-pulse-glow"
      )} />
    </div>
  );
}
