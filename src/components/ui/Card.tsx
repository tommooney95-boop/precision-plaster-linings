import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-surface-border bg-surface p-6 shadow-card md:p-8",
        hover && "card-hover",
        className
      )}
    >
      {children}
    </div>
  );
}
