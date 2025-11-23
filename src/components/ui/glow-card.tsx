import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "primary" | "accent" | "emerald";
  hover?: boolean;
}

export function GlowCard({ children, className, glowColor = "primary", hover = true }: GlowCardProps) {
  const glowClass = {
    primary: "shadow-glow",
    accent: "shadow-glow-accent",
    emerald: "shadow-glow-emerald",
  }[glowColor];

  return (
    <div
      className={cn(
        "glass rounded-lg p-6",
        glowClass,
        hover && "glass-hover transition-all duration-300 hover:scale-[1.02]",
        className
      )}
    >
      {children}
    </div>
  );
}