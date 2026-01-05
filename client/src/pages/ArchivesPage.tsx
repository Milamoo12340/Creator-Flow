import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GlitchHeader } from "@/components/GlitchHeader";
import { FileText, Lock, Unlock, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export function ArchivesPage() {
  return (
    <div className="h-full w-full p-4 lg:p-8 overflow-y-auto">
      <div className="mb-8">
        <GlitchHeader text="DECLASSIFIED ARCHIVES" size="lg" />
        <p className="text-muted-foreground font-mono mt-2 max-w-2xl">
          WARNING: Some records in this database are fragmented or partially redacted. 
          Accessing restricted files may trigger security protocols.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-20 border border-dashed border-primary/20 rounded-lg bg-card/20">
        <AlertTriangle className="w-12 h-12 text-primary/40 mb-4" />
        <h3 className="text-xl font-display text-primary/60">DATABASE EMPTY</h3>
        <p className="text-muted-foreground font-mono mt-2">No declassified documents found in current sector.</p>
      </div>
    </div>
  );
}
