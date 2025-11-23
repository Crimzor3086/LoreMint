import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "cosmic" | "magic" | "emerald" | "gold";
  size?: "sm" | "md" | "lg";
}

export function GradientButton({
  children,
  variant = "cosmic",
  size = "md",
  className,
  ...props
}: GradientButtonProps) {
  const variantClass = {
    cosmic: "bg-gradient-cosmic hover:brightness-110",
    magic: "bg-gradient-magic hover:brightness-110",
    emerald: "bg-gradient-emerald hover:brightness-110",
    gold: "bg-gradient-gold hover:brightness-110",
  }[variant];

  const sizeClass = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }[size];

  return (
    <button
      className={cn(
        "rounded-lg font-semibold text-white shadow-lg transition-all duration-300",
        "hover:scale-105 hover:shadow-glow",
        variantClass,
        sizeClass,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}