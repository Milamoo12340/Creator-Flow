import { FileText, Link, Shield, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface EvidenceSource {
  type: "document" | "link" | "leak" | "intercept";
  title: string;
  date?: string;
  confidence: number;
  url?: string;
  snippet?: string;
}

interface EvidenceCardProps {
  sources: EvidenceSource[];
  className?: string;
}

export function EvidenceCard({ sources, className }: EvidenceCardProps) {
  return (
    <div className={cn("mt-4 space-y-2", className)}>
      <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono flex items-center gap-2">
        <Shield className="w-3 h-3" />
        Corroborating Evidence
      </h4>
      <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
        {sources.map((source, idx) => (
          <Card key={idx} className="bg-black/40 border-primary/20 hover:border-primary/50 transition-colors">
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-primary/70">
                  {source.type === "document" && <FileText className="w-4 h-4" />}
                  {source.type === "link" && <Link className="w-4 h-4" />}
                  {source.type === "leak" && <AlertTriangle className="w-4 h-4 text-destructive" />}
                  {source.type === "intercept" && <Shield className="w-4 h-4" />}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-primary/90 font-display uppercase truncate max-w-[150px]">
                      {source.title}
                    </span>
                    <span className={cn(
                      "text-[9px] px-1.5 py-0.5 rounded-sm font-mono",
                      source.confidence > 80 ? "bg-primary/20 text-primary" : "bg-yellow-500/20 text-yellow-500"
                    )}>
                      {source.confidence}% VERIFIED
                    </span>
                  </div>
                  {source.date && (
                    <div className="text-[10px] text-muted-foreground font-mono">
                      DATED: {source.date}
                    </div>
                  )}
                  {source.snippet && (
                    <p className="text-[10px] text-muted-foreground/80 font-mono leading-tight line-clamp-2 border-l border-primary/20 pl-2 mt-1">
                      "{source.snippet}"
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
