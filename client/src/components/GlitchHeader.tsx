import { cn } from "@/lib/utils";

interface GlitchHeaderProps {
  text: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function GlitchHeader({ text, className, size = "lg" }: GlitchHeaderProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
    xl: "text-6xl",
  };

  return (
    <h1
      className={cn(
        "font-display font-bold uppercase tracking-tighter text-foreground glitch-text",
        sizeClasses[size],
        className
      )}
      data-text={text}
    >
      {text}
    </h1>
  );
}
